export type WorkOrderStatus = 'planned' | 'in-progress' | 'paused' | 'completed';

export interface Employee {
  id: string;
  name: string;
  exists: boolean;
}

export interface WorkOrder {
  id: string;
  startDate: string;
  endDate: string;
  site: string;
  workCenter: string;
  operation: string;
  employees: Employee[];
  team: string;
  createTeamAutomatically: boolean;
  status: WorkOrderStatus;
  progress: number;
  target: number;
  produced: number;
}

export interface Team {
  id: string;
  name: string;
  leader: string;
  members: TeamMember[];
  workOrders: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive';
}

export interface Production {
  id: string;
  workOrderId: string;
  status: 'planned' | 'in-progress' | 'paused' | 'completed';
  target: number;
  produced: number;
  startTime: string;
  endTime: string;
  team: string;
  efficiency: number;
  issues: string[];
}

export interface EmployeeActivity {
  id: string;
  employeeId: string;
  employeeName: string;
  workOrderId: string;
  activity: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  status: 'active' | 'completed';
}

export interface LaborEfficiency {
  date: string;
  efficiency: number;
  target: number;
  variance: number;
}

export interface ProductivityData {
  date: string;
  rate: number;
  target: number;
}