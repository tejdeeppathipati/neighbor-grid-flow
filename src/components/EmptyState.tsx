import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  caption?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title = 'No data yet', 
  caption = 'Connect backend to see live updates' 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-[hsl(var(--surface-2))] p-4">
          <Icon className="w-8 h-8 text-[hsl(var(--text-dim))]" />
        </div>
      )}
      <h3 className="text-lg font-medium text-[hsl(var(--text))] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[hsl(var(--text-dim))]">
        {caption}
      </p>
    </div>
  );
}
