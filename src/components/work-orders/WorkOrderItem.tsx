import { Clock, CheckCircle2 } from 'lucide-react';
import { WorkOrder } from '@/types/work-order';
import { ReactNode } from 'react';

interface WorkOrderItemProps {
  workOrder: WorkOrder;
  onClick: () => void;
}

type StatusKey = 'completed' | 'on-hold' | 'in-progress' | 'idle';

export default function WorkOrderItem({ workOrder, onClick }: WorkOrderItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStatus = () => {
    const normalizedStatus = workOrder.status.toLowerCase() as StatusKey;
    const statusText = workOrder.status.replace('-', ' ');

    const statusStyles: Record<StatusKey, string> = {
      completed: 'bg-green-100 text-green-700',
      'on-hold': 'bg-yellow-100 text-yellow-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      idle: 'bg-gray-100 text-gray-700'
    };

    const iconColorMap: Record<StatusKey, string> = {
      completed: 'text-green-500',
      'on-hold': 'text-yellow-500',
      'in-progress': 'text-blue-500',
      idle: 'text-gray-500'
    };

    const iconMap: Record<StatusKey, ReactNode> = {
      completed: <CheckCircle2 className={`w-4 h-4 ${iconColorMap[normalizedStatus]}`} />,
      'on-hold': <Clock className={`w-4 h-4 ${iconColorMap[normalizedStatus]}`} />,
      'in-progress': <Clock className={`w-4 h-4 ${iconColorMap[normalizedStatus]}`} />,
      idle: <Clock className={`w-4 h-4 ${iconColorMap[normalizedStatus]}`} />
    };

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${statusStyles[normalizedStatus]}`}>
        {iconMap[normalizedStatus]}
        <span className="capitalize">{statusText}</span>
      </div>
    );
  };

  return (
    <tr
      className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-200"
      onClick={onClick}
    >
      <td className="px-4 py-4">
        <div className="font-semibold text-gray-900">{workOrder.id}</div>
        <div className="text-sm text-gray-500 mt-1">{workOrder.operation}</div>
      </td>
      <td className="px-4 py-4 text-sm">
        {renderStatus()}
      </td>
      <td className="px-4 py-4 text-sm text-gray-600">
        {workOrder.team || 'Unassigned'}
      </td>
      <td className="px-4 py-4 text-sm text-gray-600 text-right">
        <div className="flex items-center justify-end space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{workOrder.endDate ? formatDate(workOrder.endDate) : 'N/A'}</span>
        </div>
      </td>
    </tr>
  );
}
