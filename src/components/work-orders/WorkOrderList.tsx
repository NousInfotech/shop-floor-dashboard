import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  BarChart2, 
  XCircle 
} from 'lucide-react';
import { WorkOrder } from '@/types/work-order';
import WorkOrderItem from './WorkOrderItem';
import WorkOrderDetails from './WorkOrderDetails';
import WorkOrderProgress from './WorkOrderProgress';

interface WorkOrderListProps {
  workOrders: WorkOrder[];
}

interface FilterDropdownProps {
  options: { value: string; label: string; icon?: React.ReactNode; className?: string }[];
  currentFilter: string | null;
  setFilter: React.Dispatch<React.SetStateAction<string | null>>;
  type: 'status' | 'priority';
}

const FilterDropdown = ({ options, currentFilter, setFilter, type }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg border 
          ${currentFilter 
            ? 'bg-blue-50 border-blue-200 text-blue-700' 
            : 'bg-white border-gray-300 text-gray-700'}
          hover:bg-gray-50 transition-colors
        `}
      >
        <Filter className="w-4 h-4" />
        <span>{type === 'status' ? 'Status' : 'Priority'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2 space-y-1">
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(currentFilter === option.value ? null : option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left
                  ${currentFilter === option.value 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'hover:bg-gray-100'}
                  transition-colors
                `}
              >
                {option.icon}
                <span>{option.label}</span>
                {currentFilter === option.value && (
                  <CheckCircle2 className="ml-auto w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
            {currentFilter && (
              <button
                onClick={() => {
                  setFilter(null);
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function WorkOrderList({ workOrders }: WorkOrderListProps) {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<'details' | 'progress'>('details');

  const handleRowClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    
    if (workOrder.status === 'completed' || workOrder.status === 'on-hold') {
      setDetailView('progress');
    } else {
      setDetailView('details');
    }
  };

  // Status filter options
  const STATUS_OPTIONS = [
    { value: 'planned', label: 'Planned', icon: <Clock className="w-4 h-4 text-gray-500" /> },
    { value: 'in-progress', label: 'In Progress', icon: <BarChart2 className="w-4 h-4 text-blue-500" /> },
    { value: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
    { value: 'on-hold', label: 'On Hold', icon: <XCircle className="w-4 h-4 text-yellow-500" /> }
  ];

  // Priority filter options
  const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low Priority', className: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium Priority', className: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High Priority', className: 'bg-red-100 text-red-800' }
  ];

  // Filtering logic
  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter(workOrder => {
      const matchesSearch = !searchTerm || 
        workOrder.site?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.workCenter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.operation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || workOrder.status === statusFilter;
      const matchesPriority = !priorityFilter || workOrder.priority?.toLowerCase() === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [workOrders, searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Search and Filter Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center space-x-4">
        <div className="flex-grow relative">
          <input 
            type="text" 
            placeholder="Search work orders..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all
            "
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex space-x-4">
          <FilterDropdown options={STATUS_OPTIONS} currentFilter={statusFilter} setFilter={setStatusFilter} type="status" />
          <FilterDropdown options={PRIORITY_OPTIONS} currentFilter={priorityFilter} setFilter={setPriorityFilter} type="priority" />
        </div>
      </div>

      {/* Work Orders Table */}
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
            <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredWorkOrders.map((workOrder) => (
            <WorkOrderItem 
              key={workOrder.id} 
              workOrder={workOrder} 
              onClick={() => handleRowClick(workOrder)}
            />
          ))}
        </tbody>
      </table>

      {/* Results Summary */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        Showing {filteredWorkOrders.length} of {workOrders.length} work orders
      </div>

      {/* Work Order Details or Progress View */}
      {selectedWorkOrder && (
        <>
          {detailView === 'details' ? (
            <WorkOrderDetails 
              workOrder={selectedWorkOrder} 
              onClose={() => setSelectedWorkOrder(null)} 
            />
          ) : (
            <WorkOrderProgress 
              workOrder={selectedWorkOrder} 
              onClose={() => setSelectedWorkOrder(null)} 
            />
          )}
        </>
      )}
    </div>
  );
}
