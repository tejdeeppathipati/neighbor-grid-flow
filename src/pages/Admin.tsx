import { useMockData } from '@/hooks/useMockData';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { HousesGrid } from '@/components/admin/HousesGrid';
import { GridExchangeCard } from '@/components/admin/GridExchangeCard';
import { CommunityTotals } from '@/components/admin/CommunityTotals';
import { FairRateCard } from '@/components/admin/FairRateCard';
import { PmgGridTrend } from '@/components/admin/PmgGridTrend';

export default function Admin() {
  const { adminOverview, adminHouses, adminGridExchange, adminTrends } = useMockData();

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      <AdminHeader
        microgridId={adminOverview?.microgrid_id || 'MG-001'}
        lastUpdate={adminGridExchange?.updated_at}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Grid Exchange (Top) */}
        <GridExchangeCard
          toGridNowKwTotal={adminGridExchange?.to_grid_now_kw_total}
          toGridTodayKwhTotal={adminGridExchange?.to_grid_today_kwh_total}
          fromGridNowKwTotal={adminGridExchange?.from_grid_now_kw_total}
          gridDrawersNow={adminGridExchange?.grid_drawers_now || []}
          gridExportersNowTop={adminGridExchange?.grid_exporters_now_top}
          unservedNeedKw={adminGridExchange?.unserved_need_kw || 0}
          isIslanded={adminGridExchange?.is_islanded || false}
        />

        {/* Community Overview (Middle) */}
        <section>
          <h2 className="text-2xl font-semibold text-[hsl(var(--text))] mb-4">Community Overview (Today)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <CommunityTotals overview={adminOverview} />
            <FairRateCard overview={adminOverview} />
          </div>
          <PmgGridTrend trends={adminTrends} />
        </section>

        {/* Houses Grid (Bottom) */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Solar Homes Overview</h2>
          <HousesGrid houses={adminHouses} />
        </section>
      </main>
    </div>
  );
}
