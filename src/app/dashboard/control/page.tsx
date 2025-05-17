'use client';
import { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  Filter,
  BarChart2,
  Layout,
  Clipboard,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import SiteSelector from '@/components/shop-floor/site-selector'
import WorkOrderList from '@/components/shop-floor/work-order-list'
import WorkOrderDetails from '@/components/shop-floor/work-order-details'
import WorkOrderFilter from '@/components/shop-floor/work-order-filter'
import CalendarPicker from '@/components/shop-floor/calendar-picker'
import { selectActiveSite, setActiveSite, selectSites } from '@/redux/features/sites/sitesSlice'
import {
  selectWorkOrders,
  selectActiveWorkOrder,
  setActiveWorkOrder
} from '@/redux/features/workOrders/workOrdersSlice'
import {
  selectShowFilter,
  setShowFilter,
} from '@/redux/features/shopFloor/shopFloorSlice'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WorkOrder } from '@/types/work-order'

type Site = string;

export default function ShopFloorControlPage() {
  const dispatch = useDispatch()
  const activeSite = useSelector(selectActiveSite)
  const sites = useSelector(selectSites)
  const workOrders = useSelector(selectWorkOrders)
  const activeWorkOrder = useSelector(selectActiveWorkOrder)
  const showFilter = useSelector(selectShowFilter)
  const [subTab, setSubTab] = useState('details')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [startSiteIndex, setStartSiteIndex] = useState(0)
  
  // Number of sites to display at once
  const visibleSiteCount = 3

  // Calculate which sites should be visible
  const visibleSiteIndices = Array.from({ length: visibleSiteCount }, (_, i) => startSiteIndex + i)
  
  // Find the index of the active site
  useEffect(() => {
    const activeIndex = sites.findIndex(site => site.name === activeSite)
    if (activeIndex >= 0 && (activeIndex < startSiteIndex || activeIndex >= startSiteIndex + visibleSiteCount)) {
      // If active site is out of view, adjust the startIndex to show it
      setStartSiteIndex(Math.max(0, Math.min(sites.length - visibleSiteCount, activeIndex)))
    }
  }, [activeSite, sites, startSiteIndex])

  const handleSiteChange = (siteName: Site) => {
    dispatch(setActiveSite(siteName))
  }

  const handleWorkOrderClick = (order: WorkOrder) => {
    dispatch(setActiveWorkOrder(order))
  }

  const toggleFilter = () => {
    dispatch(setShowFilter(!showFilter))
  }

  const navigatePrevSite = () => {
    if (startSiteIndex > 0) {
      setStartSiteIndex(startSiteIndex - 1)
    }
  }

  const navigateNextSite = () => {
    if (startSiteIndex < sites.length - visibleSiteCount) {
      setStartSiteIndex(startSiteIndex + 1)
    }
  }

  const filteredOrders = workOrders.filter(order =>
    order.siteLocation === activeSite &&
    order.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine if navigation buttons should be disabled
  const isPrevDisabled = startSiteIndex === 0
  const isNextDisabled = startSiteIndex >= sites.length - visibleSiteCount

  return (
    <div className="flex flex-col gap-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-6">
      {/* Site Selection Header */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-full">
          <Layout className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Shop Floor Control</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-white p-4 border border-blue-100 rounded-lg shadow-md">
        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
          <CalendarPicker />
          <div className="flex items-center bg-blue-50 rounded-lg border border-blue-100 w-full">
            <button 
              className={`p-3 text-blue-500 hover:text-blue-700 hover:bg-blue-100 transition-colors ${isPrevDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={navigatePrevSite}
              disabled={isPrevDisabled}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex-1 px-2">
              <SiteSelector 
                activeSite={activeSite} 
                onSiteChange={handleSiteChange}
                visibleSiteIndices={visibleSiteIndices}
              />
            </div>

            <button 
              className={`p-3 text-blue-500 hover:text-blue-700 hover:bg-blue-100 transition-colors ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={navigateNextSite}
              disabled={isNextDisabled}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Left: Work Order List */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-lg shadow-md p-5 max-h-[calc(100vh-200px)] overflow-hidden border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-1.5 rounded-full">
                <Clipboard className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Work Orders</h2>
            </div>
            <Badge className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {filteredOrders.length} Orders
            </Badge>
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search work orders..."
                className="pl-10 border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
            </div>
            <Button
              variant="outline"
              size="icon"
              className={`text-gray-600 hover:text-blue-600 border-blue-200 hover:border-blue-400 hover:bg-blue-50 ${
                showFilter ? 'bg-blue-100 text-blue-700 border-blue-300' : ''
              }`}
              onClick={toggleFilter}
            >
              <Filter size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`text-gray-600 hover:text-blue-600 border-blue-200 hover:border-blue-400 hover:bg-blue-50 ${
                showSettings ? 'bg-blue-100 text-blue-700 border-blue-300' : ''
              }`}
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={18} />
            </Button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-4 p-4 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 text-sm text-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Settings size={16} className="text-blue-600" />
                <h3 className="font-medium">Display Settings</h3>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex items-center justify-between">
                  <span>Show completed orders</span>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Compact view</span>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filter */}
          {showFilter && (
            <div className="mb-4">
              <WorkOrderFilter sites={sites.map(site => site.name)} />
            </div>
          )}

          {/* Scrollable list */}
          <div className="flex-1  rounded-md border border-gray-100">
            <WorkOrderList
              workOrders={filteredOrders}
              activeWorkOrderId={activeWorkOrder?.id}
              onWorkOrderClick={handleWorkOrderClick}
            />
          </div>
        </div>

        {/* Right: Work Order Details */}
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          {activeWorkOrder ? (
            <WorkOrderDetails
              workOrder={activeWorkOrder}
              activeTab={subTab}
              onTabChange={setSubTab}
            />
          ) : (
            <div className="text-center py-20 text-gray-500">
              <div className="inline-flex bg-blue-100 p-4 rounded-full mb-4">
                <BarChart2 size={28} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">No work order selected</h3>
              <p className="text-sm mt-3 max-w-md mx-auto text-gray-500">
                Select a work order from the list to view its details, schedule, and production metrics.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Create New Work Order
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}