import { useEffect, useState } from "react";

interface BarChartData {
  name: string;
  count: number;
}

interface HorizontalBarChartProps {
  data: BarChartData[];
  title: string;
}

export const HorizontalBarChart = ({ data, title }: HorizontalBarChartProps) => {
  const [barWidths, setBarWidths] = useState<number[]>(data.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarWidths(data.map((item: BarChartData) => item.count));
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const maxValue = Math.max(...data.map((item: BarChartData) => item.count));

  return (
    <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        <div className="flex gap-4">
          <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all">
            By Status
          </button>
          <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all">
            By Department
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {data.map((item: BarChartData, index: number) => (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-700">{item.name}</span>
              <span className="text-sm font-medium text-gray-800">{item.count}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-center"
                style={{ width: `${(barWidths[index] / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
