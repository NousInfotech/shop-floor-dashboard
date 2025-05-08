

// redux/features/employees/employeesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Employee } from '@/types/employee';
import { employeesData } from '@/data/employees';

interface EmployeesState {
  employees: Employee[];
}

const initialState: EmployeesState = {
  employees: employeesData,
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
    updateEmployeeStatus: (state, action: PayloadAction<{id: string, status: 'Active' | 'Inactive' | 'Break'}>) => {
      const { id, status } = action.payload;
      const index = state.employees.findIndex(emp => emp.id === id);
      
      if (index !== -1) {
        state.employees[index].status = status;
      }
    },
  },
});

export const {
  addEmployee,
  updateEmployee,
  removeEmployee,
  updateEmployeeStatus,
} = employeesSlice.actions;

export const selectEmployees = (state: RootState) => state.employees.employees;

export default employeesSlice.reducer;