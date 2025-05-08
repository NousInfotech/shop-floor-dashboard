

import { Employee } from './employee'; // Adjust the import paths according to your folder structure
import { Operation } from './operation';

export interface WorkOrder {
  id: string;
  orderNo: string;
  siteLocation: string;
  startTime: string;
  endTime: string;
  status: 'RUNNING' | 'PENDING' | 'COMPLETED';
  part?: {
    number: string;
    name: string;
  };
  operationNo?: string;
  operations: Operation[];
  employees: Employee[];
}
