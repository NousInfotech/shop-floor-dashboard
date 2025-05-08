import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkOrder, Employee } from '@/types/test';

interface WorkOrdersState {
  workOrders: WorkOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkOrdersState = {
  workOrders: [
    {
      id: "WO001",
      startDate: "2025-05-01",
      endDate: "2025-05-10",
      site: "Main Factory",
      workCenter: "Assembly",
      operation: "10",
      employees: [
        { id: "Emp-1", name: "John Doe", exists: true },
        { id: "Emp-2", name: "Jane Smith", exists: false },
        { id: "Emp-3", name: "Robert Chen", exists: true }
      ],
      team: "T001",
      createTeamAutomatically: true,
      status: "in-progress",
      progress: 45,
      target: 100,
      produced: 45
    },
    {
      id: "WO002",
      startDate: "2025-05-03",
      endDate: "2025-05-15",
      site: "Secondary Plant",
      workCenter: "Packaging",
      operation: "20",
      employees: [
        { id: "Emp-4", name: "Maria Garcia", exists: true },
        { id: "Emp-8", name: "James Wilson", exists: true }
      ],
      team: "T002",
      createTeamAutomatically: true,
      status: "planned",
      progress: 0,
      target: 80,
      produced: 0
    }
  ],
  loading: false,
  error: null
};

export const workOrderSlice = createSlice({
  name: 'workOrders',
  initialState,
  reducers: {
    // Create a new work order
    createWorkOrder: (state, action: PayloadAction<WorkOrder>) => {
      state.workOrders.push(action.payload);
    },
    
    // Update an existing work order
    updateWorkOrder: (state, action: PayloadAction<{ id: string; updates: Partial<WorkOrder> }>) => {
      const { id, updates } = action.payload;
      const index = state.workOrders.findIndex(wo => wo.id === id);
      
      if (index !== -1) {
        state.workOrders[index] = { ...state.workOrders[index], ...updates };
      }
    },
    
    // Delete a work order
    deleteWorkOrder: (state, action: PayloadAction<string>) => {
      state.workOrders = state.workOrders.filter(wo => wo.id !== action.payload);
    },
    
    // Add an employee to a work order
    addEmployeeToWorkOrder: (state, action: PayloadAction<{ workOrderId: string; employee: Employee }>) => {
      const { workOrderId, employee } = action.payload;
      const workOrder = state.workOrders.find(wo => wo.id === workOrderId);
      
      if (workOrder) {
        workOrder.employees.push(employee);
      }
    },
    
    // Remove an employee from a work order
    removeEmployeeFromWorkOrder: (state, action: PayloadAction<{ workOrderId: string; employeeId: string }>) => {
      const { workOrderId, employeeId } = action.payload;
      const workOrder = state.workOrders.find(wo => wo.id === workOrderId);
      
      if (workOrder) {
        workOrder.employees = workOrder.employees.filter(emp => emp.id !== employeeId);
      }
    },
    
    // Update work order progress
    updateWorkOrderProgress: (state, action: PayloadAction<{ workOrderId: string; produced: number }>) => {
      const { workOrderId, produced } = action.payload;
      const workOrder = state.workOrders.find(wo => wo.id === workOrderId);
      
      if (workOrder) {
        workOrder.produced = produced;
        workOrder.progress = Math.round((produced / workOrder.target) * 100);
      }
    },
    
    // Update work order status
    updateWorkOrderStatus: (state, action: PayloadAction<{ workOrderId: string; status: WorkOrder['status'] }>) => {
      const { workOrderId, status } = action.payload;
      const workOrder = state.workOrders.find(wo => wo.id === workOrderId);
      
      if (workOrder) {
        workOrder.status = status;
      }
    }
  }
});

export const { 
  createWorkOrder, 
  updateWorkOrder, 
  deleteWorkOrder, 
  addEmployeeToWorkOrder, 
  removeEmployeeFromWorkOrder,
  updateWorkOrderProgress,
  updateWorkOrderStatus
} = workOrderSlice.actions;

export default workOrderSlice.reducer;