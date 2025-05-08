
export interface TimeLog {
    id: string;
    workOrderId: string;
    operationId?: string;
    employeeId?: string;
    timestamp: string;
    action: 'Start' | 'Pause' | 'Resume' | 'Complete' | 'Break' | 'Indirect';
    description?: string;
  }