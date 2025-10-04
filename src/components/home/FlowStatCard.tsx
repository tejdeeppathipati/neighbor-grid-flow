import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FlowStatCardProps {
  title: string;
  kw: number;
  tone: 'green' | 'blue';
  description: string;
  icon: React.ReactNode;
}

export function FlowStatCard({ 
  title, 
  kw, 
  tone, 
  description, 
  icon 
}: FlowStatCardProps) {
  const getToneStyles = () => {
    switch (tone) {
      case 'green':
        return {
          text: 'text-[var(--good)]',
          bg: 'bg-green-50 dark:bg-green-950/20',
          icon: 'text-green-500'
        };
      case 'blue':
        return {
          text: 'text-[var(--accent)]',
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          icon: 'text-blue-500'
        };
      default:
        return {
          text: 'text-[var(--ink)]',
          bg: 'bg-gray-50 dark:bg-gray-950/20',
          icon: 'text-gray-500'
        };
    }
  };

  const styles = getToneStyles();

  return (
    <Card className="rounded-2xl border bg-[var(--surface)] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className={styles.icon}>
            {icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-bold ${styles.text} mb-2`}>
          {kw.toFixed(2)} kW
        </div>
        <p className="text-sm text-[var(--muted)]">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
