import { useEffect, useState } from "react";

export const AnimatedBarChart = ({ data }) => {
  const [barHeights, setBarHeights] = useState(data.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarHeights(data.map(item => item.value));
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="flex h-48 items-end justify-around">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center w-12">
          <div className="relative w-8 mb-2">
            <div 
              className="w-full rounded-t-md transition-all duration-1000 ease-out" 
              style={{ 
                height: `${(barHeights[index] / maxValue) * 100}%`,
                backgroundColor: item.color 
              }}
            />
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-start -mt-6">
              <span className="text-xs font-medium text-gray-700">{item.value}</span>
            </div>
          </div>
          <span className="text-xs text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
