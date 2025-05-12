// types/employee.ts

export type EmployeeStatus = "Active" | "Inactive" | "Break" | "On Leave";
export type EmploymentType = "Permanent" | "Temporary" | "Contract" | "Full-time" | "Part-time";
export type ShiftType = "Morning" | "Afternoon" | "Night" | "Flexible";
export type RateType = "Hourly" | "Daily" | "Weekly" | "Monthly" | "Annual";

export interface Employee {
  id: string;
  barcode?: string;
  employeeCode?: string;
  name?: string; // For simple usage
  exists?: boolean; 
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  site?: string;
  siteCode?: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  shift?: ShiftType;
  role?: string;
  department?: string;
  position?: string;
  assignedOperation?: string;
  photo?: string;
  payment?: {
    currency: string;
    rateType: RateType;
    unitCost: number;
    locationId?: string;
  };
  salary?: string; // Added salary field
  paymentType?: "Bank Transfer" | "Cash"; // Added paymentType field
}

// NewEmployeeType definition remains unchanged
export type NewEmployeeType = Omit<Employee, 'id'> & {
  name: string;
  exists: boolean;
};
