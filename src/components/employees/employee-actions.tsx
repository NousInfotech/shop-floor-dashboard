'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Employee } from '@/types/employee';
import { Trash2Icon } from 'lucide-react';

interface EmployeeActionsProps {
  employee: Employee;
  onDelete: (id: string) => void;
  onEdit: (employee: Employee) => void;
}

export default function EmployeeActions({ employee, onDelete, onEdit }: EmployeeActionsProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(employee)}
        >
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => setConfirmDelete(true)}
        >
          Delete
        </Button>
      </div>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {employee.firstName} {employee.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete(employee.id);
                setConfirmDelete(false);
              }}
              className="flex items-center"
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
