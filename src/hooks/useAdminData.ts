import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type GridExchangeNow = {
  to_grid_now_w_total: number;
  from_grid_now_w_total: number;
};

export type CommunityToday = {
  prod_wh: number;
  mg_used_wh: number;
  grid_import_wh: number;
  grid_export_wh: number;
  unserved_wh: number;
};

export type HomeLatest = {
  home_id: string;
  pv_w: number;
  load_w: number;
  soc_pct: number;
  sharing_w: number;
  receiving_w: number;
  grid_import_w: number;
  grid_export_w: number;
};

export type Tariff = {
  local_fair_rate_cents_per_kwh: number;
  import_cents_per_kwh: number;
  export_cents_per_kwh: number;
};

export function useAdminData(microgridId: string | null) {
  const [gridExchange, setGridExchange] = useState<GridExchangeNow | null>(null);
  const [communityToday, setCommunityToday] = useState<CommunityToday | null>(null);
  const [homes, setHomes] = useState<HomeLatest[]>([]);
  const [tariff, setTariff] = useState<Tariff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!microgridId) return;

    let channel: any;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use backend API directly (database not accessible with anon key)
        const backendResponse = await fetch('http://localhost:3001/state/admin');
        if (backendResponse.ok) {
          const backendData = await backendResponse.json();
          console.log('📊 Using backend API data:', backendData.homes?.length, 'homes');
          
          // Convert backend data to our expected format
          setGridExchange({
            to_grid_now_w_total: backendData.grid.to_grid_kw * 1000, // Convert kW to W
            from_grid_now_w_total: backendData.grid.from_grid_kw * 1000
          });
          
          setCommunityToday({
            prod_wh: backendData.community_today.production_kwh * 1000, // Convert kWh to Wh
            mg_used_wh: backendData.community_today.microgrid_used_kwh * 1000,
            grid_import_wh: backendData.community_today.grid_import_kwh * 1000,
            grid_export_wh: backendData.community_today.grid_export_kwh * 1000,
            unserved_wh: backendData.community_today.unserved_kwh * 1000
          });
          
          setHomes(backendData.homes.map((home: any) => ({
            home_id: home.id,
            pv_w: home.pv_kw * 1000, // Convert kW to W
            load_w: home.usage_kw * 1000,
            soc_pct: home.soc_pct,
            sharing_w: home.sharing_kw * 1000,
            receiving_w: home.receiving_kw * 1000,
            grid_import_w: 0, // Not available in backend response
            grid_export_w: 0  // Not available in backend response
          })));
          
          setTariff({
            local_fair_rate_cents_per_kwh: backendData.fair_rate_cents_per_kwh,
            import_cents_per_kwh: 30, // Default values
            export_cents_per_kwh: 7
          });
          
          setLoading(false);
          return;
        }

        // Database queries disabled (anon key has no permissions)
        console.log('⚠️ Backend API failed, using fallback data');
        // Fetch grid exchange
        const { data: gridData, error: gridError } = await supabase
          .from('v_grid_exchange_now')
          .select('to_grid_now_w_total, from_grid_now_w_total')
          .eq('microgrid_id', microgridId)
          .maybeSingle();

        if (gridError) throw gridError;
        setGridExchange(gridData || { to_grid_now_w_total: 0, from_grid_now_w_total: 0 });

        // Fetch community today
        const { data: commData, error: commError } = await supabase
          .from('v_community_today')
          .select('prod_wh, mg_used_wh, grid_import_wh, grid_export_wh')
          .eq('microgrid_id', microgridId)
          .maybeSingle();

        if (commError) throw commError;
        setCommunityToday(commData ? {
          prod_wh: commData.prod_wh || 0,
          mg_used_wh: commData.mg_used_wh || 0,
          grid_import_wh: commData.grid_import_wh || 0,
          grid_export_wh: commData.grid_export_wh || 0,
          unserved_wh: 0 // Default to 0 since the view doesn't include this field yet
        } : {
          prod_wh: 0,
          mg_used_wh: 0,
          grid_import_wh: 0,
          grid_export_wh: 0,
          unserved_wh: 0
        });

        // Fetch homes
        const { data: homesData, error: homesError } = await supabase
          .from('v_home_latest')
          .select('home_id, pv_w, load_w, soc_pct, sharing_w, receiving_w, grid_import_w, grid_export_w')
          .eq('microgrid_id', microgridId)
          .order('home_id');

        if (homesError) throw homesError;
        setHomes(homesData || []);

        // Fetch current tariff
        const { data: tariffData, error: tariffError } = await supabase
          .from('tariffs')
          .select('local_fair_rate_cents_per_kwh, import_cents_per_kwh, export_cents_per_kwh')
          .eq('microgrid_id', microgridId)
          .is('effective_to', null)
          .maybeSingle();

        if (tariffError) throw tariffError;
        setTariff(tariffData);

        } catch (err: any) {
          console.error('Error fetching admin data:', err);
          setError(err.message);
          
          // Set fallback data so component can still render
          setGridExchange({ to_grid_now_w_total: 0, from_grid_now_w_total: 0 });
          setCommunityToday({ prod_wh: 0, mg_used_wh: 0, grid_import_wh: 0, grid_export_wh: 0, unserved_wh: 0 });
          setHomes([]);
          setTariff({ local_fair_rate_cents_per_kwh: 0, import_cents_per_kwh: 30, export_cents_per_kwh: 7 });
        } finally {
          setLoading(false);
        }
    };

    fetchData();

    // Poll for updates every 1 minute (60 seconds)
    const pollInterval = setInterval(fetchData, 60000);

    // Subscribe to realtime updates
    channel = supabase
      .channel('admin-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tick_state'
        },
        () => {
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tick_state_community'
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
  }, [microgridId]);

  return { gridExchange, communityToday, homes, tariff, loading, error };
}
