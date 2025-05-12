// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import sitesReducer from './features/sites/sitesSlice';
import workOrdersReducer from './features/workOrders/workOrdersSlice';
import employeesReducer from './features/employees/employeesSlice';
import shopFloorReducer from './features/shopFloor/shopFloorSlice'; // ✅ Import it

export const store = configureStore({
  reducer: {
    sites: sitesReducer,
    workOrders: workOrdersReducer,
    employees: employeesReducer,
    shopFloor: shopFloorReducer, // ✅ Add it here
  
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
