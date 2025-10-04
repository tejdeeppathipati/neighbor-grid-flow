import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartPoint {
  time: string;
  solar: number;
  consumption: number;
  battery: number;
  sharing: number;
  receiving: number;
  gridImport: number;
  gridExport: number;
}

interface EnergyFlowChartProps {
  data: ChartPoint[];
  maxDataPoints: number;
}

export function EnergyFlowChart({ data, maxDataPoints }: EnergyFlowChartProps) {
  if (data.length === 0) {
    return (
      <Card className="rounded-2xl border bg-[var(--surface)] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[var(--ink)]">Complete Energy Flow Timeline</CardTitle>
          <CardDescription className="text-[var(--muted)]">
            Last {maxDataPoints} updates • All energy flows in one view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-[var(--muted)]">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border bg-[var(--surface)] shadow-sm">
      <CardHeader>
        <CardTitle className="text-[var(--ink)]">Complete Energy Flow Timeline</CardTitle>
        <CardDescription className="text-[var(--muted)]">
          Last {maxDataPoints} updates • All energy flows in one view
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: 'var(--muted)' }}
              interval={Math.floor(data.length / 6)}
              stroke="#e5e7eb"
            />
            <YAxis
              label={{
                value: "Power (kW)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 12, fill: 'var(--muted)' },
              }}
              tick={{ fontSize: 11, fill: 'var(--muted)' }}
              stroke="#e5e7eb"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)} kW`,
                name
              ]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Legend 
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} 
              iconType="line" 
            />
            
            {/* Primary Energy Flows */}
            <Line
              type="monotone"
              dataKey="solar"
              name="Solar Production"
              stroke="var(--solar)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="consumption"
              name="Home Consumption"
              stroke="var(--bad)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            
            {/* Community Sharing */}
            <Line
              type="monotone"
              dataKey="sharing"
              name="Sharing with Community"
              stroke="var(--good)"
              strokeWidth={2.5}
              dot={false}
              strokeDasharray="5 5"
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="receiving"
              name="Receiving from Community"
              stroke="var(--accent)"
              strokeWidth={2.5}
              dot={false}
              strokeDasharray="5 5"
              activeDot={{ r: 5 }}
            />
            
            {/* Grid Interaction */}
            <Line
              type="monotone"
              dataKey="gridImport"
              name="Grid Import"
              stroke="var(--warn)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="3 3"
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="gridExport"
              name="Grid Export"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              strokeDasharray="3 3"
              activeDot={{ r: 4 }}
            />
            
            {/* Battery SOC (right axis) */}
            <Line
              type="monotone"
              dataKey="battery"
              name="Battery SOC (%)"
              stroke="var(--battery)"
              strokeWidth={2}
              dot={false}
              yAxisId="right"
              activeDot={{ r: 5 }}
            />
            
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: 'var(--muted)' }}
              stroke="#e5e7eb"
              label={{
                value: "SOC (%)",
                angle: 90,
                position: "insideRight",
                style: { fontSize: 12, fill: 'var(--muted)' },
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
