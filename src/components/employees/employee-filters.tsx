'use client';

import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployee } from '@/lib/hooks/use-employee';
import { DEPARTMENTS, EMPLOYEE_STATUSES } from '@/lib/utils/constants';
import { SearchIcon } from 'lucide-react';

export default function EmployeeFilters() {
  const { filters, handleFilterChange } = useEmployee();

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-md shadow-sm">
      <div className="flex-1 relative">
        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search employees..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange.search(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex gap-4">
        <div className="w-40">
          <Select 
            value={filters.status} 
            onValueChange={handleFilterChange.status}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Status: All</SelectItem>
              {EMPLOYEE_STATUSES.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-48">
          <Select 
            value={filters.department} 
            onValueChange={handleFilterChange.department}
          >
            <SelectTrigger>
              <SelectValue placeholder="Department: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Department: All</SelectItem>
              {DEPARTMENTS.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
