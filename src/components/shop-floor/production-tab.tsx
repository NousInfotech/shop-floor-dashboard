'use client'

import { Button } from '@/components/ui/button'
import { WorkOrder } from '@/types/work-order'
import { StatusBadge } from '@/components/shared/status-badge'

interface ProductionTabProps {
  workOrder: WorkOrder
}

export default function ProductionTab({ workOrder }: ProductionTabProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-6">Operations</h3>
      
      {workOrder.operations.map((op) => (
        <div key={op.id} className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-medium">Operation {op.id}: {op.name}</h4>
            <StatusBadge status={op.status} />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Work Center: {op.workCenter}</p>
              </div>
              <div>
                <p className="text-gray-500">
                  Timer: 00:00:00 
                  {op.completedAt && ` Completed at: ${op.completedAt}`}
                </p>
              </div>
            </div>
            <div className="flex mt-4 gap-2">
              <Button variant="outline" className="bg-amber-100 text-amber-600 border-amber-300 hover:bg-amber-200">
                <span>❚❚</span>
              </Button>
              <Button variant="outline" className="bg-blue-100 text-blue-600 border-blue-300 hover:bg-blue-200">
                <span>◎</span>
              </Button>
              <Button variant="outline" className="bg-red-100 text-red-500 border-red-300 hover:bg-red-200">
                <span>☕</span>
              </Button>
              <Button variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200">
                <span>📋</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Production Dashboard</h3>
        <div className="bg-gray-50 p-6 rounded-lg text-center h-64 flex items-center justify-center">
          <p className="text-gray-600">
            Production metrics and real-time data visualization will be displayed here.
          </p>
        </div>
      </div>
    </div>
  )
}
