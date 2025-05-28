import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Pause } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface WorkOrder {
  id: number;
  name: string;
  progress: number;
  status: string;
  date: string;
}

interface WorkOrderCardProps {
  order: WorkOrder;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ order }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div className={`bg-white rounded-lg border border-gray-100 p-4 transition-all duration-500 ${
      isAnimated ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{order.name}</h4>
          <div className="flex items-center mt-1">
            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
            <span className="text-xs text-gray-500">{order.date}</span>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          {order.status}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{order.progress}%</span>
        </div>
        <ProgressBar progress={order.progress} />
      </div>
      <div className="flex justify-end mt-3">
        <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
          <Pause className="w-3 h-3 mr-1" />
          Pause
        </button>
      </div>
    </div>
  );
};

export default WorkOrderCard;
