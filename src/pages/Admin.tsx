import { useMockData } from '@/hooks/useMockData';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { HousesGrid } from '@/components/admin/HousesGrid';
import { LiveRoutingPanel } from '@/components/admin/LiveRoutingPanel';
import { CommunityTotals } from '@/components/admin/CommunityTotals';
import { FairRateCard } from '@/components/admin/FairRateCard';
import { PmgGridTrend } from '@/components/admin/PmgGridTrend';

export default function Admin() {
  const { adminOverview, adminHouses, adminLive, adminTrends, manualTick } = useMockData();

  if (!adminOverview || !adminLive || !adminTrends) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading microgrid data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        microgridId={adminOverview.microgrid_id}
        lastUpdate={adminLive.updated_at}
        onTick={manualTick}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Houses Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Solar Homes Overview</h2>
          <HousesGrid houses={adminHouses} />
        </section>

        {/* Live Routing and Community */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LiveRoutingPanel live={adminLive} />
          <div className="space-y-8">
            <CommunityTotals overview={adminOverview} />
            <FairRateCard overview={adminOverview} />
          </div>
        </div>

        {/* Trend Chart */}
        <PmgGridTrend trends={adminTrends} />
      </main>
    </div>
  );
}
