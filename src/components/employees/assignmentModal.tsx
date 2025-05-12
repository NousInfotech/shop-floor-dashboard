'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
// import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/types/employee';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

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

// Mock data for tasks and workstations
const mockTasks = [
  { id: 'task1', name: 'Assembly Line 1', type: 'Production' },
  { id: 'task2', name: 'Quality Control', type: 'QA' },
  { id: 'task3', name: 'Packaging', type: 'Logistics' },
  { id: 'task4', name: 'Machine Operation', type: 'Production' },
  { id: 'task5', name: 'Maintenance', type: 'Technical' },
];

const mockWorkstations = [
  { id: 'ws1', name: 'Station A1', area: 'Assembly' },
  { id: 'ws2', name: 'Station A2', area: 'Assembly' },
  { id: 'ws3', name: 'QC Bench 1', area: 'Quality Control' },
  { id: 'ws4', name: 'Packing Line', area: 'Shipping' },
  { id: 'ws5', name: 'CNC Machine 1', area: 'Machining' },
];

const mockShifts = [
  { id: 'shift1', name: 'Morning (6:00 AM - 2:00 PM)' },
  { id: 'shift2', name: 'Afternoon (2:00 PM - 10:00 PM)' },
  { id: 'shift3', name: 'Night (10:00 PM - 6:00 AM)' },
  { id: 'shift4', name: 'Full Day (8:00 AM - 5:00 PM)' },
];

interface AssignModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onAssign: (employeeId: string, assignments: TaskAssignment) => void; 
  onSubmit: (assignments: TaskAssignment) => void; 
}

export default function AssignModal({ isOpen, employee, onClose, onAssign, onSubmit }: AssignModalProps) {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [selectedWorkstation, setSelectedWorkstation] = useState<string>('');
  const [selectedShift, setSelectedShift] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [priority, setPriority] = useState<string>('medium');
  const [notes, setNotes] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState<'start' | 'end' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Reset form when employee changes
  useEffect(() => {
    if (employee) {
      setSelectedTask('');
      setSelectedWorkstation('');
      setSelectedShift('');
      setStartDate(new Date());
      setEndDate(null);
      setIsRecurring(false);
      setPriority('medium');
      setNotes('');
    }
  }, [employee]);

  const handleSubmit = () => {
    if (!employee || !selectedTask || !selectedWorkstation || !selectedShift) return;
    
    setIsSubmitting(true);
    
    // Prepare assignment data
    const assignmentData: TaskAssignment = {
      employeeId: employee.id,  // Add employeeId here
      taskId: selectedTask,
      taskName: mockTasks.find(t => t.id === selectedTask)?.name || '',
      workstationId: selectedWorkstation,
      workstationName: mockWorkstations.find(w => w.id === selectedWorkstation)?.name || '',
      shiftId: selectedShift,
      shiftName: mockShifts.find(s => s.id === selectedShift)?.name || '',
      startDate: startDate,
      endDate: endDate,
      isRecurring,
      priority,
      notes,
      status: 'Assigned',
      assignedAt: new Date(),
    };

    // Simulate API call with a small delay
    setTimeout(() => {
      onAssign(employee.id, assignmentData);
      setIsSubmitting(false);
      onSubmit?.(assignmentData);
    }, 500);
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Tasks to {employee.firstName} {employee.lastName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-1">Task</span>
            <div className="col-span-3">
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {mockTasks.map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.name} ({task.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-1">Workstation</span>
            <div className="col-span-3">
              <Select value={selectedWorkstation} onValueChange={setSelectedWorkstation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select workstation" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {mockWorkstations.map(workstation => (
                    <SelectItem key={workstation.id} value={workstation.id}>
                      {workstation.name} ({workstation.area})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-1">Shift</span>
            <div className="col-span-3">
              <Select value={selectedShift} onValueChange={setSelectedShift}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {mockShifts.map(shift => (
                    <SelectItem key={shift.id} value={shift.id}>
                      {shift.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-1">Start Date</span>
            <div className="col-span-3 relative">
              <button
                type="button"
                onClick={() => setShowCalendar(showCalendar === 'start' ? null : 'start')}
                className="w-full flex items-center justify-between border border-input rounded-md h-10 px-3 py-2 text-sm text-left text-gray-700"
              >
                <span>{format(startDate, 'PPP')}</span>
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </button>
              {showCalendar === 'start' && (
                <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                        setShowCalendar(null);
                      }
                    }}
                    initialFocus
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-1">End Date</span>
            <div className="col-span-3 relative">
              <button
                type="button"
                onClick={() => setShowCalendar(showCalendar === 'end' ? null : 'end')}
                className="w-full flex items-center justify-between border border-input rounded-md h-10 px-3 py-2 text-sm text-left text-gray-700"
              >
                <span>{endDate ? format(endDate, 'PPP') : 'N/A'}</span>
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </button>
              {showCalendar === 'end' && (
                <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg">
                 <Calendar
  mode="single"
  selected={endDate || undefined}  // Pass `undefined` if `endDate` is null
  onSelect={(date) => {
    if (date) {
      setEndDate(date);
      setShowCalendar(null);
    }
  }}
  initialFocus
/>

                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-1">Priority</span>
            <div className="col-span-3">
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium col-span-1">Notes</span>
            <div className="col-span-3">
              <Input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Assign Task'}
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
