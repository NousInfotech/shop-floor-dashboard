

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', efficiency: 78 },
  { name: 'Tue', efficiency: 82 },
  { name: 'Wed', efficiency: 85 },
  { name: 'Thu', efficiency: 91 },
  { name: 'Fri', efficiency: 87 },
  { name: 'Sat', efficiency: 84 },
  { name: 'Sun', efficiency: 79 },
];

export default function EfficiencyChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis domain={[70, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Efficiency']}
            contentStyle={{ backgroundColor: 'white', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
          />
          <Line 
            type="monotone" 
            dataKey="efficiency" 
            stroke="#3B82F6" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
