/**
 * Section 6: Main Engine - Orchestrates clock, simulation, and state
 */

import { VirtualClock } from "./clock.js";
import { MicrogridSimulator } from "./simulation.js";
import type { HomeState, MicrogridConfig, TickState, DailyRollup, SimMode, SSEDelta } from "./types.js";
import { EventEmitter } from "events";

export class MicrogridEngine extends EventEmitter {
  private clock: VirtualClock;
  private simulator: MicrogridSimulator;
  private homes: HomeState[];
  private config: MicrogridConfig;
  private tickHistory: TickState[] = [];
  private currentState: TickState | null = null;
  private dailyRollup: DailyRollup | null = null;
  private historyLimit = 4320; // 3 days * 24 hours * 60 minutes

  constructor(seed: number = 42) {
    super();
    this.clock = new VirtualClock(new Date("2025-10-04T00:00:00"), "accelerated");
    this.simulator = new MicrogridSimulator(seed);
    this.homes = this.initializeHomes();
    this.config = this.initializeConfig();
  }

  /**
   * Start the simulation
   */
  start(mode: SimMode = "accelerated"): void {
    this.clock.setMode(mode);
    this.clock.start(() => this.onTick());
  }

  /**
   * Pause simulation
   */
  pause(): void {
    this.clock.pause();
  }

  /**
   * Resume simulation
   */
  resume(): void {
    this.clock.resume();
  }

  /**
   * Reset simulation
   */
  reset(seed: number, mode: SimMode): void {
    this.clock.reset(new Date("2025-10-04T00:00:00"), mode);
    this.simulator.reset(seed);
    this.homes = this.initializeHomes();
    this.tickHistory = [];
    this.currentState = null;
    this.dailyRollup = null;
  }

  /**
   * Get current state
   */
  getCurrentState(): TickState | null {
    return this.currentState;
  }

  /**
   * Get homes
   */
  getHomes(): HomeState[] {
    return this.homes;
  }

  /**
   * Get config
   */
  getConfig(): MicrogridConfig {
    return this.config;
  }

  /**
   * Get daily rollup
   */
  getDailyRollup(): DailyRollup | null {
    return this.dailyRollup;
  }

  /**
   * Add event
   */
  addEvent(type: "OUTAGE" | "CLOUDBURST" | "HEATWAVE" | "EV_SURGE", durationMin: number, params?: any): void {
    const minuteOfDay = this.clock.minuteOfDay();
    this.config.events.push({
      type,
      start_minute: minuteOfDay,
      end_minute: minuteOfDay + durationMin,
      params
    });
    console.log(`🎭 Event added: ${type} for ${durationMin} minutes`);
  }

  /**
   * Update policy
   */
  updatePolicy(allocation: "equal" | "need" | "cap", fairRateCents?: number): void {
    this.config.allocation = allocation;
    if (fairRateCents !== undefined) {
      this.config.fair_rate_cents_per_kwh = fairRateCents;
    }
    console.log(`⚙️  Policy updated: ${allocation}, fair rate: ${this.config.fair_rate_cents_per_kwh}¢`);
  }

  /**
   * Tick handler
   */
  private onTick(): void {
    const timestamp = this.clock.now();
    const minuteOfDay = this.clock.minuteOfDay();

    // Run simulation
    const state = this.simulator.tick(this.homes, this.config, timestamp, minuteOfDay);
    this.currentState = state;

    // Store in history (ring buffer)
    this.tickHistory.push(state);
    if (this.tickHistory.length > this.historyLimit) {
      this.tickHistory.shift();
    }

    // Update daily rollup
    this.updateDailyRollup(state);

    // Emit SSE delta
    const delta = this.buildSSEDelta(state);
    this.emit("tick", delta);

    // Validation
    this.validateTick(state);
  }

