import { useUserData } from '@/hooks/useUserData';
import { useUserMicrogrid } from '@/hooks/useUserMicrogrid';
import { UserHeader } from '@/components/user/UserHeader';
import { HomeSummaryCard } from '@/components/user/HomeSummaryCard';
import { BatterySOC } from '@/components/user/BatterySOC';
import { CreditsCard } from '@/components/user/CreditsCard';
import { UsagePatternChart } from '@/components/user/UsagePatternChart';

export default function UserApp() {
  const { microgridId, homeId, loading: mgLoading } = useUserMicrogrid();
  const { homeLatest, todayData, dailyStats, loading, error } = useUserData(microgridId, homeId);

  if (mgLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading home data...</p>
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

  if (!homeId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">No home assigned to this user.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <UserHeader homeId={homeId} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Summary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HomeSummaryCard homeLatest={homeLatest} dailyStats={dailyStats} />
          <BatterySOC homeLatest={homeLatest} dailyStats={dailyStats} />
        </div>

        {/* Credits */}
        <CreditsCard dailyStats={dailyStats} />

        {/* Usage Pattern */}
        <UsagePatternChart todayData={todayData} />
      </main>
    </div>
  );
}
