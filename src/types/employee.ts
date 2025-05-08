// types/employee.ts
export interface Employee {
    id: string;
    barcode: string;
    name: string;
    employmentType: 'Permanent' | 'Temporary' | 'Contract';
    status: 'Active' | 'Inactive' | 'Break';
    assignedOperation?: string;
  }
  
  