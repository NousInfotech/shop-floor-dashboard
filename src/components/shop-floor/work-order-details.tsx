'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { StatusBadge } from '@/components/shared/status-badge'
import { WorkOrder } from '@/types/work-order'
import WorkOrderDetailsTab from './work-order-details-tab'
import ProductionTab from './production-tab'
import EmployeeAssignmentTab from './employee-assingnment-tab'
import TimeLogTab from './time-log-tab'
// import { ActionButtons } from '../shared/action-buttons'

import { MdInfo, MdFactory, MdGroup, MdAccessTime } from 'react-icons/md'

interface WorkOrderDetailsProps {
  workOrder: WorkOrder
  activeTab: string
  onTabChange: (tab: string) => void
  onStatusChange?: (workOrderId: string, newStatus: string) => void
}

export default function WorkOrderDetails({
  workOrder,
  activeTab,
  onTabChange,
  // onStatusChange
}: WorkOrderDetailsProps) {
  const [status, ] = useState(workOrder.status)
  const [timeLog, ] = useState<Array<{
    timestamp: string;
    operationId: string;
    action: string;
    description: string;
  }>>([])

  // const handleStatusChange = (newStatus: string) => {
  //   setStatus(newStatus as typeof status)

  //   const now = new Date()
  //   const timestamp = now.toLocaleString()

  //   setTimeLog(prev => [
  //     ...prev,
  //     {
  //       timestamp,
  //       operationId: 'General',
  //       action: `Status changed to ${newStatus}`,
  //       description: `Work order status updated from ${status} to ${newStatus}`
  //     }
  //   ])

  //   if (onStatusChange) {
  //     onStatusChange(workOrder.id, newStatus)
  //   }
  // }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-lg font-medium text-gray-600">Work Order No.</h2>
          <h1 className="text-xl font-bold text-gray-900">{workOrder.orderNo}</h1>
        </div>
        {/* <StatusBadge status={status} /> */}
      </div>
{/* 
      <div className="p-4 border-b">
        <ActionButtons
          initialStatus={status}
          onStatusChange={handleStatusChange}
          disabled={status === 'COMPLETED'}
        />
      </div> */}

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full justify-start  px-2  rounded-t-lg shadow-inner">
          <TabsTrigger
            value="details"
            className="flex items-center gap-2 px-4 py-4 bg-blue-100 mr-2 rounded-lg transition-colors duration-150 hover:bg-white hover:text-blue-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow"
          >
            <MdInfo className="text-lg" /> Details
          </TabsTrigger>

          <TabsTrigger
            value="production"
            className="flex items-center gap-2 px-4 py-4 bg-blue-100 mr-2 rounded-lg transition-colors duration-150 hover:bg-white hover:text-blue-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow"
          >
            <MdFactory className="text-lg" /> Production
          </TabsTrigger>

          <TabsTrigger
            value="employees"
            className="flex items-center gap-2 px-4 py-4 bg-blue-100 mr-2 rounded-lg transition-colors duration-150 hover:bg-white hover:text-blue-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow"
          >
            <MdGroup className="text-lg" /> Employees
          </TabsTrigger>

          <TabsTrigger
            value="timeLog"
            className="flex items-center gap-2 px-4 py-4 bg-blue-100 mr-2 rounded-lg transition-colors duration-150 hover:bg-white hover:text-blue-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow"
          >
            <MdAccessTime className="text-lg" /> Time Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="p-6">
          <WorkOrderDetailsTab workOrder={{ ...workOrder, status }} />
        </TabsContent>

        <TabsContent value="production" className="p-6">
          <ProductionTab workOrder={{ ...workOrder, status }} />
        </TabsContent>

        <TabsContent value="employees" className="p-6">
          <EmployeeAssignmentTab workOrder={workOrder} />
        </TabsContent>

        <TabsContent value="timeLog" className="p-6">
          <TimeLogTab workOrder={{ ...workOrder, status }} timeLog={timeLog} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
