import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://iecudbrhqkmzdjfnephs.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllY3VkYnJocWttemRqZm5lcGhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU3MzA4MiwiZXhwIjoyMDc1MTQ5MDgyfQ.P-AcG4vO3w5sQAUC_MwiAMRkKzGhgq9G-nXZwpefLY0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export type Database = {
  public: {
    Tables: {
      tick_state: {
        Row: {
          credits_delta_wh: number;
          grid_export_w: number;
          grid_import_w: number;
          home_id: string;
          load_w: number;
          microgrid_id: string;
          pv_w: number;
          receiving_w: number;
          sharing_w: number;
          soc_pct: number;
          ts: string;
        };
        Insert: {
          credits_delta_wh: number;
          grid_export_w: number;
          grid_import_w: number;
          home_id: string;
          load_w: number;
          microgrid_id: string;
          pv_w: number;
          receiving_w: number;
          sharing_w: number;
          soc_pct: number;
          ts: string;
        };
        Update: {
          credits_delta_wh?: number;
          grid_export_w?: number;
          grid_import_w?: number;
          home_id?: string;
          load_w?: number;
          microgrid_id?: string;
          pv_w?: number;
          receiving_w?: number;
          sharing_w?: number;
          soc_pct?: number;
          ts?: string;
        };
      };
      tick_state_community: {
        Row: {
          grid_export_w: number;
          grid_import_w: number;
          microgrid_id: string;
          microgrid_used_w: number;
          production_w: number;
          ts: string;
          unserved_w: number;
        };
        Insert: {
          grid_export_w: number;
          grid_import_w: number;
          microgrid_id: string;
          microgrid_used_w: number;
          production_w: number;
          ts: string;
          unserved_w?: number;
        };
        Update: {
          grid_export_w?: number;
          grid_import_w?: number;
          microgrid_id?: string;
          microgrid_used_w?: number;
          production_w?: number;
          ts?: string;
          unserved_w?: number;
        };
      };
      simulation_clock: {
        Row: {
          last_tick_at: string | null;
          microgrid_id: string;
          mode: "paused" | "realtime" | "accelerated";
          sim_time: string;
          speed: number;
        };
        Insert: {
          last_tick_at?: string | null;
          microgrid_id: string;
          mode?: "paused" | "realtime" | "accelerated";
          sim_time?: string;
          speed?: number;
        };
        Update: {
          last_tick_at?: string | null;
          microgrid_id?: string;
          mode?: "paused" | "realtime" | "accelerated";
          sim_time?: string;
          speed?: number;
        };
      };
    };
  };
};

