
// data/employees.ts
import { Employee } from '@/types/employee';

export const employeesData: Employee[] = [
  {
    id: '1',
    barcode: 'BC001',
    name: 'John Doe',
    employmentType: 'Permanent',
    status: 'Active',
  },
  {
    id: '2',
    barcode: 'BC002',
    name: 'Jane Smith',
    employmentType: 'Permanent',
    status: 'Active',
  },
  {
    id: '3',
    barcode: 'BC003',
    name: 'Mike Johnson',
    employmentType: 'Temporary',
    status: 'Inactive',
  },
  {
    id: '4',
    barcode: 'BC004',
    name: 'Sarah Williams',
    employmentType: 'Contract',
    status: 'Active',
  },
];