// utils/work-order-helpers.ts
import { WorkOrder } from '@/types/work-order';

/**
 * Calculate the overall progress of a work order
 * @param workOrder The work order to calculate progress for
 * @returns Progress percentage
 */
export const calculateWorkOrderProgress = (workOrder: WorkOrder): number => {
  if (workOrder.produced == null || workOrder.target == null || workOrder.target === 0) {
    return 0;
  }
  return Math.round((workOrder.produced / workOrder.target) * 100);
};


/**
 * Determine the status color based on work order status
 * @param status The status of the work order
 * @returns Tailwind CSS color classes
 */
export const getWorkOrderStatusColor = (status: WorkOrder['status']): string => {
  switch (status) {
    case 'planned':
      return 'text-gray-500 bg-gray-100';
    case 'in-progress':
      return 'text-blue-500 bg-blue-100';
    case 'completed':
      return 'text-green-500 bg-green-100';
    case 'on-hold':
      return 'text-yellow-500 bg-yellow-100';
    default:
      return 'text-gray-500 bg-gray-100';
  }
};

/**
 * Format date string to a more readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatWorkOrderDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Get a list of employees assigned to a work order
 * @param workOrder The work order
 * @returns Array of employee names
 */
export const getWorkOrderEmployees = (workOrder: WorkOrder): string[] => {
  return (workOrder.employees ?? [])
    .filter(emp => emp?.exists)
    .map(emp => emp?.name ?? '');
};


/**
 * Check if a work order is overdue
 * @param workOrder The work order to check
 * @returns Boolean indicating if the work order is overdue
 */
export const isWorkOrderOverdue = (workOrder: WorkOrder): boolean => {
  if (!workOrder.endDate) return false;

  const endDate = new Date(workOrder.endDate);
  const today = new Date();
  return workOrder.status !== 'completed' && endDate < today;
};


/**
 * Validate work order data
 * @param workOrder The work order to validate
 * @returns Array of validation errors or empty array if valid
 */
export const validateWorkOrder = (workOrder: WorkOrder): string[] => {
  const errors: string[] = [];

  if (!workOrder.site) errors.push('Site is required');
  if (!workOrder.workCenter) errors.push('Work Center is required');
  if (!workOrder.startDate) errors.push('Start Date is required');
  if (!workOrder.endDate) errors.push('End Date is required');

  if (workOrder.startDate && workOrder.endDate) {
    const startDate = new Date(workOrder.startDate);
    const endDate = new Date(workOrder.endDate);
    if (startDate > endDate) {
      errors.push('Start Date must be before End Date');
    }
  }

  if (workOrder.target != null && workOrder.target <= 0) {
    errors.push('Production target must be greater than zero');
  }

  if (
    workOrder.produced != null &&
    workOrder.target != null &&
    workOrder.produced > workOrder.target
  ) {
    errors.push('Produced quantity cannot exceed target');
  }

  return errors;
};
