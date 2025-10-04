import { HouseTile } from './HouseTile';
import type { AdminHouse } from '@/data/MockDataProvider';

interface HousesGridProps {
  houses: AdminHouse[];
}

export function HousesGrid({ houses }: HousesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {houses.map(house => (
        <HouseTile key={house.id} house={house} />
      ))}
    </div>
  );
}
