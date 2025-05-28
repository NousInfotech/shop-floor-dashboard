import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
  suffix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, suffix = "" }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">
          {typeof animatedValue === 'number' && animatedValue % 1 !== 0 
            ? animatedValue.toFixed(1) 
            : Math.round(animatedValue)}{suffix}
        </div>
        <div className="flex items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm font-medium text-green-500">{change}%</span>
          <span className="text-sm text-gray-500 ml-2">vs last period</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
