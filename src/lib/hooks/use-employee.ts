import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { 
  addEmployee, 
  updateEmployee, 
  deleteEmployee,
  setStatusFilter,
  setDepartmentFilter,
  setSearchQuery
} from '@/redux/features/employees/employeesSlice';
import { Employee } from '@/types/employee';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useEmployee = () => {
  const dispatch = useDispatch<AppDispatch>();
  const employees = useSelector((state: RootState) => state.employees.employees);
  const filters = useSelector((state: RootState) => state.employees.filters);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee| null>(null);

  const filteredEmployees = employees.filter(employee => {
    const matchesStatus = filters.status === 'All' || employee.status === filters.status;
    const matchesDepartment = filters.department === 'All' || employee.department === filters.department;
   const matchesSearch = !filters.searchQuery || 
  employee.firstName?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
  employee.lastName?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
  employee.employeeCode?.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesStatus && matchesDepartment && matchesSearch;
  });

  const handleAddEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = {
      ...employee,
      id: uuidv4(),
    };
    dispatch(addEmployee(newEmployee as Employee));
    setIsAddModalOpen(false);
  };

  const handleUpdateEmployee = (employee: Employee) => {
    dispatch(updateEmployee(employee));
    setIsEditModalOpen(false);
    setCurrentEmployee(null);
  };

  const handleDeleteEmployee = (id: string) => {
    dispatch(deleteEmployee(id));
  };

  const handleEditEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleFilterChange = {
    status: (value: string) => dispatch(setStatusFilter(value)),
    department: (value: string) => dispatch(setDepartmentFilter(value)),
    search: (value: string) => dispatch(setSearchQuery(value)),
  };

  return {
    employees: filteredEmployees,
    filters,
    isAddModalOpen,
    isEditModalOpen,
    currentEmployee,
    setIsAddModalOpen,
    setIsEditModalOpen,
    setCurrentEmployee,
    handleAddEmployee,
    handleUpdateEmployee,
    handleDeleteEmployee,
    handleEditEmployee,
    handleFilterChange,
  };
};