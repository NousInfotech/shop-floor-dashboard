'use client';

// import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
// import { Button } from '@/components/ui/button';
// import { PlusIcon } from 'lucide-react';
// import EmployeeList from '@/components/employees/employee-list';
// import EmployeeFilters from '@/components/employees/employee-filters';
// import AddEmployeeForm from '@/components/employees/add-employee-form';
// import EditEmployeeForm from '@/components/employees/edit-employee-form';
// import { Dialog, DialogContent } from '@/components/ui/dialog';
// import { useEmployee } from '@/lib/hooks/use-employee';
import EmployeeManagement from '@/components/employees/basic-employee-info';

export default function EmployeesPage() {
  return (
    <Provider store={store}>
      <EmployeesContent />
    </Provider>
  );
}

function EmployeesContent() {
  // const {
  //   employees,
  //   isAddModalOpen,
  //   isEditModalOpen,
  //   currentEmployee,
  //   setIsAddModalOpen,
  //   handleAddEmployee,
  //   handleUpdateEmployee,
  // } = useEmployee();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-6">
       
        <EmployeeManagement/>
        {/* <EmployeeFilters /> */}
        
        {/* <EmployeeList employees={employees} />
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-3xl">
            <AddEmployeeForm onSubmit={handleAddEmployee} />
          </DialogContent>
        </Dialog>
         */}
    
      </div>
    </div>
  );
}