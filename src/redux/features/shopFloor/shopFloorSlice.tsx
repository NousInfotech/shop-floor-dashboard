import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store'
// import { WorkOrder } from '@/types/work-order'

interface ShopFloorState {
  filterText: string
  showSettings: boolean
  showFilter: boolean
  selectedDate: string
  filterOptions: {
    status: string[]
    priority: string[]
    sites: string[] // Added sites to filterOptions
    dateRange: {
      start: string | null
      end: string | null
    }
  }
}

const initialState: ShopFloorState = {
  filterText: '',
  showSettings: false,
  showFilter: false,
  selectedDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
  filterOptions: {
    status: [],
    priority: [],
    sites: [], // Initialize sites array
    dateRange: {
      start: null,
      end: null
    }
  }
}

export const shopFloorSlice = createSlice({
  name: 'shopFloor',
  initialState,
  reducers: {
    setFilterText: (state, action: PayloadAction<string>) => {
      state.filterText = action.payload
    },
    toggleSettings: (state) => {
      state.showSettings = !state.showSettings
      // Close filter if it's open
      if (state.showSettings) {
        state.showFilter = false
      }
    },
    toggleFilter: (state) => {
      state.showFilter = !state.showFilter
      // Close settings if it's open
      if (state.showFilter) {
        state.showSettings = false
      }
    },
    setShowFilter: (state, action: PayloadAction<boolean>) => {
      state.showFilter = action.payload
      // Close settings if filter is being opened
      if (state.showFilter) {
        state.showSettings = false
      }
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
    },
    setFilterOptions: (state, action: PayloadAction<{
      status?: string[]
      priority?: string[]
      sites?: string[] // Added sites option
      dateRange?: {
        start: string | null
        end: string | null
      }
    }>) => {
      if (action.payload.status !== undefined) {
        state.filterOptions.status = action.payload.status
      }
      if (action.payload.priority !== undefined) {
        state.filterOptions.priority = action.payload.priority
      }
      if (action.payload.sites !== undefined) {
        state.filterOptions.sites = action.payload.sites
      }
      if (action.payload.dateRange !== undefined) {
        state.filterOptions.dateRange = action.payload.dateRange
      }
    },
    clearFilters: (state) => {
      state.filterOptions = initialState.filterOptions
      state.filterText = ''
    }
  }
})

// Export actions
export const { 
  setFilterText, 
  toggleSettings, 
  toggleFilter,
  setShowFilter, // Added setShowFilter
  setSelectedDate,
  setFilterOptions,
  clearFilters
} = shopFloorSlice.actions

// Selectors
export const selectFilterText = (state: RootState) => state.shopFloor.filterText
export const selectShowSettings = (state: RootState) => state.shopFloor.showSettings
export const selectShowFilter = (state: RootState) => state.shopFloor.showFilter
export const selectSelectedDate = (state: RootState) => state.shopFloor.selectedDate
export const selectFilterOptions = (state: RootState) => state.shopFloor.filterOptions

// Selector for filtered work orders (to be used in the component)
export const selectFilteredWorkOrders = (state: RootState) => {
  const { filterText, filterOptions, selectedDate } = state.shopFloor
  const { workOrders } = state.workOrders
  const { activeSite } = state.sites
  
  return workOrders.filter(order => {
    // Filter by site
    if (activeSite && order.siteLocation !== activeSite) {
      return false
    }
    
    // Filter by site (from filter options)
 if (filterOptions.sites.length > 0 && order.siteLocation && !filterOptions.sites.includes(order.siteLocation)) {
  return false;
}

    
    // Filter by text search (case insensitive)
    if (
        filterText &&
        !order.orderNo?.toLowerCase().includes(filterText.toLowerCase()) &&
        !order.part?.name?.toLowerCase().includes(filterText.toLowerCase())
      ) {
        return false;
      }
      
    // Filter by status
    if (filterOptions.status.length > 0 && !filterOptions.status.includes(order.status)) {
      return false
    }
    
    // Filter by date - check if the work order's date matches the selected date
    // This assumes each work order has a date field in YYYY-MM-DD format
    if (selectedDate && order.startTime) {
      const orderDate = order.startTime.split(' ')[0] // Extract date part from "YYYY-MM-DD HH:MM"
      if (orderDate !== selectedDate) {
        return false
      }
    }
    
    // Add more filters as needed
    
    return true
  })
}

export default shopFloorSlice.reducer