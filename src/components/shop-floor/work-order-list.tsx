'use client'

import { ChevronRight } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { WorkOrder } from '@/types/work-order'

interface WorkOrderListProps {
  workOrders: WorkOrder[]
  activeWorkOrderId?: string
  onWorkOrderClick: (order: WorkOrder) => void
}

export default function WorkOrderList({ 
  workOrders, 
  activeWorkOrderId, 
  onWorkOrderClick 
}: WorkOrderListProps) {
  return (
    <div className="overflow-y-auto max-h-[calc(100vh-320px)]">
      {workOrders.map((order) => (
        <div 
          key={order.id}
          className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
            activeWorkOrderId === order.id ? 'bg-blue-50' : ''
          }`}
          onClick={() => onWorkOrderClick(order)}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-blue-600">Work Order No.</h3>
              <p className="font-semibold text-blue-600">{order.orderNo}</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
          
          <div className="mb-2">
            <h4 className="text-sm text-gray-500">Site Location</h4>
            <p className="text-blue-600">{order.siteLocation}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-gray-500">Start:</h4>
              <p>{order.startTime}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">End:</h4>
              <p>{order.endTime}</p>
            </div>
          </div>
          
          <div className="mt-3 flex justify-end">
            <StatusBadge status={order.status} />
          </div>
        </div>
      ))}
    </div>
  )
}