import { useEffect, useState } from "react";

interface Segment {
  percentage: number;
  color: string;
}

interface CenterContent {
  value: string | number;
  label: string;
}

interface DonutChartProps {
  segments: Segment[];
  centerContent: CenterContent;
}

export const DonutChart = ({ segments, centerContent }: DonutChartProps) => {
  const [animatedSegments, setAnimatedSegments] = useState<Segment[]>(
    segments.map((seg: Segment) => ({ ...seg, percentage: 0 }))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedSegments(segments);
    }, 300);
    return () => clearTimeout(timer);
  }, [segments]);

  let cumulativePercentage = 0;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full transform transition-transform duration-500 hover:rotate-12">
        {animatedSegments.map((segment, index) => {
          const startPercentage = cumulativePercentage;
          cumulativePercentage += segment.percentage;

          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={segment.color}
              strokeWidth="20"
              strokeDasharray={`${(segment.percentage * 251.2) / 100} 251.2`}
              strokeDashoffset={`${(-startPercentage * 251.2) / 100}`}
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000"
            />
          );
        })}
        <circle cx="50" cy="50" r="30" fill="#fff" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-2xl font-bold text-gray-800">{centerContent.value}</span>
          <span className="block text-xs text-gray-600">{centerContent.label}</span>
        </div>
      </div>
    </div>
  );
};
