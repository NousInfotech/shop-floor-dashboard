import { useState } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  MoreHorizontal,
  Users,
  UserPlus,
//   UserX,
//   RefreshCw,
//   ListFilter,
  Building2,
  BadgeCheck,
//   Save,
  X,
  Edit,
  Trash2,
  FileSpreadsheet,
//   CheckCircle2,
  Plus,
} from 'lucide-react';
import { Employee, EmployeeStatus, EmploymentType } from '@/types/employee';
import { EmployeesData } from '@/data/employees';

import EmployeeModal from './EmployeeModal';
import AssignModal from './assignmentModal';

// Define a TaskAssignment type that matches what AssignModal expects
interface TaskAssignment {
  employeeId: string;
  taskId: string;
  taskName: string;
  workstationId: string;
  workstationName: string;
  shiftId: string;
  shiftName: string;
  startDate: Date;
  endDate: Date | null;
  isRecurring: boolean;
  priority: string;
  notes: string;
  status: string;
  assignedAt: Date;
}

export default function EmployeeManagement() {
  const [employeeCode, setEmployeeCode] = useState('EMP1746906215');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [site, setSite] = useState('Main Factory');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [isActive, setIsActive] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>(() => EmployeesData as Employee[]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const handleAddEmployee = () => {
    if (!employeeCode || !firstName || !lastName) return;

    const newEmployee: Employee = {
      id: Date.now().toString(),
      employeeCode,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: '000-000-0000',
      address: 'TBD',
      site,
      siteCode: site === 'Main Factory' ? 'MAIN' : 'OTHER',
      employmentType,
      status: (isActive ? 'Active' : 'Inactive') as EmployeeStatus,
      shift: 'Morning',
      role: 'New Employee',
      department: 'New Department',
      position: 'New Position',
      photo: '',
      payment: {
        currency: 'USD',
        rateType: 'Monthly',
        unitCost: 0,
        locationId: ''
      }
    };

    setEmployees(prev => [...prev, newEmployee]);
    setEmployeeCode(`EMP${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`);
    setFirstName('');
    setLastName('');
    setEmploymentType('Full-time');
  };

  const handleEditEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleAssignEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsAssignModalOpen(true);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
    setIsEditModalOpen(false);
    setCurrentEmployee(null);
  };

  // This is a handler function that matches what AssignModal expects
  const handleAssignmentComplete = (assignments: TaskAssignment) => {
    if (currentEmployee) {
      const updatedEmployee: Employee = {
        ...currentEmployee,
        department: assignments.taskName ? currentEmployee.department : currentEmployee.department,
        role: assignments.taskName || currentEmployee.role,
      };
      setEmployees(prev => prev.map(emp => emp.id === currentEmployee.id ? updatedEmployee : emp));
    }
    setIsAssignModalOpen(false);
    setCurrentEmployee(null);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchQuery
      ? `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.role?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && employee.status === 'Active') ||
      (statusFilter === 'inactive' && employee.status === 'Inactive');

    const matchesDepartment = departmentFilter === 'all' ||
      employee.department?.toLowerCase() === departmentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-4">
      <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-3xl">
        <Users className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
          <p className="text-sm text-gray-500">Manage your workforce and employee assignments</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-600" /> Add New Employee
          </h2>
        </div>
      
      {/* Employee Form */}
      <div className="bg-white p-6 rounded-md shadow-sm mb-8">
        <p className="text-gray-500 mb-6">Enter the basic employee information below. You can add more details later by editing the employee.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label htmlFor="employeeCode" className="block text-sm font-medium mb-1">
              Employee Code <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="employeeCode"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                className="w-full pl-9 border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <BadgeCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-500" />
            </div>
          </div>
          
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-9 border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-500" />
            </div>
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-9 border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-500" />
            </div>
          </div>
          
          <div>
            <label htmlFor="site" className="block text-sm font-medium mb-1">
              Site <span className="text-red-500">*</span>
            </label>
            <Select value={site} onValueChange={setSite}>
              <SelectTrigger className="w-full border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-9 relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-500" />
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem value="Main Factory">Main Factory</SelectItem>
                <SelectItem value="Branch Office">Branch Office</SelectItem>
                <SelectItem value="Warehouse">Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium mb-1">
              Employment Type
            </label>
            <Select 
              value={employmentType} 
              onValueChange={(value) => setEmploymentType(value as EmploymentType)}
            >
              <SelectTrigger className="w-full border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-9 relative">
                <FileSpreadsheet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-500" />
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Permanent">Permanent</SelectItem>
                <SelectItem value="Temporary">Temporary</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Active</span>
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isActive ? 'translate-x-6' : 'translate-x-1'}`} 
              />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="px-6 flex items-center gap-2 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
              onClick={() => {
                setEmployeeCode(`EMP${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`);
                setFirstName('');
                setLastName('');
                setIsActive(true);
                setSite('Main Factory');
                setEmploymentType('Full-time');
              }}
            >
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button 
              variant="outline" 
              className="px-6 flex items-center gap-2 bg-green-50 text-green-600 border-green-200 hover:bg-green-100" 
              onClick={handleAddEmployee}
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </div>
      
      {/* Employee List */}
      <div className="bg-white rounded-md shadow-sm">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search employees..." 
              className="pl-10 border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36 border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
               <SelectContent className='bg-white'>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-36 border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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
              {filteredEmployees.map(employee => (
                <tr key={employee.id} className="border-t border-gray-100">
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
                        <Button variant="outline" size="sm" className="h-8 px-2 py-1 bg-gray-50 border-gray-300 hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className='bg-white'>
                        <DropdownMenuItem onClick={() => handleEditEmployee(employee)} className="flex items-center gap-2 text-blue-600 hover:bg-blue-50">
                          <Edit className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAssignEmployee(employee)} className="flex items-center gap-2 text-purple-600 hover:bg-purple-50">
                          <FileSpreadsheet className="h-4 w-4" /> Assign
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteEmployee(employee.id)} className="flex items-center gap-2 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No employees found matching your search criteria.
            </div>
          )}
        </div>
      </div>
      
      {/* Employee Edit Modal */}
      <EmployeeModal
        isOpen={isEditModalOpen}
        employee={currentEmployee}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentEmployee(null);
        }}
        onSubmit={handleUpdateEmployee}
      />

      {/* Employee Assignment Modal */}
      {currentEmployee && (
        <AssignModal
          isOpen={isAssignModalOpen}
          employee={currentEmployee}
          onClose={() => {
            setIsAssignModalOpen(false);
            setCurrentEmployee(null);
          }}
          onAssign={(employeeId) => {
            // If you need to handle the onAssign callback
            console.log('Task assigned to employee', employeeId);
          }}
          onSubmit={handleAssignmentComplete}
        />
      )}
    </div>
    </div>
  );
}