'use client'

import { Button } from '@/components/ui/button'
import { WorkOrder } from '@/types/work-order'
import { StatusBadge } from '@/components/shared/status-badge'
import { Pause, Play, Coffee, ClipboardList } from 'lucide-react' // Importing icons

interface ProductionTabProps {
  workOrder: WorkOrder
}

export default function ProductionTab({ workOrder }: ProductionTabProps) {
  // Button actions with dynamic icons
  const buttonActions = [
    { id: 'pause', icon: <Pause />, label: 'Pause', bgColor: 'bg-amber-100', textColor: 'text-amber-600' },
    { id: 'play', icon: <Play />, label: 'Play', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
    { id: 'coffee', icon: <Coffee />, label: 'Coffee Break', bgColor: 'bg-red-100', textColor: 'text-red-500' },
    { id: 'clipboard', icon: <ClipboardList />, label: 'Tasks', bgColor: 'bg-gray-100', textColor: 'text-gray-600' }
  ]

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6">Operations</h3>
      
   {workOrder.operations?.length ? workOrder.operations.map((op) => (
  <div key={op.id} className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-lg font-medium">Operation {op.id}: {op.name}</h4>
      <StatusBadge status={op.status} />
    </div>
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 text-sm">Work Center: {op.workCenter}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">
            Timer: 00:00:00 
            {op.completedAt && ` Completed at: ${op.completedAt}`}
          </p>
        </div>
      </div>
      <div className="flex mt-4 gap-4 justify-start">
        {buttonActions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${action.bgColor} ${action.textColor} border hover:bg-opacity-70`}
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-md">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  </div>
)) : (
  <p className="text-gray-500">No operations found.</p>
)}

      
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
