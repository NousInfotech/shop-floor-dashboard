// components/work-orders/WorkOrderDetails.tsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { WorkOrder } from '@/types/work-order';
import { 
  updateWorkOrderStatus, 
  updateWorkOrderProgress 
} from '@/redux/features/workOrders/workOrdersSlice';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BarChart2, 
  Users, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import { Employee } from '@/types/employee';

interface WorkOrderDetailsProps {
  workOrder: WorkOrder;
  onClose: () => void;
}

export default function WorkOrderDetails({ workOrder, onClose }: WorkOrderDetailsProps) {
  const dispatch = useDispatch();
  const [localProduced, ] = useState<number>(workOrder.produced ?? 0);
  const [localStatus, setLocalStatus] = useState(workOrder.status);

  const handleProgressUpdate = () => {
    dispatch(updateWorkOrderProgress({
      workOrderId: workOrder.id,
      produced: localProduced
    }));
  };

  const handleStatusUpdate = () => {
    dispatch(updateWorkOrderStatus({
      workOrderId: workOrder.id,
      status: localStatus
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="text-green-500" />;
      case 'on-hold':
        return <Clock className="text-yellow-500" />;
      case 'in-progress':
        return <BarChart2 className="text-blue-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

const renderEmployeeStatus = (emp: Employee) => (
  <div 
    key={emp.id} 
    className={`
      flex items-center p-2 rounded-lg transition-all duration-300
      ${emp.exists 
        ? 'bg-green-50 hover:bg-green-100' 
        : 'bg-red-50 hover:bg-red-100 opacity-60'}`}
  >
    {emp.exists ? <CheckCircle2 className="text-green-500 mr-2" /> : <XCircle className="text-red-500 mr-2" />}
    <span className={`${emp.exists ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
      {emp.name || 'Unnamed'} {/* Fallback if emp.name is undefined */}
    </span>
  </div>
);


  return (
    <div className="fixed inset-0  bg-opacity-40 z-50 flex items-center justify-center overflow-hidden backdrop-blur-2xl">
      <div className="bg-white w-[95%] max-w-4xl rounded-2xl shadow-2xl border border-gray-200 relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <MapPin className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">{workOrder.site} - {workOrder.workCenter}</h2>
              <p className="text-sm text-gray-300">Work Order Details</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:bg-gray-600 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Left Column - Work Order Info */}
          <div className="col-span-2 space-y-6">
            {/* Status and Progress Section */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(localStatus)}
                  <span className="font-semibold text-lg capitalize">
                    {localStatus.replace('-', ' ')}
                  </span>
                </div>
                <select
                  value={localStatus}
                  onChange={(e) => setLocalStatus(e.target.value as WorkOrder['status'])}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold">
                    {localProduced} / {workOrder.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${(localProduced / (workOrder?.target || 1)) * 100}%`,
                      backgroundImage: 'linear-gradient(to right, #3b82f6, #1d4ed8)'
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={handleStatusUpdate}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Status
                </button>
                <button 
                  onClick={handleProgressUpdate}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Update Progress
                </button>
              </div>
            </div>

            {/* Assigned Employees Section */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-800">Assigned Team</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {workOrder.employees.map(renderEmployeeStatus)}
              </div>
            </div>
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-800">Timeline</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-semibold">
                    {workOrder.startDate 
                      ? new Date(workOrder.startDate).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-semibold">
                    {workOrder.endDate 
                      ? new Date(workOrder.endDate).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) 
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Work Order ID</p>
                  <p className="font-semibold text-gray-900 bg-gray-200 px-3 py-1 rounded-md inline-block">
                    {workOrder.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Work Center</p>
                  <p className="font-semibold text-gray-900">{workOrder.workCenter}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Operation</p>
                  <p className="font-semibold text-gray-900">{workOrder.operation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}