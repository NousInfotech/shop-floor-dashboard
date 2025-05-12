// components/work-orders/WorkOrderFilters.tsx
import { WorkOrderStatus } from '@/types/work-order';
import {
  Filter,
  CalendarCheck,
  Loader,
  CheckCircle,
  PauseCircle
} from 'lucide-react';

interface WorkOrderFiltersProps {
  selectedStatus: WorkOrderStatus | 'all';
  onStatusChange: (status: WorkOrderStatus | 'all') => void;
}

// Icon map for each status
const iconMap = {
  all: <Filter className="w-4 h-4 mr-2" />,
  planned: <CalendarCheck className="w-4 h-4 mr-2" />,
  'in-progress': <Loader className="w-4 h-4 mr-2 animate-spin" />,
  completed: <CheckCircle className="w-4 h-4 mr-2 text-green-500" />,
  'on-hold': <PauseCircle className="w-4 h-4 mr-2 text-yellow-500" />
} as const;

// Label map for each status
const labelMap = {
  all: 'All Orders',
  planned: 'Planned',
  'in-progress': 'In Progress',
  completed: 'Completed',
  'on-hold': 'On Hold'
} as const;

type StatusKey = keyof typeof iconMap;

// Type guard to safely access maps
const isStatusKey = (status: string): status is StatusKey =>
  status in iconMap;

export default function WorkOrderFilters({
  selectedStatus,
  onStatusChange
}: WorkOrderFiltersProps) {
  const statuses: (WorkOrderStatus | 'all')[] = [
    'all',
    'planned',
    'in-progress',
    'completed',
    'on-hold'
  ];

  return (
    <div className="p-4 bg-white shadow-md rounded-xl mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Orders</h2>
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) =>
          isStatusKey(status) ? (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`
                flex items-center px-4 py-2 rounded-full text-sm font-medium
                transition-colors duration-200 shadow-sm
                ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {iconMap[status]}
              {labelMap[status]}
            </button>
          ) : null
        )}
      </div>
    </div>
  );
}
