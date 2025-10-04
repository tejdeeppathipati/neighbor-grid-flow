/**
 * Admin Live Simulator Dashboard - Real-time SSE streaming
 */

import { useState, useEffect, useRef } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import InteractiveMap from "@/components/admin/InteractiveMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Activity, Battery, TrendingUp, TrendingDown, Play, Pause, RotateCcw, CloudRain, Flame, Car, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
  const maxDataPoints = 96; // Keep last 96 points (24 hours = 96 * 15min intervals)

  // Mapping from simulation IDs to family names
  const simIdToFamily: { [key: string]: string } = {
    'H001': 'Johnson',
    'H002': 'Smith', 
    'H003': 'Williams',
    'H004': 'Brown',
    'H005': 'Davis',
    'H006': 'Miller',
    'H007': 'Wilson',
    'H008': 'Moore',
    'H009': 'Taylor',
    'H010': 'Anderson',
    'H011': 'Garcia',
    'H012': 'Martinez',
    'H013': 'Rodriguez',
    'H014': 'Lopez',
    'H015': 'Gonzalez',
    'H016': 'Flores',
    'H017': 'Rivera',
    'H018': 'Cooper',
    'H019': 'Reed',
    'H020': 'Cook',
    'H021': 'Bailey',
    'H022': 'Murphy',
    'H023': 'Kelly',
    'H024': 'Howard',
    'H025': 'Ward'
  };

  // Get family name from simulation ID
  const getFamilyName = (simId: string) => {
    return simIdToFamily[simId] || simId;
  };

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
               Real-time energy flow • Updated every 1s (15min intervals) • 20 homes active
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
                 <CardDescription>Virtual clock in accelerated mode (15 min = 1s)</CardDescription>
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

        {/* Interactive Map */}
        <InteractiveMap homes={liveData.homes} />

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
                Live tracking of production, consumption, and shared energy (last {maxDataPoints} updates • 15-min intervals)
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
                      name="🔄 Microgrid Shared"
                      stroke="hsl(158 74% 40%)"
                      strokeWidth={4}
                      dot={{ r: 4, fill: "hsl(158 74% 40%)" }}
                      activeDot={{ r: 8, stroke: "hsl(158 74% 40%)", strokeWidth: 3 }}
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
              <div className="mt-6 pt-4 border-t">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Energy Status</h4>
                  <div className="grid grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {chartData[chartData.length - 1].production}
                      </div>
                      <div className="text-xs text-muted-foreground">Production (kW)</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {chartData[chartData.length - 1].consumption}
                      </div>
                      <div className="text-xs text-muted-foreground">Consumption (kW)</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="text-2xl font-bold text-green-600">
                        {chartData[chartData.length - 1].shared}
                      </div>
                      <div className="text-xs text-muted-foreground font-semibold">🔄 Microgrid Shared (kW)</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {chartData[chartData.length - 1].gridImport}
                      </div>
                      <div className="text-xs text-muted-foreground">Import (kW)</div>
                    </div>
                    <div className="text-center p-3 bg-cyan-50 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-600">
                        {chartData[chartData.length - 1].gridExport}
                      </div>
                      <div className="text-xs text-muted-foreground">Export (kW)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Homes Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Live Home Status
            </CardTitle>
            <CardDescription>Real-time power flows and battery state for 15 key homes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {liveData.homes.slice(0, 15).map((home) => {
                const familyName = getFamilyName(home.id);
                const isMicrogrid = ['H001', 'H002', 'H003', 'H004', 'H005', 'H006', 'H007', 'H008', 'H009', 'H010', 'H016', 'H017', 'H018', 'H019', 'H020'].includes(home.id);
                
                return (
                  <Card key={home.id} className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${isMicrogrid ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-sm text-gray-900">{familyName} Family</div>
                        {isMicrogrid && (
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            PV:
                          </span>
                          <span className="font-mono font-medium text-yellow-600">{home.pv} kW</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 flex items-center gap-1">
                            <TrendingDown className="h-3 w-3 text-red-500" />
                            Load:
                          </span>
                          <span className="font-mono font-medium text-red-600">{home.load} kW</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Battery className="h-3 w-3 text-blue-500" />
                            SOC:
                          </span>
                          <span className="font-mono font-medium text-blue-600">{home.soc}%</span>
                        </div>
                      
                        {home.share > 0 && (
                          <div className="flex justify-between items-center text-green-600">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              Share:
                            </span>
                            <span className="font-mono font-medium">{home.share.toFixed(2)} kW</span>
                          </div>
                        )}
                        
                        {home.recv > 0 && (
                          <div className="flex justify-between items-center text-cyan-600">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                              Recv:
                            </span>
                            <span className="font-mono font-medium">{home.recv.toFixed(2)} kW</span>
                          </div>
                        )}
                        
                        {home.exp > 0 && (
                          <div className="flex justify-between items-center text-purple-600">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                              Export:
                            </span>
                            <span className="font-mono font-medium">{home.exp.toFixed(1)} kW</span>
                          </div>
                        )}
                        
                        {home.imp > 0 && (
                          <div className="flex justify-between items-center text-red-600">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              Import:
                            </span>
                            <span className="font-mono font-medium">{home.imp.toFixed(2)} kW</span>
                          </div>
                        )}
                    </div>

                      
                      {/* Fixed SOC Status Block */}
                      <div className="mt-3 p-2 bg-gray-100 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Battery Status:</span>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            home.soc > 60 ? 'bg-green-100 text-green-700' : 
                            home.soc > 30 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {home.soc > 60 ? 'High' : home.soc > 30 ? 'Medium' : 'Low'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

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

