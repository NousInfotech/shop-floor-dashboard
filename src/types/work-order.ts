import { Employee } from "./employee";// Adjust the import paths according to your folder structure
import { Operation } from './operation';


export type WorkOrderStatus =
  | 'planned'
  | 'in-progress'
  | 'completed'
  | 'on-hold'
  | 'RUNNING'
  | 'PENDING'
  | 'COMPLETED';

export interface WorkOrder {
  id: string;
  orderNo?: string; // optional since not all have it
  name?: string;
  site?: string;
  
   priority?: string;
   completionPercentage?: number;
  siteLocation?: string;
  workCenter?: string;
  operation?: string;
  operations?: Operation[];
  operationNo?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  status: WorkOrderStatus;
    notes?: string;
  part?: {
    number: string;
    name: string;
  };
  employees: Employee[];
  team?: string;
  createTeamAutomatically?: boolean;
  progress?: number;
  target?: number;
  produced?: number;
}
