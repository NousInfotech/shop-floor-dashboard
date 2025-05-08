'use client'

import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Search, Settings } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import SiteSelector from '@/components/shop-floor/site-selector'
import WorkOrderList from '@/components/shop-floor/work-order-list'
import WorkOrderDetails from '@/components/shop-floor/work-order-details'
import { selectActiveSite, setActiveSite } from '@/redux/features/sites/sitesSlice'
import { selectWorkOrders, selectActiveWorkOrder, setActiveWorkOrder } from '@/redux/features/workOrders/workOrdersSlice'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { WorkOrder } from '@/types/work-order'


type Site = string;

export default function ShopFloorControlPage() {
  const dispatch = useDispatch()
  const activeSite = useSelector(selectActiveSite)
  const workOrders = useSelector(selectWorkOrders)
  const activeWorkOrder = useSelector(selectActiveWorkOrder)
  const [subTab, setSubTab] = useState('details')
  
  // Format today's date for display
  const today = new Date()
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  const formattedDate = today.toLocaleDateString('en-US', dateOptions)
  
  // Handle site selection
  const handleSiteChange = (siteName: Site) => {
    dispatch(setActiveSite(siteName))
  }
  
  // Handle work order selection
  const handleWorkOrderClick = (order: WorkOrder) => {
    dispatch(setActiveWorkOrder(order))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Site Selection Header */}
      <div className="bg-gray-800 p-4 rounded-lg text-white flex items-center overflow-x-auto">
        <button className="p-1 text-gray-400 hover:text-gray-200 mr-2">
          <ChevronLeft size={24} />
        </button>
        
        <SiteSelector 
          activeSite={activeSite}
          onSiteChange={handleSiteChange}
        />
        
        <button className="p-1 text-gray-400 hover:text-gray-200 ml-auto">
          <ChevronRight size={24} />
        </button>
        
        <div className="ml-6 flex items-center">
          <Calendar className="mr-2" size={20} />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Shop Floor Control Main Content */}
      <div className="flex gap-6 flex-col md:flex-row">
        {/* Work Orders List */}
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center">
            <div className="relative flex-1">
              <Input
                type="text"
                className="pl-10 pr-4 rounded-full bg-gray-50 focus:ring-blue-500"
                placeholder="Search work orders..."
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <Button variant="ghost" size="icon" className="ml-2">
              <Settings size={18} className="text-gray-500" />
            </Button>
          </div>
          
          <WorkOrderList 
            workOrders={workOrders}
            activeWorkOrderId={activeWorkOrder?.id}
            onWorkOrderClick={handleWorkOrderClick}
          />
        </div>
        
        {/* Work Order Details */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-sm overflow-hidden">
          {activeWorkOrder ? (
            <WorkOrderDetails 
              workOrder={activeWorkOrder} 
              activeTab={subTab}
              onTabChange={setSubTab}
            />
          ) : (
            <div className="p-6 text-center">
              <h2 className="text-xl font-medium mb-4">Select a work order to view details</h2>
              <p className="text-gray-500">Viewing work orders for {formattedDate}</p>
            </div>
          )}
        </div>
      </div>

      {/* Example of using the Tabs component */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="p-4">
            Work order overview content would go here
          </TabsContent>
          <TabsContent value="production" className="p-4">
            Production details would go here
          </TabsContent>
          <TabsContent value="resources" className="p-4">
            Resources information would go here
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}