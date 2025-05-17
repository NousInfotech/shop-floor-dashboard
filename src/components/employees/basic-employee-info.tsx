import { useState, useRef, useEffect } from 'react';
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Search,
  MoreHorizontal,
  Users,
  UserPlus,
  Building2,
  BadgeCheck,
  X,
  Edit,
  Trash2,
  FileSpreadsheet,
  Plus,
  Camera,
  QrCode,
} from 'lucide-react';
import { Employee } from '@/types/employee';
// import { ShiftType } from '@/types/employee';
// import {EmployeeStatus} from '@/types/employee'
export enum ShiftType {
  Morning = 'Morning',
  Evening = 'Evening',
  Night = 'Night',
  Rotating = 'Rotating',
  Custom = 'Custom'
}

export enum EmployeeStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export enum EmploymentType {
  Permanent = 'Permanent',
  Temporary = 'Temporary',
  Contract = 'Contract',
  FullTime = 'Full-time',
  PartTime = 'Part-time'
}

// export interface Employee {
//   id: string;
//   employeeCode: string;
//   barcode: string;
//   firstName: string;
//   lastName: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   site: string;
//   siteCode: string;
//   employmentType: EmploymentType;
//   status: EmployeeStatus;
//   shift: ShiftType | string; // Accept both string and ShiftType to fix compatibility
//   role: string;
//   department: string;
//   position: string;
//   photo: string;
//   payment: {
//     currency: string;
//     rateType: string;
//     unitCost: number;
//     locationId: string;
//   };
// }

// Define TaskAssignment type for the AssignModal component
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

// Import employee data (mock)
import { EmployeesData } from '@/data/employees';


// Import necessary components
import EmployeeModal from './EmployeeModal';
import AssignModal from './assignmentModal';

