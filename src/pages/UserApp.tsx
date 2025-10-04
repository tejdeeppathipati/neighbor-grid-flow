import { useMockData } from '@/hooks/useMockData';
import { UserHeader } from '@/components/user/UserHeader';
import { HomeSummaryCard } from '@/components/user/HomeSummaryCard';
import { BatterySOC } from '@/components/user/BatterySOC';
import { CreditsCard } from '@/components/user/CreditsCard';
import { UsagePatternChart } from '@/components/user/UsagePatternChart';
import { GroupContext } from '@/components/user/GroupContext';
import { MonthlyForecast } from '@/components/user/MonthlyForecast';

export default function UserApp() {
  const { getUserSummary, getUserPatterns, getUserSharing, getUserForecast, manualTick } = useMockData();
  
  const homeId = 'H7';
  const summary = getUserSummary(homeId);
  const patterns = getUserPatterns(homeId);
  const sharing = getUserSharing(homeId);
  const forecast = getUserForecast(homeId);

  if (!summary || !patterns || !sharing || !forecast) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading home data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <UserHeader homeId={homeId} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Summary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HomeSummaryCard summary={summary} />
          <BatterySOC summary={summary} />
        </div>

        {/* Credits and Sharing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CreditsCard summary={summary} />
          <GroupContext sharing={sharing} />
        </div>

        {/* Usage Pattern */}
        <UsagePatternChart patterns={patterns} />

        {/* Monthly Forecast */}
        <MonthlyForecast forecast={forecast} />
      </main>
    </div>
  );
}
