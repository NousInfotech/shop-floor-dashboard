import { createAsyncThunk } from '@reduxjs/toolkit';
import { WorkOrder } from '@/types/work-order';
import { Employee } from '@/types/employee';  // Make sure Employee type is defined
import axios from 'axios';

export const fetchWorkOrders = createAsyncThunk(
  'workOrders/fetchWorkOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<WorkOrder[]>('/api/work-orders');
      return response.data;
    } catch {
      return rejectWithValue('Failed to fetch work orders');
    }
  }
);

export const createWorkOrderAsync = createAsyncThunk(
  'workOrders/createWorkOrder',
  async (workOrder: WorkOrder, { rejectWithValue }) => {
    try {
      const response = await axios.post<WorkOrder>('/api/work-orders', workOrder);
      return response.data;
    } catch {
      return rejectWithValue('Failed to create work order');
    }
  }
);

export const updateWorkOrderAsync = createAsyncThunk(
  'workOrders/updateWorkOrder',
  async ({ id, updates }: { id: string, updates: Partial<WorkOrder> }, { rejectWithValue }) => {
    try {
      const response = await axios.patch<WorkOrder>(`/api/work-orders/${id}`, updates);
      return response.data;
    } catch {
      return rejectWithValue('Failed to update work order');
    }
  }
);

export const deleteWorkOrderAsync = createAsyncThunk(
  'workOrders/deleteWorkOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/work-orders/${id}`);
      return id;
    } catch {
      return rejectWithValue('Failed to delete work order');
    }
  }
);

export const addEmployeeToWorkOrderAsync = createAsyncThunk(
  'workOrders/addEmployee',
  async ({ workOrderId, employee }: { workOrderId: string, employee: Employee }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/work-orders/${workOrderId}/employees`, employee);
      return { workOrderId, employee: response.data };
    } catch {
      return rejectWithValue('Failed to add employee to work order');
    }
  }
);

export const removeEmployeeFromWorkOrderAsync = createAsyncThunk(
  'workOrders/removeEmployee',
  async ({ workOrderId, employeeId }: { workOrderId: string, employeeId: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/work-orders/${workOrderId}/employees/${employeeId}`);
      return { workOrderId, employeeId };
    } catch {
      return rejectWithValue('Failed to remove employee from work order');
    }
  }
);

export const updateWorkOrderProgressAsync = createAsyncThunk(
  'workOrders/updateProgress',
  async ({ workOrderId, produced }: { workOrderId: string, produced: number }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/work-orders/${workOrderId}/progress`, { produced });
      return { workOrderId, produced: response.data.produced };
    } catch {
      return rejectWithValue('Failed to update work order progress');
    }
  }
);

export const updateWorkOrderStatusAsync = createAsyncThunk(
  'workOrders/updateStatus',
  async ({ workOrderId, status }: { workOrderId: string, status: WorkOrder['status'] }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/work-orders/${workOrderId}/status`, { status });
      return { workOrderId, status: response.data.status };
    } catch {
      return rejectWithValue('Failed to update work order status');
    }
  }
);
