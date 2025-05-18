'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  setFilterOptions, 
  clearFilters, 
  setShowFilter,
  selectFilterOptions 
} from '@/redux/features/shopFloor/shopFloorSlice'
import { Check, X, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
// import { DateRange } from 'react-day-picker'
interface WorkOrderFilterProps {
  sites: string[]
}

const WorkOrderFilter = ({ sites }: WorkOrderFilterProps) => {
  const dispatch = useDispatch()
  const currentFilters = useSelector(selectFilterOptions)
  
  
  // Local state for filter options
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(currentFilters.status)
  const [selectedSites, setSelectedSites] = useState<string[]>(currentFilters.sites || [])
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: currentFilters.dateRange?.start ? new Date(currentFilters.dateRange.start) : undefined,
    to: currentFilters.dateRange?.end ? new Date(currentFilters.dateRange.end) : undefined
  })
  
  // Update local state when redux state changes
  useEffect(() => {
    setSelectedStatuses(currentFilters.status || [])
    setSelectedSites(currentFilters.sites || [])
    setDateRange({
      from: currentFilters.dateRange?.start ? new Date(currentFilters.dateRange.start) : undefined,
      to: currentFilters.dateRange?.end ? new Date(currentFilters.dateRange.end) : undefined
    })
  }, [currentFilters])
  
  // Status options
  const statusOptions = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'RUNNING', label: 'Running' },
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ]
  
  // Toggle status selection
  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status))
    } else {
      setSelectedStatuses([...selectedStatuses, status])
    }
  }
  
  // Toggle site selection
  const toggleSite = (site: string) => {
    if (selectedSites.includes(site)) {
      setSelectedSites(selectedSites.filter(s => s !== site))
    } else {
      setSelectedSites([...selectedSites, site])
    }
  }
  
  // Apply filters
  const applyFilters = () => {
    dispatch(setFilterOptions({
      status: selectedStatuses,
      sites: selectedSites,
      dateRange: {
        start: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : null,
        end: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : null
      }
    }))
    closeFilter()
  }
  
  // Reset filters
  const resetFilters = () => {
    setSelectedStatuses([])
    setSelectedSites([])
    setDateRange({ from: undefined, to: undefined })
    dispatch(clearFilters())
  }
  
  // Close filter
  const closeFilter = () => {
    dispatch(setShowFilter(false))
  }
  
  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0
    if (selectedStatuses.length > 0) count++
    if (selectedSites.length > 0) count++
    if (dateRange.from || dateRange.to) count++
    return count
  }
  
  return (
  <div className="absolute z-30 mt-1 left-96 top-32 w-80 max-h-[90vh] bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col">

      <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-blue-50">
        <div className="flex items-center">
          <h3 className="font-medium text-blue-800 text-sm">Filter Work Orders</h3>
          {getActiveFilterCount() > 0 && (
            <Badge className="ml-2 bg-blue-600">{getActiveFilterCount()}</Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 h-7 w-7" onClick={closeFilter}>
          <X size={16} />
        </Button>
      </div>
      
     <div className="p-3 space-y-3 overflow-y-auto flex-grow">

        {/* Status Filter */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-1.5">Status</h4>
          <div className="flex flex-wrap gap-1.5">
            {statusOptions.map((status) => (
              <Badge 
                key={status.value}
                variant="outline"
                className={`cursor-pointer px-2 py-0.5 text-xs ${
                  selectedStatuses.includes(status.value) 
                    ? 'bg-blue-100 text-blue-800 border-blue-300' 
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
                onClick={() => toggleStatus(status.value)}
              >
                {selectedStatuses.includes(status.value) && (
                  <Check size={10} className="mr-1 inline-block" />
                )}
                {status.label}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Sites Filter */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-1.5">Sites</h4>
          <div className="flex flex-wrap gap-1.5">
            {sites.map((site) => (
              <Badge 
                key={site}
                variant="outline"
                className={`cursor-pointer px-2 py-0.5 text-xs ${
                  selectedSites.includes(site) 
                    ? 'bg-blue-100 text-blue-800 border-blue-300' 
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
                onClick={() => toggleSite(site)}
              >
                {selectedSites.includes(site) && (
                  <Check size={10} className="mr-1 inline-block" />
                )}
                {site}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Date Range Filter */}
        {/* <div>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium text-gray-700 mb-1.5">Date Range</h4>
            {(dateRange.from || dateRange.to) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-gray-500 px-1.5"
                onClick={() => setDateRange({ from: undefined, to: undefined })}
              >
                <RotateCcw size={10} className="mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="bg-gray-50 p-2 rounded-md border border-gray-200">
            <Calendar
              mode="range"
              selected={dateRange}
          onSelect={(range: DateRange | undefined) => {
  setDateRange({
    from: range?.from ?? undefined,
    to: range?.to ?? undefined
  });
}}

              className="rounded-md border-0"
              numberOfMonths={1}
              disabled={(date) => date > new Date(2025, 11, 31) || date < new Date(2020, 0, 1)}
            />
          </div>
          <div className="mt-1.5 text-xs text-gray-500 flex items-center">
            <span>
              {dateRange.from ? format(dateRange.from, 'MMM d, yyyy') : 'Start date'} - 
              {dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : ' End date'}
            </span>
          </div>
        </div> */}
      </div>
      
      {/* Footer Actions */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-gray-500 text-xs h-8"
          onClick={resetFilters}
        >
          <RotateCcw size={12} className="mr-1.5" />
          Reset All
        </Button>
        <Button 
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs"
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

export default WorkOrderFilter