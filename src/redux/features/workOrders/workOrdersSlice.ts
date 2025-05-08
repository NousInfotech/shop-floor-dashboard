
// redux/features/workOrders/workOrdersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { WorkOrder } from '@/types/work-order';
import { Operation } from '@/types/operation';
import { Employee } from '@/types/employee';
import { workOrdersData } from '@/data/work-orders';

interface WorkOrdersState {
  workOrders: WorkOrder[];
  activeWorkOrder: WorkOrder | null;
  filteredWorkOrders: WorkOrder[];
}

const initialState: WorkOrdersState = {
  workOrders: workOrdersData,
  activeWorkOrder: null,
  filteredWorkOrders: workOrdersData,
};

export const workOrdersSlice = createSlice({
  name: 'workOrders',
  initialState,
  reducers: {
    setActiveWorkOrder: (state, action: PayloadAction<WorkOrder | null>) => {
      state.activeWorkOrder = action.payload;
    },
    addWorkOrder: (state, action: PayloadAction<WorkOrder>) => {
      state.workOrders.push(action.payload);
      state.filteredWorkOrders = state.workOrders;
    },
    updateWorkOrder: (state, action: PayloadAction<WorkOrder>) => {
      const index = state.workOrders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.workOrders[index] = action.payload;
        
        // Update active work order if it's the same one
        if (state.activeWorkOrder && state.activeWorkOrder.id === action.payload.id) {
          state.activeWorkOrder = action.payload;
        }
        
        state.filteredWorkOrders = state.workOrders;
      }
    },
    removeWorkOrder: (state, action: PayloadAction<string>) => {
      state.workOrders = state.workOrders.filter(order => order.id !== action.payload);
      state.filteredWorkOrders = state.workOrders;
      
      // Clear active work order if it's the same one
      if (state.activeWorkOrder && state.activeWorkOrder.id === action.payload) {
        state.activeWorkOrder = null;
      }
    },
    filterWorkOrdersBySite: (state, action: PayloadAction<string>) => {
      state.filteredWorkOrders = state.workOrders.filter(
        order => order.siteLocation === action.payload
      );
    },
    updateWorkOrderStatus: (state, action: PayloadAction<{id: string, status: 'RUNNING' | 'PENDING' | 'COMPLETED'}>) => {
      const { id, status } = action.payload;
      const index = state.workOrders.findIndex(order => order.id === id);
      
      if (index !== -1) {
        state.workOrders[index].status = status;
        
        if (state.activeWorkOrder && state.activeWorkOrder.id === id) {
          state.activeWorkOrder.status = status;
        }
      }
    },
    updateOperation: (state, action: PayloadAction<{workOrderId: string, operation: Operation}>) => {
      const { workOrderId, operation } = action.payload;
      const orderIndex = state.workOrders.findIndex(order => order.id === workOrderId);
      
      if (orderIndex !== -1) {
        const operationIndex = state.workOrders[orderIndex].operations.findIndex(
          op => op.id === operation.id
        );
        
        if (operationIndex !== -1) {
          state.workOrders[orderIndex].operations[operationIndex] = operation;
          
          if (state.activeWorkOrder && state.activeWorkOrder.id === workOrderId) {
            state.activeWorkOrder.operations[operationIndex] = operation;
          }
        }
      }
    },
    assignEmployeeToWorkOrder: (state, action: PayloadAction<{workOrderId: string, employee: Employee}>) => {
      const { workOrderId, employee } = action.payload;
      const orderIndex = state.workOrders.findIndex(order => order.id === workOrderId);
      
      if (orderIndex !== -1) {
        // Check if employee already exists
        const employeeIndex = state.workOrders[orderIndex].employees.findIndex(
          emp => emp.id === employee.id
        );
        
        if (employeeIndex !== -1) {
          state.workOrders[orderIndex].employees[employeeIndex] = employee;
        } else {
          state.workOrders[orderIndex].employees.push(employee);
        }
        
        if (state.activeWorkOrder && state.activeWorkOrder.id === workOrderId) {
          state.activeWorkOrder.employees = [...state.workOrders[orderIndex].employees];
        }
      }
    },
    removeEmployeeFromWorkOrder: (state, action: PayloadAction<{workOrderId: string, employeeId: string}>) => {
      const { workOrderId, employeeId } = action.payload;
      const orderIndex = state.workOrders.findIndex(order => order.id === workOrderId);
      
      if (orderIndex !== -1) {
        state.workOrders[orderIndex].employees = state.workOrders[orderIndex].employees.filter(
          emp => emp.id !== employeeId
        );
        
        if (state.activeWorkOrder && state.activeWorkOrder.id === workOrderId) {
          state.activeWorkOrder.employees = state.workOrders[orderIndex].employees;
        }
      }
    },
  },
});

export const {
  setActiveWorkOrder,
  addWorkOrder,
  updateWorkOrder,
  removeWorkOrder,
  filterWorkOrdersBySite,
  updateWorkOrderStatus,
  updateOperation,
  assignEmployeeToWorkOrder,
  removeEmployeeFromWorkOrder,
} = workOrdersSlice.actions;

export const selectWorkOrders = (state: RootState) => state.workOrders.workOrders;
export const selectFilteredWorkOrders = (state: RootState) => state.workOrders.filteredWorkOrders;
export const selectActiveWorkOrder = (state: RootState) => state.workOrders.activeWorkOrder;

export default workOrdersSlice.reducer;