export default function EmployeeManagement() {
  const [employeeCode, setEmployeeCode] = useState('EMP1746906215');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [site, setSite] = useState('Main Factory');
  const [employmentType, setEmploymentType] = useState<EmploymentType>(EmploymentType.FullTime);
  const [isActive, setIsActive] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>(() => EmployeesData as Employee[]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Video stream and camera related states
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [scanningActive, setScanningActive] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanErrorMessage, setScanErrorMessage] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Effect to handle camera permission and setup
  useEffect(() => {
    if (scanningActive && isBarcodeModalOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [scanningActive, isBarcodeModalOpen]);

  // Function to start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasCameraPermission(true);
        setScanErrorMessage('');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      setScanErrorMessage('Unable to access camera. Please check permissions or use manual entry.');
      setScanningActive(false);
    }
  };

  // Function to stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleAddEmployee = () => {
    if (!employeeCode || !firstName || !lastName) return;

    const newEmployee: Employee = {
      id: Date.now().toString(),
      employeeCode,
      barcode: `BC${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: '000-000-0000',
      address: 'TBD',
      site,
      siteCode: site === 'Main Factory' ? 'MAIN' : site === 'Branch Office' ? 'BRANCH' : 'WH',
      employmentType,
      status: isActive ? EmployeeStatus.Active : EmployeeStatus.Inactive,
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
    setEmploymentType(EmploymentType.FullTime);
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

  const handleAssignmentComplete = (assignments: TaskAssignment) => {
    if (currentEmployee) {
      const updatedEmployee: Employee = {
        ...currentEmployee,
        department: assignments.taskName ? assignments.taskName : currentEmployee.department,
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

  const handleStartScanning = () => {
    setScanningActive(true);
  };

  const handleManualBarcodeSubmit = () => {
    if (!manualBarcode) return;
    
    // Find employee by barcode
    const foundEmployee = employees.find(emp => emp.barcode === manualBarcode);
    
    if (foundEmployee) {
      // Open edit modal with the found employee
      setCurrentEmployee(foundEmployee);
      setIsEditModalOpen(true);
    } else {
      setScanErrorMessage('No employee found with this barcode.');
      return;
    }
    
    // Close the barcode modal
    setIsBarcodeModalOpen(false);
    setManualBarcode('');
    setScanErrorMessage('');
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchQuery
      ? `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && employee.status === EmployeeStatus.Active) ||
      (statusFilter === 'inactive' && employee.status === EmployeeStatus.Inactive);

    const matchesDepartment = departmentFilter === 'all' ||
      employee.department?.toLowerCase() === departmentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-4 relative">
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-3xl">
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
            <p className="text-sm text-gray-500">Manage your workforce and employee assignments</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100"
          onClick={() => setIsBarcodeModalOpen(true)}
        >
          <QrCode className="h-4 w-4" /> Quick Entry
        </Button>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-600" /> Add New Employee
          </h2>
        </div>
      
        {/* Employee Form */}
        <div className="bg-white rounded-md shadow-sm mb-8">
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
                onValueChange={(value: EmploymentType) => setEmploymentType(value)}
              >
                <SelectTrigger className="w-full border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-9 relative">
                  <FileSpreadsheet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-500" />
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value={EmploymentType.Permanent}>Permanent</SelectItem>
                  <SelectItem value={EmploymentType.Temporary}>Temporary</SelectItem>
                  <SelectItem value={EmploymentType.Contract}>Contract</SelectItem>
                  <SelectItem value={EmploymentType.FullTime}>Full-time</SelectItem>
                  <SelectItem value={EmploymentType.PartTime}>Part-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 m-2">
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
              
              <div className="flex ml-4 space-x-2">
                <Button 
                  variant="outline" 
                  className="px-6 flex items-center gap-2 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  onClick={() => {
                    setEmployeeCode(`EMP${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`);
                    setFirstName('');
                    setLastName('');
                    setIsActive(true);
                    setSite('Main Factory');
                    setEmploymentType(EmploymentType.FullTime);
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
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Employee Code</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Employment Type</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(employee => (
                  <tr key={employee.id} className="border-t border-gray-100">
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {employee.employeeCode}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{employee.employmentType}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                        employee.status === EmployeeStatus.Active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <span className={`h-2 w-2 rounded-full mr-1 ${
                          employee.status === EmployeeStatus.Active ? 'bg-green-500' : 'bg-gray-500'
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
                          <DropdownMenuSeparator />
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
      </div>

      {/* Barcode Scanner Modal */}
      <Dialog open={isBarcodeModalOpen} onOpenChange={(open) => {
        setIsBarcodeModalOpen(open);
        if (!open) {
          setScanningActive(false);
          setScanErrorMessage('');
          setManualBarcode('');
        }
      }}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Scan Employee Barcode</DialogTitle>
            <DialogDescription>
             {"Scan the employee's barcode to quickly access their information."}
            </DialogDescription>
          </DialogHeader>
          
          {scanningActive ? (
            <div className="p-4 border rounded-lg bg-gray-50">
              {hasCameraPermission === false && (
                <div className="text-center p-4 border border-red-100 rounded bg-red-50 text-red-600 mb-4">
                  {scanErrorMessage}
                </div>
              )}
              
              <div className="relative w-full h-64 bg-black rounded-lg mb-4 flex items-center justify-center">
                {hasCameraPermission === true ? (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="absolute inset-0 w-full h-full object-cover rounded-lg" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3/4 h-1/2 border-2 border-red-500 rounded-lg z-10"></div>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                  </>
                ) : (
                  <X className="text-gray-500 h-20 w-20 opacity-20" />
                )}
              </div>
              <Button onClick={() => setScanningActive(false)} className="w-full">
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <Button onClick={handleStartScanning} className="w-full flex items-center justify-center gap-2 bg-blue-600">
                  <Camera className="h-4 w-4" /> Start Scanning
                </Button>
                
                <div className="relative text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">OR</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Input 
                    placeholder="Enter barcode ID manually" 
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    className="w-full"
                  />
                  {scanErrorMessage && (
                    <div className="text-center p-2 text-sm text-red-600">
                      {scanErrorMessage}
                    </div>
                  )}
                  <Button onClick={handleManualBarcodeSubmit} className="w-full">
                    Submit Manual Entry
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Employee Edit Modal */}
      {currentEmployee && (
        <EmployeeModal
          isOpen={isEditModalOpen}
          employee={currentEmployee}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentEmployee(null);
          }}
          onSubmit={handleUpdateEmployee}
        />
      )}

      {/* Employee Assignment Modal */}
      {currentEmployee && (
        <AssignModal
          isOpen={isAssignModalOpen}
          employee={currentEmployee}
          onClose={() => {
            setIsAssignModalOpen(false);
            setCurrentEmployee(null);
          }}
          onAssign={(employeeId: string) => {
            // If you need to handle the onAssign callback
            console.log('Task assigned to employee', employeeId);
          }}
          onSubmit={handleAssignmentComplete}
        />
      )}
    </div>
  );
}