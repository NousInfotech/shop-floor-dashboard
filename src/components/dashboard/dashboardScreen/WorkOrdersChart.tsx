// File: /components/dashboard/WorkOrdersChart.tsx
'use client';

// import { useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Completed', value: 86, color: '#10B981' },
  { name: 'In Progress', value: 24, color: '#3B82F6' },
  { name: 'Open', value: 18, color: '#6B7280' },
];

export default function WorkOrdersChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} orders`, 'Count']}
            contentStyle={{ backgroundColor: 'white', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}