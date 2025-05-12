'use client';

import { Employee } from '@/types/employee';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PencilIcon, TrashIcon } from 'lucide-react';
import { useEmployee } from '@/lib/hooks/use-employee';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EmployeeListProps {
  employees: Employee[];
}

export default function EmployeeList({ employees }: EmployeeListProps) {
  const { handleEditEmployee, handleDeleteEmployee } = useEmployee();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'On Leave': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Employee Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Site Code</TableHead>
            <TableHead>Employment Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No employees found.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.employeeCode}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.photo} />
                      <AvatarFallback>
                      <span>
  {employee.firstName ? employee.firstName : 'No First Name'}{' '}
  {employee.lastName ? employee.lastName : 'No Last Name'}
</span>

                      </AvatarFallback>
                    </Avatar>
                    <span>{employee.firstName} {employee.lastName}</span>
                  </div>
                </TableCell>
                <TableCell>{employee.siteCode}</TableCell>
                <TableCell>{employee.employmentType}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(employee.status)}>
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleEditEmployee(employee)}
                        className="cursor-pointer"
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
