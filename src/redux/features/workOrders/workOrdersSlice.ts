// src/redux/features/workOrders/workOrdersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkOrder } from '@/types/work-order';
import { RootState } from '../../store';
import { workOrdersData } from '@/data/work-orders';
import { Employee } from '@/types/employee';

// Ensure type safety for date comparisons
const safeParseDate = (dateStr: string | null): Date | null => {
  if (!dateStr) return null;
  const parsedDate = new Date(dateStr);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

interface WorkOrdersState {
  workOrders: WorkOrder[];
  activeWorkOrder: WorkOrder | null;
  filteredWorkOrders: WorkOrder[];
  filterOptions: {
    status: string[];
    dateRange: { start: string | null; end: string | null };
  };
  loading: boolean;
  error: string | null;
}

const initialState: WorkOrdersState = {
  workOrders: workOrdersData,
  activeWorkOrder: null,
  filteredWorkOrders: workOrdersData,
  filterOptions: {
    status: [],
    dateRange: { start: null, end: null }
  },
  loading: false,
  error: null
};

export const workOrdersSlice = createSlice({
  name: 'workOrders',
  initialState,
  reducers: {
    // -------------------- Existing CRUD and UI reducers --------------------
    setActiveWorkOrder: (state, action: PayloadAction<WorkOrder | null>) => {
      state.activeWorkOrder = action.payload;
    },
    addWorkOrder: (state, action: PayloadAction<WorkOrder>) => {
      state.workOrders.push(action.payload);
      state.filteredWorkOrders = state.workOrders;
    },
    updateWorkOrder: (state, action: PayloadAction<{ id: string; updates: Partial<WorkOrder> }>) => {
  const { id, updates } = action.payload;
  const workOrder = state.workOrders.find(order => order.id === id);
  if (workOrder) {
    Object.assign(workOrder, updates);
    if (state.activeWorkOrder?.id === id) {
      state.activeWorkOrder = { ...state.activeWorkOrder, ...updates };
    }
    state.filteredWorkOrders = state.workOrders;
  }
},

    removeWorkOrder: (state, action: PayloadAction<string>) => {
      state.workOrders = state.workOrders.filter(order => order.id !== action.payload);
      state.filteredWorkOrders = state.workOrders;
      if (state.activeWorkOrder?.id === action.payload) {
        state.activeWorkOrder = null;
      }
    },
    setFilterOptions: (state, action: PayloadAction<{ status: string[]; dateRange: { start: string | null; end: string | null } }>) => {
      state.filterOptions = action.payload;
      state.filteredWorkOrders = state.workOrders.filter(order => {
        const matchesStatus = action.payload.status.length === 0 || action.payload.status.includes(order.status);
        const orderDate = safeParseDate(order.date ?? null);
        const startDate = safeParseDate(action.payload.dateRange.start);
        const endDate = safeParseDate(action.payload.dateRange.end);
        const matchesDateRange =
          (!startDate || (orderDate && orderDate >= startDate)) &&
          (!endDate || (orderDate && orderDate <= endDate));
        return matchesStatus && matchesDateRange;
      });
    },
    clearFilters: (state) => {
      state.filterOptions = { status: [], dateRange: { start: null, end: null } };
      state.filteredWorkOrders = state.workOrders;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // -------------------- Additional reducers from second slice --------------------
    createWorkOrder: (state, action: PayloadAction<WorkOrder>) => {
      state.workOrders.push(action.payload);
      state.filteredWorkOrders = state.workOrders;
    },
    deleteWorkOrder: (state, action: PayloadAction<string>) => {
      state.workOrders = state.workOrders.filter(wo => wo.id !== action.payload);
      state.filteredWorkOrders = state.workOrders;
    },
    updateWorkOrderById: (state, action: PayloadAction<{ id: string; updates: Partial<WorkOrder> }>) => {
      const { id, updates } = action.payload;
      const index = state.workOrders.findIndex(wo => wo.id === id);
      if (index !== -1) {
        state.workOrders[index] = { ...state.workOrders[index], ...updates };
        state.filteredWorkOrders = state.workOrders;
      }
    },
    addEmployeeToWorkOrder: (state, action: PayloadAction<{ workOrderId: string; employee: Employee }>) => {
      const { workOrderId, employee } = action.payload;
      const workOrder = state.workOrders.find(wo => wo.id === workOrderId);
      if (workOrder) {
        workOrder.employees.push(employee);
      }
    },
    removeEmployeeFromWorkOrder: (state, action: PayloadAction<{ workOrderId: string; employeeId: string }>) => {
      const { workOrderId, employeeId } = action.payload;
      const workOrder = state.workOrders.find(wo => wo.id === workOrderId);
      if (workOrder) {
        workOrder.employees = workOrder.employees.filter(emp => emp.id !== employeeId);
      }
    },
   updateWorkOrderProgress: (state, action: PayloadAction<{ workOrderId: string; produced: number }>) => {
  const { workOrderId, produced } = action.payload;
  const workOrder = state.workOrders.find(wo => wo.id === workOrderId);

  if (workOrder) {
    workOrder.produced = produced;
    
    if (typeof workOrder.target === 'number' && workOrder.target > 0) {
      workOrder.progress = Math.round((produced / workOrder.target) * 100);
    } else {
      workOrder.progress = 0; // fallback if target is undefined or 0
    }
  }
},

    updateWorkOrderStatus: (state, action: PayloadAction<{ workOrderId: string; status: WorkOrder['status'] }>) => {
      const { workOrderId, status } = action.payload;
      const workOrder = state.workOrders.find(wo => wo.id === workOrderId);
      if (workOrder) {
        workOrder.status = status;
      }
    }
  }
});

// Export actions
export const {
  setActiveWorkOrder,
  addWorkOrder,
  updateWorkOrder,
  removeWorkOrder,
  setFilterOptions,
  clearFilters,
  setLoading,
  setError,
  createWorkOrder,
  deleteWorkOrder,
  updateWorkOrderById,
  addEmployeeToWorkOrder,
  removeEmployeeFromWorkOrder,
  updateWorkOrderProgress,
  updateWorkOrderStatus
} = workOrdersSlice.actions;

// Export selectors
export const selectWorkOrders = (state: RootState) => state.workOrders.workOrders;
export const selectFilteredWorkOrders = (state: RootState) => state.workOrders.filteredWorkOrders;
export const selectFilterOptions = (state: RootState) => state.workOrders.filterOptions;
export const selectActiveWorkOrder = (state: RootState) => state.workOrders.activeWorkOrder;
export const selectWorkOrdersLoading = (state: RootState) => state.workOrders.loading;
export const selectWorkOrdersError = (state: RootState) => state.workOrders.error;

// Export reducer
export default workOrdersSlice.reducer;
