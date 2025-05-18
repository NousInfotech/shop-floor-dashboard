'use client'

import { ChevronRight, Clock, Tag, MapPin, AlertCircle } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { WorkOrder } from '@/types/work-order'
import { cn } from '@/lib/utils'

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
    <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
      {workOrders.length > 0 ? (
        workOrders.map((order) => (
          <div
            key={order.id}
            className={cn(
              "p-4   hover:bg-blue-50 cursor-pointer transition-all duration-200",
              activeWorkOrderId === order.id 
                ? "bg-blue-50  shadow-sm" 
                : ""
            )}
            onClick={() => onWorkOrderClick(order)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-blue-600" />
                  <h3 className="font-medium text-gray-700">Order No.</h3>
                </div>
                <p className="font-bold text-blue-600 text-lg">{order.orderNo}</p>
              </div>
              
              <div className={cn(
                "p-1 rounded-full transition-all",
                activeWorkOrderId === order.id 
                  ? "bg-blue-100" 
                  : "bg-gray-100"
              )}>
                <ChevronRight size={18} className={cn(
                  "text-gray-400 transition-all",
                  activeWorkOrderId === order.id && "text-blue-500"
                )} />
              </div>
            </div>
            
            <div className="mb-3 bg-blue-50 p-2 rounded-md flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <div>
                <h4 className="text-xs text-blue-600 font-medium">SITE LOCATION</h4>
                <p className="text-blue-700 font-medium">{order.siteLocation}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="text-xs text-gray-500 font-medium">START TIME</h4>
                  <p className="text-gray-700 font-medium">{order.startTime}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="text-xs text-gray-500 font-medium">END TIME</h4>
                  <p className="text-gray-700 font-medium">{order.endTime}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {order.name}
              </div>
              <StatusBadge status={order.status} />
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-gray-100 p-3 rounded-full mb-3">
            <AlertCircle className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-gray-500 font-medium">No work orders found</h3>
          <p className="text-xs text-gray-400 mt-1">Try changing your filters or search</p>
        </div>
      )}
    </div>
  )
}