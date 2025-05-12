// app/work-orders/page.tsx
'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store'
import WorkOrderList from '@/components/work-orders/WorkOrderList';
import WorkOrderFilters from '@/components/work-orders/WorkOrderFilters';
import NewWorkOrderModal from '@/components/work-orders/NewWorkOrderModal';
import { WorkOrderStatus } from '@/types/work-order';
import { Clipboard} from 'lucide-react';

export default function WorkOrdersPage() {
  const [isNewWorkOrderModalOpen, setIsNewWorkOrderModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<WorkOrderStatus | 'all'>('all');
  const workOrders = useSelector((state: RootState) => state.workOrders.workOrders);

  const filteredWorkOrders = selectedStatus === 'all' 
    ? workOrders 
    : workOrders.filter(wo => wo.status === selectedStatus);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
            <div className="flex items-center mb-6">
        <Clipboard className="h-6 w-6 mr-2" />
        <div>
          <h1 className="text-2xl font-bold">Work Orders</h1>
          <p className="text-gray-500">Manage and track all work orders in your facility</p>
        </div>
      </div>
        <button 
          onClick={() => setIsNewWorkOrderModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Work Order
        </button>
      </div>

      <WorkOrderFilters 
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <WorkOrderList workOrders={filteredWorkOrders} />

      {isNewWorkOrderModalOpen && (
        <NewWorkOrderModal 
          onClose={() => setIsNewWorkOrderModalOpen(false)}
        />
      )}
    </div>
  );
}