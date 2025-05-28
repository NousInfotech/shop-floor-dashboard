'use client';

import React from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Employee } from '@/types/employee';
import EditEmployeeForm from './edit-employee-form';

interface EmployeeModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSubmit: (employee: Employee) => void;
}

export default function EmployeeModal({ isOpen, employee, onClose, onSubmit }: EmployeeModalProps) {
  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      <DialogContent className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-white rounded-lg shadow-xl p-6 focus:outline-none">
        <DialogTitle className="text-lg font-semibold mb-4">
          Edit Employee
        </DialogTitle>

        <EditEmployeeForm 
          employee={employee} 
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
