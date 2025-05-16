// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import sitesReducer from './features/sites/sitesSlice';
import workOrdersReducer from './features/workOrders/workOrdersSlice';
import employeesReducer from './features/employees/employeesSlice';
import shopFloorReducer from './features/shopFloor/shopFloorSlice'; 
import teamReducer from './features/teams/teamSlice';
import dataReducer from './features/data/dataSlice';
export const store = configureStore({
  reducer: {
    sites: sitesReducer,
    workOrders: workOrdersReducer,
    employees: employeesReducer,
    shopFloor: shopFloorReducer, 
    team: teamReducer,
    data: dataReducer,
  
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