  /**
   * Build SSE delta (compact JSON)
   */
  private buildSSEDelta(state: TickState): SSEDelta {
    return {
      ts: state.timestamp.toISOString(),
      homes: state.homes.map(h => ({
        id: h.id,
        pv: Math.round(h.pv_kw),
        load: Math.round(h.load_kw),
        soc: Math.round((h.soc_kwh / h.battery_capacity_kwh) * 100),
        share: Math.round(h.share_kw * 100) / 100,
        recv: Math.round(h.recv_kw * 100) / 100,
        imp: Math.round(h.grid_in_kw * 100) / 100,
        exp: Math.round(h.grid_out_kw * 100) / 100,
        creditsDelta: Math.round(h.credits_delta_kwh * 1000) / 1000
      })),
      grid: {
        imp: Math.round(state.community_totals.grid_import_kw),
        exp: Math.round(state.community_totals.grid_export_kw)
      },
      community: {
        prod: Math.round(state.community_totals.production_kw),
        mg_used: Math.round(state.community_totals.microgrid_used_kw * 100) / 100,
        unserved: Math.round(state.community_totals.unserved_kw * 100) / 100
      }
    };
  }

  /**
   * Update daily rollup
   */
  private updateDailyRollup(state: TickState): void {
    const dateStr = state.timestamp.toISOString().split("T")[0];
    
    if (!this.dailyRollup || this.dailyRollup.date !== dateStr) {
      // New day - reset
      this.dailyRollup = {
        date: dateStr,
        production_kwh: 0,
        microgrid_used_kwh: 0,
        grid_import_kwh: 0,
        grid_export_kwh: 0,
        unserved_kwh: 0,
        homes: state.homes.map(h => ({
          id: h.id,
          produced_kwh: 0,
          consumed_kwh: 0,
          shared_kwh: 0,
          received_kwh: 0,
          credits_net_kwh: 0
        }))
      };
    }

    // Accumulate (1 minute = 1/60 hour)
    const dt = 1 / 60;
    this.dailyRollup.production_kwh += state.community_totals.production_kw * dt;
    this.dailyRollup.microgrid_used_kwh += state.community_totals.microgrid_used_kw * dt;
    this.dailyRollup.grid_import_kwh += state.community_totals.grid_import_kw * dt;
    this.dailyRollup.grid_export_kwh += state.community_totals.grid_export_kw * dt;
    this.dailyRollup.unserved_kwh += state.community_totals.unserved_kw * dt;

    for (let i = 0; i < state.homes.length; i++) {
      const home = state.homes[i];
      const rollup = this.dailyRollup.homes[i];
      rollup.produced_kwh += home.pv_kw * dt;
      rollup.consumed_kwh += home.load_kw * dt;
      rollup.shared_kwh += home.share_kw * dt;
      rollup.received_kwh += home.recv_kw * dt;
      rollup.credits_net_kwh += home.credits_delta_kwh;
    }
  }

  /**
   * Validate tick (Section 9)
   */
  private validateTick(state: TickState): void {
    const warnings: string[] = [];

    // Check SOC bounds
    for (const home of state.homes) {
      const soc_pct = (home.soc_kwh / home.battery_capacity_kwh) * 100;
      if (soc_pct < 0 || soc_pct > 100) {
        warnings.push(`${home.id}: SOC out of bounds: ${soc_pct.toFixed(1)}%`);
      }
      if (home.pv_kw < 0 || home.load_kw < 0 || home.charge_kw < 0 || home.discharge_kw < 0) {
        warnings.push(`${home.id}: Negative power flow detected`);
      }
    }

    // Check credits conservation
    const total_credits_delta = state.homes.reduce((sum, h) => sum + h.credits_delta_kwh, 0);
    if (Math.abs(total_credits_delta) > 0.01) {
      warnings.push(`Credits not conserved: ${total_credits_delta.toFixed(4)} kWh`);
    }

    // Check energy balance
    const dt = 1 / 60;
    const sources = state.homes.reduce((sum, h) => 
      sum + h.pv_kw * dt + h.discharge_kw * dt + h.recv_kw * dt + h.grid_in_kw * dt, 0
    );
    const sinks = state.homes.reduce((sum, h) => 
      sum + h.load_kw * dt + h.charge_kw * dt + h.share_kw * dt + h.grid_out_kw * dt, 0
    );
    if (Math.abs(sources - sinks) > 0.01) {
      warnings.push(`Energy balance off: ${(sources - sinks).toFixed(4)} kWh`);
    }

    if (warnings.length > 0) {
      console.warn(`⚠️  Validation warnings:\n  ${warnings.join("\n  ")}`);
    }
  }

