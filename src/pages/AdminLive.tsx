/**
 * Admin Live Simulator Dashboard - Real-time SSE streaming
 */

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Activity, Battery, TrendingUp, TrendingDown, Play, Pause, RotateCcw, CloudRain, Flame, Car, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { NeighborhoodMap, type HomeNodeData } from "@/components/admin/NeighborhoodMap";

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
  const [liveData, setLiveData] = useState<SSEData | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const maxDataPoints = 120; // Keep last 120 points (1 minute in accelerated mode)

  // Connect to SSE stream
  useEffect(() => {
    const es = new EventSource("http://localhost:3001/stream");

    es.onopen = () => {
      console.log("✅ Connected to live simulator");
      setConnected(true);
      setError(null);
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLiveData(data);

        // Add to chart data
        const time = new Date(data.ts);
        const totalConsumption = data.homes.reduce((sum: number, h: SSEHome) => sum + h.load, 0);
        
        const newPoint: ChartDataPoint = {
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timestamp: time.getTime(),
          production: Math.round(data.community.prod),
          consumption: Math.round(totalConsumption),
          shared: Math.round(data.community.mg_used * 10) / 10,
          gridImport: Math.round(data.grid.imp),
          gridExport: Math.round(data.grid.exp),
        };

        setChartData(prev => {
          const updated = [...prev, newPoint];
          // Keep only last N points
          if (updated.length > maxDataPoints) {
            return updated.slice(updated.length - maxDataPoints);
          }
          return updated;
        });
      } catch (err) {
        console.error("Failed to parse SSE data:", err);
      }
    };

    es.onerror = (err) => {
      console.error("SSE connection error:", err);
      setConnected(false);
      setError("Connection lost. Make sure simulator is running at http://localhost:3001");
    };

    setEventSource(es);

    return () => {
      es.close();
    };
  }, []);

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
        <AdminHeader />
        <div className="max-w-7xl mx-auto p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>To start the simulator:</p>
            <pre className="mt-2 p-4 bg-muted rounded">
              cd simulator-backend{"\n"}
              npm run dev
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!liveData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-pulse mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Connecting to live simulator...</p>
        </div>
      </div>
    );
  }

  const time = new Date(liveData.ts);
  const totalProducing = liveData.homes.filter(h => h.pv > 0).length;
  const totalSharing = liveData.homes.filter(h => h.share > 0).length;
  const avgSOC = Math.round(liveData.homes.reduce((sum, h) => sum + h.soc, 0) / liveData.homes.length);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className={`h-8 w-8 ${connected ? "text-green-500 animate-pulse" : "text-gray-400"}`} />
              Live Simulator
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time energy flow • Updated every 0.5s • 20 homes active
            </p>
          </div>
          <Badge variant={connected ? "default" : "secondary"} className="text-sm">
            {connected ? "🟢 LIVE" : "⚫ Disconnected"}
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
              <div className="text-3xl font-bold">{liveData.community.prod} kW</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalProducing} of 20 homes producing
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
              <div className="text-3xl font-bold">{liveData.community.mg_used.toFixed(1)} kW</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalSharing} homes sharing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {liveData.grid.imp > 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                )}
                Grid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {liveData.grid.imp > 0 ? (
                  <span className="text-red-500">↓ {liveData.grid.imp} kW</span>
                ) : (
                  <span className="text-blue-500">↑ {liveData.grid.exp} kW</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {liveData.grid.imp > 0 ? "Importing" : "Exporting"}
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

        {/* Neighborhood Map Visualization */}
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Live Home Status</h2>
            <p className="text-muted-foreground">Real-time power flows and battery state for all 20 homes</p>
          </div>
          <NeighborhoodMap homes={liveData.homes.map((home, idx) => ({
            id: home.id,
            pv_kw: home.pv,
            load_kw: home.load,
            soc_pct: home.soc,
            export_kw: home.exp,
            import_kw: home.imp,
            sharing_kw: home.share,
            receiving_kw: home.recv,
            status: 'ok',
            x: 0, // Will be auto-laid out
            y: 0,
          } as HomeNodeData))} />
        </div>

        {/* Unserved Load Warning */}
        {liveData.community.unserved > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Grid Outage Active:</strong> {liveData.community.unserved.toFixed(2)} kW of load is unserved
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

