'use client'

import { WorkOrder } from '@/types/work-order'

interface WorkOrderDetailsTabProps {
  workOrder: WorkOrder
}

export default function WorkOrderDetailsTab({ workOrder }: WorkOrderDetailsTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium flex items-center mb-4">
          <span className="mr-2">⏱️</span>
          Time Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-gray-500 mb-2">Start Time</h4>
            <p className="text-lg">{workOrder.startTime}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-gray-500 mb-2">End Time</h4>
            <p className="text-lg">{workOrder.endTime}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Work Order Information</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-gray-500 mb-1">Part No.</h4>
              <p className="font-medium">{workOrder.part?.number || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-gray-500 mb-1">Part Name</h4>
              <p className="font-medium">{workOrder.part?.name || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-gray-500 mb-1">Operation No.</h4>
              <p className="font-medium">{workOrder.operationNo || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-gray-500 mb-1">Site Location</h4>
              <p className="font-medium">{workOrder.siteLocation}</p>
            </div>
            <div>
              <h4 className="text-gray-500 mb-1">Work Center</h4>
              <p className="font-medium">
                {workOrder.operations[0]?.workCenter || 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="text-gray-500 mb-1">Batch Quantity</h4>
              <p className="font-medium">150</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}