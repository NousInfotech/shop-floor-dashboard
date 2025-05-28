import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';

interface AnimatedBarChartProps {
  data: number[];
  title: string;
  yAxisLabel: string;
}

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({ data, title, yAxisLabel }) => {
  const [animatedData, setAnimatedData] = useState<number[]>(data.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(data);
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const maxValue = Math.max(...data);
  const timeLabels = title === "Production Rate" 
    ? ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="h-64 flex items-end justify-between space-x-2">
        {animatedData.map((value, index) => {
          const height = (value / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-blue-600 rounded-t-md transition-all duration-1000 ease-out hover:bg-blue-700 cursor-pointer"
                style={{ height: `${height}%`, minHeight: '4px' }}
                title={`${timeLabels[index]}: ${value}${yAxisLabel}`}
              />
              <span className="text-xs text-gray-500 mt-2 font-medium">
                {timeLabels[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedBarChart;
