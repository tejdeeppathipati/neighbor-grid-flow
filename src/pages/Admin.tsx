import { useAdminData } from '@/hooks/useAdminData';
import { useUserMicrogrid } from '@/hooks/useUserMicrogrid';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { HousesGrid } from '@/components/admin/HousesGrid';
import { GridExchangeCard } from '@/components/admin/GridExchangeCard';
import { CommunityTotals } from '@/components/admin/CommunityTotals';
import { FairRateCard } from '@/components/admin/FairRateCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Admin() {
  const { microgridId, loading: mgLoading } = useUserMicrogrid();
  const { gridExchange, communityToday, homes, tariff, loading, error } = useAdminData(microgridId);

  if (mgLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading microgrid data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive">Error loading data: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader microgridId={microgridId || ''} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Grid Exchange (Top) */}
        <GridExchangeCard
          gridExchange={gridExchange}
          homes={homes}
        />

        {/* Community Overview (Middle) */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Community Overview (Today)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CommunityTotals communityToday={communityToday} />
            <FairRateCard tariff={tariff} />
          </div>
        </section>

        {/* Houses Grid (Bottom) */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Solar Homes Overview</h2>
          <HousesGrid homes={homes} />
        </section>
      </main>
    </div>
  );
}