  /**
   * Initialize homes (20 homes with varied configurations)
   */
  private initializeHomes(): HomeState[] {
    const configs = [
      { id: "H1", pv: 8.0, batt: 13.5, scale: 1.0, critical: false },
      { id: "H2", pv: 6.5, batt: 10.0, scale: 1.1, critical: false },
      { id: "H3", pv: 7.5, batt: 12.0, scale: 0.9, critical: false },
      { id: "H4", pv: 5.0, batt: 8.0, scale: 1.3, critical: true },
      { id: "H5", pv: 6.0, batt: 10.0, scale: 1.0, critical: false },
      { id: "H6", pv: 4.5, batt: 7.0, scale: 1.4, critical: true },
      { id: "H7", pv: 5.5, batt: 9.0, scale: 1.2, critical: false },
      { id: "H8", pv: 7.0, batt: 11.0, scale: 0.9, critical: false },
      { id: "H9", pv: 3.5, batt: 5.0, scale: 1.5, critical: true },
      { id: "H10", pv: 6.5, batt: 10.5, scale: 1.1, critical: false },
      { id: "H11", pv: 7.0, batt: 11.0, scale: 1.0, critical: false },
      { id: "H12", pv: 5.5, batt: 9.0, scale: 1.2, critical: false },
      { id: "H13", pv: 6.0, batt: 10.0, scale: 1.1, critical: true },
      { id: "H14", pv: 4.0, batt: 6.0, scale: 1.4, critical: false },
      { id: "H15", pv: 7.5, batt: 12.0, scale: 0.9, critical: false },
      { id: "H16", pv: 5.0, batt: 8.0, scale: 1.3, critical: true },
      { id: "H17", pv: 6.5, batt: 10.0, scale: 1.0, critical: false },
      { id: "H18", pv: 8.0, batt: 13.5, scale: 0.8, critical: false },
      { id: "H19", pv: 4.5, batt: 7.0, scale: 1.5, critical: true },
      { id: "H20", pv: 6.0, batt: 10.0, scale: 1.1, critical: false },
    ];

    return configs.map(c => ({
      id: c.id,
      pv_size_kwp: c.pv,
      household_scale: c.scale,
      battery_capacity_kwh: c.batt,
      soc_kwh: c.batt * 0.5, // Start at 50%
      max_charge_kw: c.batt * 0.5, // 0.5C charge rate
      max_discharge_kw: c.batt * 0.5, // 0.5C discharge rate
      reserve_floor_pct: 0.2,
      policy: {
        allow_discharge: true,
        day_soc_target_pct: 0.9,
        critical: c.critical
      },
      credits_balance_kwh: 0,
      // Ephemeral (will be updated each tick)
      pv_kw: 0,
      load_kw: 0,
      charge_kw: 0,
      discharge_kw: 0,
      share_kw: 0,
      recv_kw: 0,
      grid_in_kw: 0,
      grid_out_kw: 0,
      credits_delta_kwh: 0
    }));
  }

  /**
   * Initialize config
   */
  private initializeConfig(): MicrogridConfig {
    return {
      fair_rate_cents_per_kwh: 18,
      import_price_cents: 30,
      export_price_cents: 7,
      allocation: "equal",
      events: []
    };
  }
}

