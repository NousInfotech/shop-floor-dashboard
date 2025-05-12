// redux/features/employees/employeesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Employee } from '@/types/employee';

import { employees } from '@/data/employees'; // <-- use this instead of employeesData


interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  filters: {
    status: string;
    department: string;
    searchQuery: string;
  };
}

const initialState: EmployeesState = {
  employees, // <-- now you're using properly casted employees with RateType
  loading: false,
  error: null,
  filters: {
    status: 'All',
    department: 'All',
    searchQuery: '',
  },
};


export const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
    },
    updateEmployeeStatus: (state, action: PayloadAction<{ id: string; status: 'Active' | 'Inactive' | 'Break' }>) => {
      const { id, status } = action.payload;
      const index = state.employees.findIndex(emp => emp.id === id);
      if (index !== -1) {
        state.employees[index].status = status;
      }
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },
    setDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.filters.department = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
  },
});

export const {
  addEmployee,
  updateEmployee,
  removeEmployee,
  deleteEmployee,
  updateEmployeeStatus,
  setStatusFilter,
  setDepartmentFilter,
  setSearchQuery,
} = employeesSlice.actions;

export const selectEmployees = (state: RootState) => state.employees.employees;

export default employeesSlice.reducer;
