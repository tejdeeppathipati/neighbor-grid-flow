/**
 * User Live Dashboard - Real-time home energy monitoring
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserHeader } from "@/components/user/UserHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Home, Sun, Battery, Zap, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useUserData } from "@/hooks/useUserData";

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

interface ChartPoint {
  time: string;
  solar: number;
  consumption: number;
  battery: number;
  sharing: number;
  receiving: number;
  gridImport: number;
  gridExport: number;
}

export default function UserAppLive() {
  const { homeId: authHomeId } = useAuth();
  const homeId = authHomeId || "H1"; // Default to H1 if not set (matches database)
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const maxDataPoints = 30; // 30 minutes of history
  
  // Use Supabase data instead of SSE
  const { homeLatest, todayData, dailyStats, loading, error } = useUserData("00000000-0000-0000-0000-000000000001", homeId);

  // Process database data for chart
  useEffect(() => {
    if (homeLatest) {
      const time = new Date();
      const newPoint: ChartPoint = {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        solar: homeLatest.pv_w / 1000, // Convert W to kW
        consumption: homeLatest.load_w / 1000,
        battery: homeLatest.soc_pct,
        sharing: homeLatest.sharing_w / 1000,
        receiving: homeLatest.receiving_w / 1000,
        gridImport: homeLatest.grid_import_w / 1000,
        gridExport: homeLatest.grid_export_w / 1000,
      };
      
      setChartData(prev => {
        const updated = [...prev, newPoint];
        return updated.slice(-maxDataPoints);
      });
    }
  }, [homeLatest]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <UserHeader homeId={homeId || "H1"} />
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Database Error</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !homeLatest) {
    return (
      <div className="min-h-screen bg-background">
        <UserHeader homeId={homeId || "H1"} />
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-pulse mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-bold mb-2">Loading Home {homeId}...</h1>
            <p className="text-muted-foreground">Loading live energy data from database</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UserHeader homeId={homeId || "H1"} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Home className="h-8 w-8 text-primary" />
              Home {homeId}
            </h1>
            <p className="text-muted-foreground mt-1">
              Live energy monitoring • Updated every minute
            </p>
          </div>
          <Badge variant="default" className="text-sm">
            🟢 LIVE
          </Badge>
        </div>

        {/* Energy Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Solar Production */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sun className="h-4 w-4 text-yellow-500" />
                Solar Production
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{(homeLatest.pv_w / 1000).toFixed(1)} kW</div>
              <p className="text-xs text-muted-foreground mt-1">
                Current generation
              </p>
            </CardContent>
          </Card>

          {/* Consumption */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                Consumption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{(homeLatest.load_w / 1000).toFixed(1)} kW</div>
              <p className="text-xs text-muted-foreground mt-1">
                Current usage
              </p>
            </CardContent>
          </Card>

          {/* Battery Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Battery className="h-4 w-4 text-purple-500" />
                Battery SOC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{homeLatest.soc_pct}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                State of charge
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Community Sharing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sharing Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-green-500" />
                Sharing with Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">
                {(homeLatest.sharing_w / 1000).toFixed(2)} kW
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Helping neighbors
              </p>
            </CardContent>
          </Card>

          {/* Receiving Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownCircle className="h-5 w-5 text-blue-500" />
                Receiving from Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">
                {(homeLatest.receiving_w / 1000).toFixed(2)} kW
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Getting help from neighbors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Grid Interaction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Grid Interaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {(homeLatest.grid_import_w / 1000).toFixed(1)} kW
                </div>
                <div className="text-sm text-muted-foreground">Grid Import</div>
              </div>
              
              <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
                <div className="text-2xl font-bold text-cyan-600">
                  {(homeLatest.grid_export_w / 1000).toFixed(1)} kW
                </div>
                <div className="text-sm text-muted-foreground">Grid Export</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Energy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Energy Flow Timeline</CardTitle>
            <CardDescription>
              Last {maxDataPoints} minutes • All energy flows in one view
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    interval={Math.floor(chartData.length / 6)}
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
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(2)} kW`,
                      name
                    ]}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} 
                    iconType="line" 
                  />
                  
                  {/* Primary Energy Flows */}
                  <Line
                    type="monotone"
                    dataKey="solar"
                    name="Solar Production"
                    stroke="hsl(45 93% 58%)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="consumption"
                    name="Home Consumption"
                    stroke="hsl(0 66% 54%)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  
                  {/* Community Sharing */}
                  <Line
                    type="monotone"
                    dataKey="sharing"
                    name="Sharing with Community"
                    stroke="hsl(158 74% 40%)"
                    strokeWidth={2.5}
                    dot={false}
                    strokeDasharray="5 5"
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="receiving"
                    name="Receiving from Community"
                    stroke="hsl(200 100% 50%)"
                    strokeWidth={2.5}
                    dot={false}
                    strokeDasharray="5 5"
                    activeDot={{ r: 5 }}
                  />
                  
                  {/* Grid Interaction */}
                  <Line
                    type="monotone"
                    dataKey="gridImport"
                    name="Grid Import"
                    stroke="hsl(218 100% 62%)"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="3 3"
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gridExport"
                    name="Grid Export"
                    stroke="hsl(187 100% 39%)"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="3 3"
                    activeDot={{ r: 4 }}
                  />
                  
                  {/* Battery SOC (right axis) */}
                  <Line
                    type="monotone"
                    dataKey="battery"
                    name="Battery SOC (%)"
                    stroke="hsl(280 100% 70%)"
                    strokeWidth={2}
                    dot={false}
                    yAxisId="right"
                    activeDot={{ r: 5 }}
                  />
                  
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    stroke="hsl(var(--border))"
                    label={{
                      value: "SOC (%)",
                      angle: 90,
                      position: "insideRight",
                      style: { fontSize: 12, fill: "hsl(var(--muted-foreground))" },
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center">
                <Activity className="h-8 w-8 animate-pulse text-muted-foreground" />
              </div>
            )}

            {/* Current Values Grid */}
            {chartData.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t">
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {(homeLatest.pv_w / 1000).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Solar (kW)</div>
                </div>
                
                <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {(homeLatest.load_w / 1000).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Load (kW)</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {(homeLatest.sharing_w / 1000).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Sharing (kW)</div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(homeLatest.receiving_w / 1000).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Receiving (kW)</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {homeLatest.soc_pct}%
                  </div>
                  <div className="text-xs text-muted-foreground">Battery SOC</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {(homeLatest.grid_import_w / 1000).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Grid Import (kW)</div>
                </div>
                
                <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-600">
                    {(homeLatest.grid_export_w / 1000).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Grid Export (kW)</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {(((homeLatest.pv_w - homeLatest.load_w) + homeLatest.receiving_w - homeLatest.sharing_w) / 1000).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Net Flow (kW)</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Success Message */}
        <Card className="border-green-500/50">
          <CardHeader>
            <CardTitle className="text-green-600">✅ Your Dashboard is Working!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your personal energy dashboard is successfully receiving live data from the Supabase database.
              All energy flows are updating in real-time with the complete chart visualization!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}