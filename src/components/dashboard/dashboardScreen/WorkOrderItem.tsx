import { CheckCircle2, Play, Pause, AlertTriangle, Clock } from "lucide-react";

interface Order {
  id: string | number;
  name: string;
  status: 'on-hold' | 'in-progress' | 'idle' | 'completed';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate: string;
  progress: number;
  quantity: number;
  rate: number;
}

interface WorkOrderItemProps {
  order: Order;
  onPlay: (id: string | number) => void;
  onPause: (id: string | number) => void;
  onHold: (id: string | number) => void;
  onComplete: (id: string | number) => void;
}

export const WorkOrderItem = ({
  order,
  onPlay,
  onPause,
  onHold,
  onComplete,
}: WorkOrderItemProps) => {
  const getStatusBadge = () => {
    switch(order.status) {
      case 'on-hold':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">On Hold</span>;
      case 'in-progress':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">In Progress</span>;
      case 'idle':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Idle</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = () => {
    switch(order.priority) {
      case 'urgent':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs ml-2">Urgent</span>;
      case 'high':
        return <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs ml-2">High</span>;
      case 'medium':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs ml-2">Medium</span>;
      case 'low':
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs ml-2">Low</span>;
      default:
        return null;
    }
  };

const ActionButtons = () => {
  const isOnHold = order.status === 'on-hold';
  const isInProgress = order.status === 'in-progress';
  const isCompleted = order.status === 'completed';

  if (isCompleted) {
    return (
      <div className="flex space-x-2">
        <button 
          className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors duration-200"
          disabled
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      {!isInProgress && (
        <button 
          className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
          onClick={() => onPlay(order.id)}
        >
          <Play className="h-5 w-5" />
        </button>
      )}

      {isInProgress && (
        <button 
          className="p-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors duration-200"
          onClick={() => onPause(order.id)}
        >
          <Pause className="h-5 w-5" />
        </button>
      )}

      {!isOnHold && !isCompleted && (
        <button 
          className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
          onClick={() => onHold(order.id)}
        >
          <AlertTriangle className="h-5 w-5" />
        </button>
      )}

      {!isCompleted && (
        <button 
          className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors duration-200"
          onClick={() => onComplete(order.id)}
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center mb-2">
            <h3 className="font-medium text-gray-800">{order.name}</h3>
          </div>
          <div className="flex items-center">
            {getStatusBadge()}
            {getPriorityBadge()}
            <span className="ml-4 text-sm text-gray-500 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {order.dueDate}
            </span>
          </div>
        </div>
        <ActionButtons />
      </div>
      
      {order.status !== 'idle' && order.status !== 'on-hold' && (
        <div className="mt-3">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{order.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${order.progress}%`,
                backgroundColor: 
                  order.progress > 90 ? '#22C55E' : 
                  order.progress > 50 ? '#3B82F6' : 
                  order.progress > 20 ? '#F59E0B' : '#F87171'
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <div>
              <span className="font-medium mr-1">Quantity:</span>
              {order.quantity}
            </div>
            <div>
              <span className="font-medium mr-1">Rate:</span>
              {order.rate}/hr
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
