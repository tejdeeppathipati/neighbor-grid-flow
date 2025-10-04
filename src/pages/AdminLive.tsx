/**
 * Admin Live Simulator Dashboard - Real-time SSE streaming
 */

import { useState, useEffect, useRef } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Activity, Battery, TrendingUp, TrendingDown, Play, Pause, RotateCcw, CloudRain, Flame, Car, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAdminData } from "@/hooks/useAdminData";

interface SSEHome {
  id: string;
  pv: number;
  load: number;
  soc: number;
  share: number;
  recv: number;
  imp: number;
  exp: number;
  creditsDelta: number;
}

interface SSEData {
  ts: string;
  homes: SSEHome[];
  grid: { imp: number; exp: number };
  community: { prod: number; mg_used: number; unserved: number };
}

interface ChartDataPoint {
  time: string;
  timestamp: number;
  production: number;
  consumption: number;
  shared: number;
  gridImport: number;
  gridExport: number;
}

export default function AdminLive() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const maxDataPoints = 60; // Keep last 60 points (1 hour of data)
  
  // Use Supabase data instead of SSE
  const { gridExchange, communityToday, homes, tariff, loading, error } = useAdminData("00000000-0000-0000-0000-000000000001");

  // Process database data for chart
  useEffect(() => {
    if (homes.length > 0 && communityToday && gridExchange) {
      const time = new Date();
      const totalConsumption = homes.reduce((sum, h) => sum + h.load_w, 0) / 1000; // Convert W to kW
      
      const newPoint: ChartDataPoint = {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: time.getTime(),
        production: Math.round(communityToday.prod_wh / 1000), // Convert Wh to kWh
        consumption: Math.round(totalConsumption),
        shared: Math.round(communityToday.mg_used_wh / 1000 * 10) / 10,
        gridImport: Math.round(gridExchange.from_grid_now_w_total / 1000),
        gridExport: Math.round(gridExchange.to_grid_now_w_total / 1000),
      };

      setChartData(prev => {
        const updated = [...prev, newPoint];
        // Keep only last N points
        if (updated.length > maxDataPoints) {
          return updated.slice(updated.length - maxDataPoints);
        }
        return updated;
      });
    }
  }, [homes, communityToday, gridExchange]);

  // Control functions
  const handlePause = async () => {
    await fetch("http://localhost:3001/sim/pause", { method: "POST" });
  };

  const handleResume = async () => {
    await fetch("http://localhost:3001/sim/resume", { method: "POST" });
  };

  const handleReset = async () => {
    await fetch("http://localhost:3001/sim/reset?seed=42&mode=accelerated", { method: "POST" });
    setChartData([]); // Clear chart on reset
  };

  const handleEvent = async (type: string, duration: number) => {
    await fetch("http://localhost:3001/sim/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, duration_min: duration }),
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader microgridId="00000000-0000-0000-0000-000000000001" />
        <div className="max-w-7xl mx-auto p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Database connection error. Make sure the backend is running and writing to Supabase.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !communityToday || !gridExchange) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-pulse mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading live data from database...</p>
        </div>
      </div>
    );
  }

  const time = new Date();
  const totalProducing = homes.filter(h => h.pv_w > 0).length;
  const totalSharing = homes.filter(h => h.sharing_w > 0).length;
  const avgSOC = homes.length > 0 ? Math.round(homes.reduce((sum, h) => sum + h.soc_pct, 0) / homes.length) : 0;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader microgridId="00000000-0000-0000-0000-000000000001" />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="h-8 w-8 text-green-500 animate-pulse" />
              Live Simulator
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time energy flow • Updated every minute • 20 homes active
            </p>
          </div>
          <Badge variant="default" className="text-sm">
            🟢 LIVE
          </Badge>
        </div>

        {/* Time & Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Simulation Time</CardTitle>
                <CardDescription>Virtual clock in accelerated mode (1 min = 0.5s)</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-mono font-bold">
                  {time.toLocaleTimeString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {time.toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" onClick={handlePause} variant="outline">
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
              <Button size="sm" onClick={handleResume} variant="outline">
                <Play className="h-4 w-4 mr-1" />
                Resume
              </Button>
              <Button size="sm" onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <div className="border-l mx-2" />
              <Button size="sm" onClick={() => handleEvent("CLOUDBURST", 60)} variant="secondary">
                <CloudRain className="h-4 w-4 mr-1" />
                Cloudburst (1h)
              </Button>
              <Button size="sm" onClick={() => handleEvent("HEATWAVE", 120)} variant="secondary">
                <Flame className="h-4 w-4 mr-1" />
                Heatwave (2h)
              </Button>
              <Button size="sm" onClick={() => handleEvent("EV_SURGE", 240)} variant="secondary">
                <Car className="h-4 w-4 mr-1" />
                EV Surge (4h)
              </Button>
              <Button size="sm" onClick={() => handleEvent("OUTAGE", 30)} variant="destructive">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Outage (30m)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Production
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(communityToday.prod_wh / 1000)} kW</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalProducing} of {homes.length} homes producing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                Microgrid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(communityToday.mg_used_wh / 1000).toFixed(1)} kW</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalSharing} homes sharing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {gridExchange && gridExchange.from_grid_now_w_total > 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                )}
                Grid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {gridExchange.from_grid_now_w_total > 0 ? (
                  <span className="text-red-500">↓ {Math.round(gridExchange.from_grid_now_w_total / 1000)} kW</span>
                ) : (
                  <span className="text-blue-500">↑ {Math.round(gridExchange.to_grid_now_w_total / 1000)} kW</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {gridExchange.from_grid_now_w_total > 0 ? "Importing" : "Exporting"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Battery className="h-4 w-4 text-purple-500" />
                Avg Battery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgSOC}%</div>
              <div className="w-full h-2 bg-muted rounded-full mt-2">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${avgSOC}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Energy Flow Timeline</CardTitle>
            <CardDescription>
              Live tracking of production, consumption, and shared energy (last {maxDataPoints} updates)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    interval={Math.floor(chartData.length / 8)}
                    stroke="hsl(var(--border))"
                  />
                  <YAxis
                    label={{
                      value: "Power (kW)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 12, fill: "hsl(var(--muted-foreground))" },
                    }}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    stroke="hsl(var(--border))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="production"
                    name="Production"
                    stroke="hsl(45 93% 58%)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="consumption"
                    name="Consumption"
                    stroke="hsl(0 66% 54%)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="shared"
                    name="Microgrid Shared"
                    stroke="hsl(158 74% 40%)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gridImport"
                    name="Grid Import"
                    stroke="hsl(218 100% 62%)"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="gridExport"
                    name="Grid Export"
                    stroke="hsl(187 100% 39%)"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                  <p>Collecting data... Chart will appear shortly</p>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            {chartData.length > 0 && (
              <div className="grid grid-cols-5 gap-4 mt-6 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "hsl(45 93% 58%)" }}>
                    {chartData[chartData.length - 1].production}
                  </div>
                  <div className="text-xs text-muted-foreground">Production (kW)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "hsl(0 66% 54%)" }}>
                    {chartData[chartData.length - 1].consumption}
                  </div>
                  <div className="text-xs text-muted-foreground">Consumption (kW)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "hsl(158 74% 40%)" }}>
                    {chartData[chartData.length - 1].shared}
                  </div>
                  <div className="text-xs text-muted-foreground">Shared (kW)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "hsl(218 100% 62%)" }}>
                    {chartData[chartData.length - 1].gridImport}
                  </div>
                  <div className="text-xs text-muted-foreground">Import (kW)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "hsl(187 100% 39%)" }}>
                    {chartData[chartData.length - 1].gridExport}
                  </div>
                  <div className="text-xs text-muted-foreground">Export (kW)</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Homes Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Live Home Status</CardTitle>
            <CardDescription>Real-time power flows and battery state for all 20 homes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {homes.map((home) => (
                <Card key={home.home_id} className="relative overflow-hidden">
                  <CardContent className="p-3">
                    <div className="font-mono font-bold text-sm mb-2">{home.home_id}</div>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">PV:</span>
                        <span className="font-mono font-semibold text-yellow-600">{(home.pv_w / 1000).toFixed(1)} kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Load:</span>
                        <span className="font-mono">{(home.load_w / 1000).toFixed(1)} kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SOC:</span>
                        <span className="font-mono">{home.soc_pct}%</span>
                      </div>
                      
                      {home.sharing_w > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Share:</span>
                          <span className="font-mono">{(home.sharing_w / 1000).toFixed(2)}</span>
                        </div>
                      )}
                      
                      {home.receiving_w > 0 && (
                        <div className="flex justify-between text-blue-600">
                          <span>Recv:</span>
                          <span className="font-mono">{(home.receiving_w / 1000).toFixed(2)}</span>
                        </div>
                      )}
                      
                      {home.grid_export_w > 0 && (
                        <div className="flex justify-between text-purple-600">
                          <span>Export:</span>
                          <span className="font-mono">{(home.grid_export_w / 1000).toFixed(1)}</span>
                        </div>
                      )}
                      
                      {home.grid_import_w > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Import:</span>
                          <span className="font-mono">{(home.grid_import_w / 1000).toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* SOC indicator */}
                    <div className="mt-2 w-full h-1 bg-muted rounded">
                      <div
                        className={`h-full rounded transition-all ${
                          home.soc_pct > 60 ? "bg-green-500" :
                          home.soc_pct > 30 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${home.soc_pct}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Unserved Load Warning */}
        {communityToday.unserved_wh > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Grid Outage Active:</strong> {(communityToday.unserved_wh / 1000).toFixed(2)} kW of load is unserved
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

