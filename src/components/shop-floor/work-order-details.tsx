'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import { WorkOrder } from '@/types/work-order'
import WorkOrderDetailsTab from './work-order-details-tab'
import ProductionTab from './production-tab'
import EmployeeAssignmentTab from './employee-assingnment-tab'
import TimeLogTab from './time-log-tab'
import { ActionButtons } from '../shared/action-buttons'

interface WorkOrderDetailsProps {
  workOrder: WorkOrder
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function WorkOrderDetails({ workOrder, activeTab, onTabChange }: WorkOrderDetailsProps) {
  return (
    <>
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium">Work Order No.</h2>
          <h1 className="text-2xl font-bold">{workOrder.orderNo}</h1>
        </div>
        <StatusBadge status={workOrder.status} size="large" />
      </div>
      
      {/* <ActionButtons status={workOrder.status} /> */}
      <ActionButtons />
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="border-b rounded-none w-full justify-start">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="timeLog">Time Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="p-6">
          <WorkOrderDetailsTab workOrder={workOrder} />
        </TabsContent>
        
        <TabsContent value="production" className="p-6">
          <ProductionTab workOrder={workOrder} />
        </TabsContent>
        
        <TabsContent value="employees" className="p-6">
          <EmployeeAssignmentTab workOrder={workOrder} />
        </TabsContent>
        
        <TabsContent value="timeLog" className="p-6">
          <TimeLogTab workOrder={workOrder} />
        </TabsContent>
      </Tabs>
    </>
  )
}