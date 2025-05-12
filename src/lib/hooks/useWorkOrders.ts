// hooks/useWorkOrders.ts
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store';

import { 
  createWorkOrder, 
  updateWorkOrder, 
  deleteWorkOrder,
  addEmployeeToWorkOrder,
  removeEmployeeFromWorkOrder,
  updateWorkOrderProgress,
  updateWorkOrderStatus
} from '@/redux/features/workOrders/workOrdersSlice';
import { WorkOrder } from '@/types/work-order';
import { Employee } from '@/types/employee';

export function useWorkOrders() {
  const dispatch = useDispatch();
  const workOrders = useSelector((state: RootState) => state.workOrders.workOrders);

  const create = (workOrder: WorkOrder) => {
    dispatch(createWorkOrder(workOrder));
  };

  const update = (id: string, updates: Partial<WorkOrder>) => {
    dispatch(updateWorkOrder({ id, updates }));
  };

  const remove = (id: string) => {
    dispatch(deleteWorkOrder(id));
  };

  const addEmployee = (workOrderId: string, employee: Employee) => {
    dispatch(addEmployeeToWorkOrder({ workOrderId, employee }));
  };

  const removeEmployee = (workOrderId: string, employeeId: string) => {
    dispatch(removeEmployeeFromWorkOrder({ workOrderId, employeeId }));
  };

  const updateProgress = (workOrderId: string, produced: number) => {
    dispatch(updateWorkOrderProgress({ workOrderId, produced }));
  };

  const updateStatus = (workOrderId: string, status: WorkOrder['status']) => {
    dispatch(updateWorkOrderStatus({ workOrderId, status }));
  };

  return {
    workOrders,
    create,
    update,
    remove,
    addEmployee,
    removeEmployee,
    updateProgress,
    updateStatus
  };
}
