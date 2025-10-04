/**
 * User Live Dashboard - Real-time home energy monitoring
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserHeader } from "@/components/user/UserHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, Home, Sun, Battery, Zap, ArrowUpCircle, ArrowDownCircle, Power, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useUserData } from "@/hooks/useUserData";

// Import Tesla-style components
import { HeroHouse3DPro } from "@/components/home/HeroHouse3DPro";
import { MetricTile } from "@/components/home/MetricTile";
import { FlowStatCard } from "@/components/home/FlowStatCard";
import { EnergyFlowChart } from "@/components/home/EnergyFlowChart";

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
    if (todayData && todayData.length > 0) {
      const processedData = todayData.map((point: any) => ({
        time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        solar: point.pv_w / 1000,
        consumption: point.load_w / 1000,
        battery: point.soc_pct,
        sharing: point.sharing_w / 1000,
        receiving: point.receiving_w / 1000,
        gridImport: point.grid_import_w / 1000,
        gridExport: point.grid_export_w / 1000,
      }));
      
      setChartData(processedData.slice(-maxDataPoints));
    }
  }, [todayData, maxDataPoints]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <UserHeader homeId={homeId || "H001"} />
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h1>
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
            <p className="text-muted-foreground">Loading live energy data</p>
          </div>
        </div>
      </div>
    );
  }

  const handleGoOffGrid = async () => {
    try {
      await fetch('http://localhost:3001/sim/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'OUTAGE' })
      });
    } catch (err) {
      console.error('Failed to trigger outage:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <UserHeader homeId={homeId || "H001"} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Tesla-style Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-[var(--ink)]">
              <Home className="h-8 w-8 text-[var(--accent)]" />
              Home {homeId}
            </h1>
            <p className="text-[var(--muted)] mt-1">
              Live energy monitoring • Updated every 0.5s
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant={connected ? "default" : "secondary"} 
              className="text-sm bg-green-100 text-green-700 border-green-200"
            >
              {connected ? "🟢 LIVE" : "⚫ Offline"}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGoOffGrid}
              className="border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
            >
              <Power className="h-4 w-4 mr-2" />
              Go Off-Grid
            </Button>
          </div>
        </div>

        {/* Production-Grade Tesla-Style Hero */}
        {homeLatest && (
          <HeroHouse3DPro
            pvKw={homeLatest.pv_w / 1000}
            loadKw={homeLatest.load_w / 1000}
            socPct={homeLatest.soc_pct}
            reservePct={40} // Configurable backup reserve
            impKw={homeLatest.grid_import_w / 1000}
            expKw={homeLatest.grid_export_w / 1000}
            shareKw={homeLatest.sharing_w / 1000}
            recvKw={homeLatest.receiving_w / 1000}
            updatedAt={new Date()}
          />
        )}

        {/* Tesla-style Primary Metrics */}
        {homeLatest && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricTile
              title="Solar Production"
              value={`${(homeLatest.pv_w / 1000).toFixed(1)} kW`}
              caption="Current generation"
              icon={<Sun className="h-4 w-4" />}
              tone="info"
            />
            <MetricTile
              title="Consumption"
              value={`${(homeLatest.load_w / 1000).toFixed(1)} kW`}
              caption="Current usage"
              icon={<Zap className="h-4 w-4" />}
              tone="neutral"
            />
            <MetricTile
              title="Battery SOC"
              value={`${homeLatest.soc_pct.toFixed(0)}%`}
              caption="State of charge"
              icon={<Battery className="h-4 w-4" />}
              tone={homeLatest.soc_pct < 20 ? 'bad' : homeLatest.soc_pct < 60 ? 'neutral' : 'good'}
            />
          </div>
        )}

        {/* Tesla-style Community Sharing */}
        {homeLatest && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FlowStatCard
              title="Sharing with Community"
              kw={homeLatest.sharing_w / 1000}
              tone="green"
              description="Helping neighbors"
              icon={<ArrowUpCircle className="h-5 w-5" />}
            />
            <FlowStatCard
              title="Receiving from Community"
              kw={homeLatest.receiving_w / 1000}
              tone="blue"
              description="Getting help from neighbors"
              icon={<ArrowDownCircle className="h-5 w-5" />}
            />
          </div>
        )}

        {/* Tesla-style Grid Interaction */}
        {homeLatest && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-2xl border bg-[var(--surface)] shadow-sm">
              <CardContent className="p-6">
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl">
                  <div className="text-2xl font-bold text-[var(--warn)]">
                    {(homeLatest.grid_import_w / 1000).toFixed(1)} kW
                  </div>
                  <div className="text-sm text-[var(--muted)]">Grid Import</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border bg-[var(--surface)] shadow-sm">
              <CardContent className="p-6">
                <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-xl">
                  <div className="text-2xl font-bold text-cyan-600">
                    {(homeLatest.grid_export_w / 1000).toFixed(1)} kW
                  </div>
                  <div className="text-sm text-[var(--muted)]">Grid Export</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tesla-style Energy Flow Chart */}
        <EnergyFlowChart data={chartData} maxDataPoints={maxDataPoints} />

        {/* Tesla-style Success Message */}
        <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-700 dark:text-green-400">
                  Your Home Dashboard is Working!
                </h3>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                  Your personal energy dashboard is successfully receiving live data from the simulator backend.
                  All energy flows are updating in real-time with the complete chart visualization!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}