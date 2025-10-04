import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserHomeLatest = {
  pv_w: number;
  load_w: number;
  soc_pct: number;
  sharing_w: number;
  receiving_w: number;
  grid_import_w: number;
  grid_export_w: number;
};

export type UserTodayPoint = {
  ts: string;
  pv_w: number;
  load_w: number;
  sent_to_grid_w: number;
};

export type UserDailyStats = {
  prod_wh: number;
  use_wh: number;
  credits_net_wh: number;
  mg_used_wh: number;
};

export function useUserData(microgridId: string | null, homeId: string | null) {
  const [homeLatest, setHomeLatest] = useState<UserHomeLatest | null>(null);
  const [todayData, setTodayData] = useState<UserTodayPoint[]>([]);
  const [dailyStats, setDailyStats] = useState<UserDailyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!microgridId || !homeId) return;

    let channel: any;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from backend API first (fallback approach)
        const backendResponse = await fetch(`http://localhost:3001/state/user/${homeId}`);
        if (backendResponse.ok) {
          const backendData = await backendResponse.json();
          
          // Convert backend data to our expected format
          setHomeLatest({
            pv_w: backendData.energy_summary.solar_kw * 1000, // Convert kW to W
            load_w: backendData.energy_summary.consumed_kw * 1000,
            soc_pct: backendData.battery.soc_pct,
            sharing_w: backendData.sharing.sharing_now_kw * 1000,
            receiving_w: backendData.sharing.receiving_now_kw * 1000,
            grid_import_w: 0, // Not available in backend response
            grid_export_w: 0  // Not available in backend response
          });
          
          // Generate mock time series data from chart data
          const mockTodayData = backendData.chart_today.solar_kw.map((solar: number, index: number) => ({
            ts: new Date(Date.now() - (95 - index) * 15 * 60 * 1000).toISOString(), // 15 min intervals
            pv_w: solar * 1000,
            load_w: backendData.chart_today.consumption_kw[index] * 1000,
            sent_to_grid_w: backendData.chart_today.to_grid_kw[index] * 1000
          }));
          setTodayData(mockTodayData);
          
          setDailyStats({
            prod_wh: backendData.battery.charged_today_kwh * 1000,
            use_wh: backendData.battery.discharged_today_kwh * 1000,
            credits_net_wh: backendData.credits.mtd_net_kwh * 1000,
            mg_used_wh: 0 // Not available in backend response
          });
          
          setLoading(false);
          return;
        }

        // Fallback to database queries (if backend fails)
        // Fetch latest home state
        const { data: latestData, error: latestError } = await supabase
          .from('v_home_latest')
          .select('pv_w, load_w, soc_pct, sharing_w, receiving_w, grid_import_w, grid_export_w')
          .eq('microgrid_id', microgridId)
          .eq('home_id', homeId)
          .maybeSingle();

        if (latestError) throw latestError;
        setHomeLatest(latestData || {
          pv_w: 0,
          load_w: 0,
          soc_pct: 50,
          sharing_w: 0,
          receiving_w: 0,
          grid_import_w: 0,
          grid_export_w: 0
        });

        // Fetch today's time series
        const { data: todayPoints, error: todayError } = await supabase
          .from('v_user_today')
          .select('ts, pv_w, load_w, sent_to_grid_w')
          .eq('microgrid_id', microgridId)
          .eq('home_id', homeId)
          .order('ts');

        if (todayError) throw todayError;
        setTodayData(todayPoints || []);

        // Fetch daily rollup stats
        const { data: statsData, error: statsError } = await supabase
          .from('rollup_daily_home')
          .select('prod_wh, use_wh, credits_net_wh, mg_used_wh')
          .eq('microgrid_id', microgridId)
          .eq('home_id', homeId)
          .eq('day', new Date().toISOString().split('T')[0])
          .maybeSingle();

        if (statsError) throw statsError;
        setDailyStats(statsData || {
          prod_wh: 0,
          use_wh: 0,
          credits_net_wh: 0,
          mg_used_wh: 0
        });

      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.message);
        
        // Set fallback data so component can still render
        setHomeLatest({
          pv_w: 0, load_w: 0, soc_pct: 0, sharing_w: 0, receiving_w: 0, grid_import_w: 0, grid_export_w: 0
        });
        setTodayData([]);
        setDailyStats({ prod_wh: 0, use_wh: 0, credits_net_wh: 0, mg_used_wh: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Poll for updates every 1 minute (60 seconds)
    const pollInterval = setInterval(fetchData, 60000);

    // Subscribe to realtime updates
    channel = supabase
      .channel('user-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tick_state',
          filter: `home_id=eq.${homeId}`
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [microgridId, homeId]);

  return { homeLatest, todayData, dailyStats, loading, error };
}
