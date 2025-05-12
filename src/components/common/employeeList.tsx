import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MoreHorizontal 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Employee } from '@/types/employee';

interface EmployeeListProps {
  employees: Employee[];
  searchQuery: string;
  statusFilter: string;
  departmentFilter: string;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onDepartmentFilterChange: (department: string) => void;
  onEditEmployee: (employee: Employee) => void;
  onAssignEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

export default function EmployeeList({
  employees,
  searchQuery,
  statusFilter,
  departmentFilter,
  onSearchChange,
  onStatusFilterChange,
  onDepartmentFilterChange,
  onEditEmployee,
  onAssignEmployee,
  onDeleteEmployee,
}: EmployeeListProps) {
  return (
    <div className="bg-white rounded-md shadow-sm">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search employees..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Department: All" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value="all">Department: All</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="New Department">New Department</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Employee Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Employee</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {employee.firstName} {employee.lastName}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{employee.role}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                    employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <span className={`h-2 w-2 rounded-full mr-1 ${
                      employee.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></span>
                    {employee.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 px-2 py-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='bg-white'>
                      <DropdownMenuItem onClick={() => onEditEmployee(employee)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAssignEmployee(employee)}>Assign</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteEmployee(employee.id)} className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {employees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No employees found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}