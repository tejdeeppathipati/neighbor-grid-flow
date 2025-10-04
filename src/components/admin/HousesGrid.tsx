import { HouseDiagramCard } from './HouseDiagramCard';
import type { AdminHouse } from '@/data/MockDataProvider';

interface HousesGridProps {
  houses: AdminHouse[];
}

export function HousesGrid({ houses }: HousesGridProps) {
  // Sort: exporters first, then neutral, then importers
  const sortedHouses = [...houses].sort((a, b) => {
    const aExport = a.to_microgrid_now_kw > 0.5 ? 1 : 0;
    const bExport = b.to_microgrid_now_kw > 0.5 ? 1 : 0;
    const aImport = a.from_microgrid_now_kw > 0.5 ? -1 : 0;
    const bImport = b.from_microgrid_now_kw > 0.5 ? -1 : 0;
    return (bExport + bImport) - (aExport + aImport);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedHouses.map(house => (
        <HouseDiagramCard key={house.id} house={house} />
      ))}
    </div>
  );
}
