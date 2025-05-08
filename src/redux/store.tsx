// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import sitesReducer from './features/sites/sitesSlice';
import workOrdersReducer from './features/workOrders/workOrdersSlice';
import employeesReducer from './features/employees/employeesSlice';

export const store = configureStore({
  reducer: {
    sites: sitesReducer,
    workOrders: workOrdersReducer,
    employees: employeesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
