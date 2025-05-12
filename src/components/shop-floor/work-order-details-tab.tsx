'use client'

import { WorkOrder } from '@/types/work-order'
import { Clock, InfoIcon } from 'lucide-react'

interface WorkOrderDetailsTabProps {
  workOrder: WorkOrder
}

export default function WorkOrderDetailsTab({ workOrder }: WorkOrderDetailsTabProps) {
  return (
    <div className="space-y-8">
      {/* Time Information Section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-semibold flex items-center text-gray-800">
            <Clock className="mr-2 text-blue-600" size={18} />
            Time Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="p-5">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Start Time</h4>
            <p className="text-base font-medium text-gray-800">{workOrder.startTime || 'Not started'}</p>
          </div>
          <div className="p-5">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">End Time</h4>
            <p className="text-base font-medium text-gray-800">{workOrder.endTime || 'In progress'}</p>
          </div>
        </div>
      </div>
      
      {/* Work Order Information Section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-semibold flex items-center text-gray-800">
            <InfoIcon className="mr-2 text-blue-600" size={18} />
            Work Order Information
          </h3>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Part No.</h4>
              <p className="text-sm font-medium text-gray-800">{workOrder.part?.number || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Part Name</h4>
              <p className="text-sm font-medium text-gray-800">{workOrder.part?.name || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Operation No.</h4>
              <p className="text-sm font-medium text-gray-800">{workOrder.operationNo || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Site Location</h4>
              <p className="text-sm font-medium text-gray-800">{workOrder.siteLocation || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Work Center</h4>
            <p className="text-base font-medium text-gray-800">
              {workOrder.operations?.length ? workOrder.operations[0].workCenter : 'N/A'}
            </p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Batch Quantity</h4>
            <p className="text-base font-medium text-gray-800">150</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}