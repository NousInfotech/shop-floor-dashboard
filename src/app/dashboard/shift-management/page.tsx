"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Building, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkOrder } from "@/types/work-order";
import { Employee } from "@/types/employee";
import { workOrdersData } from "@/data/work-orders";
import { employees } from "@/data/employees";
import { Shift } from "@/types";
import { Assignment } from "@/types";





// Helper functions to calculate shift duration
const calculateDuration = (startTime: string, endTime: string, breakDuration: number): string => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  
  let hours = endHour - startHour;
  let minutes = endMinute - startMinute;
  
  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }
  
  // Handle overnight shifts
  if (hours < 0) {
    hours += 24;
  }
  
  // Subtract break time
  const totalMinutes = hours * 60 + minutes - breakDuration;
  const durationHours = Math.floor(totalMinutes / 60);
  const durationMinutes = totalMinutes % 60;
  
  return `${durationHours}h ${durationMinutes}m`;
};

// Format time for display (e.g., "6:00 AM")
const formatTimeDisplay = (time: string, period: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// Format time range for display (e.g., "6:00 AM - 2:00 PM")
const formatTimeRange = (startTime: string, startPeriod: string, endTime: string, endPeriod: string): string => {
  return `${formatTimeDisplay(startTime, startPeriod)} - ${formatTimeDisplay(endTime, endPeriod)}`;
};


const mockLocations = ["Main Factory", "Warehouse", "Assembly Line", "Office"];

const mockShifts: Shift[] = [
  {
    id: "1",
    name: "Morning Shift",
    startTime: "6:00",
    endTime: "14:00",
    breakDuration: 30,
    location: "Main Factory",
    active: true,
    duration: "7h 30m",
  },
  {
    id: "2",
    name: "Afternoon Shift",
    startTime: "14:00",
    endTime: "22:00",
    breakDuration: 30,
    location: "Main Factory",
    active: true,
    duration: "7h 30m",
  },
  {
    id: "3",
    name: "Night Shift",
    startTime: "22:00",
    endTime: "6:00", 
    breakDuration: 45,
    location: "Main Factory",
    active: true,
    duration: "7h 15m",
  },
  {
    id: "4",
    name: "Day Shift",
    startTime: "9:00",
    endTime: "17:00",
    breakDuration: 60,
    location: "Office",
    active: true,
    duration: "7h 00m",
  },
];

// Main Component
export default function ShiftManagement() {
  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [addShiftOpen, setAddShiftOpen] = useState(false);
  const [addAssignmentOpen, setAddAssignmentOpen] = useState(false);
  const [editShiftId, setEditShiftId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("shift-assignments");
  
  // New shift form state
  const [newShift, setNewShift] = useState<Partial<Shift>>({
    name: "",
    startTime: "08:00",
    endTime: "16:00",
    breakDuration: 30,
    location: "Main Factory",
    active: true,
  });
  
  // New assignment form state
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    date: selectedDate,
    shiftId: "",
    employeeId: "",
    workOrderId: null,
  });

  // Get shift by ID
  const getShiftById = (id: string): Shift | undefined => {
    return shifts.find(shift => shift.id === id);
  };

  // Get employee by ID
  const getEmployeeById = (id: string): Employee | undefined => {
    return employees.find(employee => employee.id === id);
  };

  // Get work order by ID
  const getWorkOrderById = (id: string): WorkOrder | undefined => {
    return workOrdersData.find(workOrder => workOrder.id === id);
  };

  // Add new shift
  const handleAddShift = () => {
    if (!newShift.name || !newShift.startTime || !newShift.endTime) return;
    
    const id = (shifts.length + 1).toString();
    const duration = calculateDuration(
      newShift.startTime!,
      newShift.endTime!,
      newShift.breakDuration || 0
    );
    
    const shift: Shift = {
      id,
      name: newShift.name,
      startTime: newShift.startTime,
      endTime: newShift.endTime,
      breakDuration: newShift.breakDuration || 0,
      location: newShift.location || "Main Factory",
      active: newShift.active || false,
      duration,
    };
    
    setShifts([...shifts, shift]);
    setAddShiftOpen(false);
    setNewShift({
      name: "",
      startTime: "08:00",
      endTime: "16:00",
      breakDuration: 30,
      location: "Main Factory",
      active: true,
    });
  };

  // Edit shift
  const handleEditShift = (id: string) => {
    const shift = getShiftById(id);
    if (!shift) return;
    
    setNewShift({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakDuration: shift.breakDuration,
      location: shift.location,
      active: shift.active,
    });
    
    setEditShiftId(id);
    setAddShiftOpen(true);
  };

  // Update shift
  const handleUpdateShift = () => {
    if (!newShift.name || !newShift.startTime || !newShift.endTime || !editShiftId) return;
    
    const duration = calculateDuration(
      newShift.startTime!,
      newShift.endTime!,
      newShift.breakDuration || 0
    );
    
    const updatedShifts = shifts.map(shift => {
      if (shift.id === editShiftId) {
        return {
          ...shift,
          name: newShift.name!,
          startTime: newShift.startTime!,
          endTime: newShift.endTime!,
          breakDuration: newShift.breakDuration || 0,
          location: newShift.location || "Main Factory",
          active: newShift.active || false,
          duration,
        };
      }
      return shift;
    });
    
    setShifts(updatedShifts);
    setAddShiftOpen(false);
    setEditShiftId(null);
    setNewShift({
      name: "",
      startTime: "08:00",
      endTime: "16:00",
      breakDuration: 30,
      location: "Main Factory",
      active: true,
    });
  };

  // Remove shift
  const handleRemoveShift = (id: string) => {
    const updatedShifts = shifts.filter(shift => shift.id !== id);
    setShifts(updatedShifts);
  };

  // Add new assignment
  const handleAddAssignment = () => {
    if (!newAssignment.shiftId || !newAssignment.employeeId) return;
    
    const id = (assignments.length + 1).toString();
    const assignment: Assignment = {
      id,
      date: newAssignment.date || new Date(),
      shiftId: newAssignment.shiftId,
      employeeId: newAssignment.employeeId,
      workOrderId: newAssignment.workOrderId || null,
    };
    
    setAssignments([...assignments, assignment]);
    setAddAssignmentOpen(false);
    setNewAssignment({
      date: selectedDate,
      shiftId: "",
      employeeId: "",
      workOrderId: null,
    });
  };

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setNewAssignment(prev => ({ ...prev, date }));
    }
  };

  // Filter assignments by date
  const getAssignmentsForDate = (): Assignment[] => {
    return assignments.filter(
      assignment => 
        assignment.date.toDateString() === selectedDate.toDateString()
    );
  };

  // Get formatted date string
  const getFormattedDate = (date: Date): string => {
    return format(date, "MM/dd/yyyy");
  };

  // Format time for display with AM/PM
  const formatTime = (time: string): { time: string, period: string } => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return { 
      time: `${formattedHours}:${minutes.toString().padStart(2, "0")}`,
      period
    };
  };

  return (
  <div className="container mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b pb-4">
          <Clock className="h-7 w-7 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800">Shift Management</h1>
        </div>
        <p className="text-gray-600 italic">Manage shift schedules and employee assignments</p>
        
        <Tabs defaultValue="shift-assignments" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-200 rounded-lg">
            <TabsTrigger value="shift-assignments" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-md transition-all">Shift Assignments</TabsTrigger>
            <TabsTrigger value="shift-definitions" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-md transition-all">Shift Definitions</TabsTrigger>
          </TabsList>
          
          {/* Shift Assignments Tab */}
          <TabsContent value="shift-assignments" className="mt-6">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-700">View Date:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex gap-2 items-center border-slate-300 hover:bg-slate-100 hover:text-blue-700 transition-colors"
                    >
                      {getFormattedDate(selectedDate)}
                      <CalendarIcon className="h-4 w-4 text-blue-600" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-slate-200 shadow-lg">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      className="rounded-md bg-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Button onClick={() => setAddAssignmentOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <Plus className="h-4 w-4 mr-2" /> Add Assignment
              </Button>
            </div>
            
            {getAssignmentsForDate().length > 0 ? (
              <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {getAssignmentsForDate().map(assignment => {
                  const shift = getShiftById(assignment.shiftId);
                  const employee = getEmployeeById(assignment.employeeId);
                  const workOrder = assignment.workOrderId ? getWorkOrderById(assignment.workOrderId) : null;
                  
                  return (
                    <div key={assignment.id} className="border border-slate-200 rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800 text-lg">{shift?.name}</h3>
                          <p className="text-sm text-slate-600">
                            {employee?.name} - {employee?.position}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 font-medium px-3">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-3 bg-slate-50 p-2 rounded-md">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>
                          {shift && formatTimeRange(
                            formatTime(shift.startTime).time,
                            formatTime(shift.startTime).period,
                            formatTime(shift.endTime).time,
                            formatTime(shift.endTime).period
                          )}
                        </span>
                      </div>
                      
                      {workOrder && (
                        <div className="mt-3 text-sm bg-blue-50 p-2 rounded-md">
                          <span className="font-medium text-blue-700 ">Work Order:</span> {workOrder.name}
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2 mt-5">
                        <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-100 hover:text-blue-700 transition-colors">Edit</Button>
                        <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white shadow-sm">Remove</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-white rounded-lg border border-dashed border-slate-300">
                <div className="bg-slate-100 p-6 rounded-full mb-5">
                  <Clock className="h-14 w-14 text-slate-400" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-slate-700">No Assignments Found</h3>
                <p className="text-slate-500">No shift assignments scheduled for {format(selectedDate, "MMMM d, yyyy")}</p>
              </div>
            )}
          </TabsContent>
          
          {/* Shift Definitions Tab */}
          <TabsContent value="shift-definitions" className="mt-6">
            <div className="flex justify-end mb-6 bg-white p-4 rounded-lg shadow-sm">
              <Button onClick={() => {
                setEditShiftId(null);
                setNewShift({
                  name: "",
                  startTime: "08:00",
                  endTime: "16:00",
                  breakDuration: 30,
                  location: "Main Factory",
                  active: true,
                });
                setAddShiftOpen(true);
              }} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <Plus className="h-4 w-4 mr-2" /> Add Shift
              </Button>
            </div>
            
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {shifts.map((shift) => (
                <div key={shift.id} className="border border-slate-200 rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-slate-800 text-lg">{shift.name}</h3>
                    <Badge variant={shift.active ? "outline" : "secondary"} className={cn(
                      shift.active ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-slate-200 text-slate-600"
                    )}>
                      {shift.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600 mt-3 bg-slate-50 p-2 rounded-md">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>
                      {formatTimeRange(
                        formatTime(shift.startTime).time,
                        formatTime(shift.startTime).period,
                        formatTime(shift.endTime).time,
                        formatTime(shift.endTime).period
                      )}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm bg-slate-50 p-2 rounded-md">
                    <div className="text-slate-600"><span className="font-medium text-slate-700">Break:</span> {shift.breakDuration} minutes</div>
                    <div className="text-right text-slate-600"><span className="font-medium text-slate-700">Duration:</span> {shift.duration}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 text-sm text-slate-600 bg-slate-50 p-2 rounded-md">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span>{shift.location}</span>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-5">
                    <Button variant="outline" size="sm" onClick={() => handleEditShift(shift.id)} className="border-slate-300 hover:bg-slate-100 hover:text-blue-700 transition-colors">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveShift(shift.id)} className="bg-red-600 hover:bg-red-700 text-white shadow-sm">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add/Edit Shift Dialog */}
      <Dialog open={addShiftOpen} onOpenChange={setAddShiftOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border-slate-200 shadow-lg">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-xl text-slate-800">{editShiftId ? "Edit Shift" : "Add New Shift"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-5">
            <div className="space-y-2">
              <label htmlFor="shift-name" className="text-sm font-medium text-slate-700">Shift Name</label>
              <Input
                id="shift-name"
                value={newShift.name}
                onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                placeholder="Morning Shift"
                className="border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start-time" className="text-sm font-medium text-slate-700">Start Time</label>
                <div className="flex">
                  <Input
                    id="start-time"
                    type="time"
                    value={newShift.startTime}
                    onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="end-time" className="text-sm font-medium text-slate-700">End Time</label>
                <div className="flex">
                  <Input
                    id="end-time"
                    type="time"
                    value={newShift.endTime}
                    onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="break-duration" className="text-sm font-medium text-slate-700">Break Duration (minutes)</label>
              <Input
                id="break-duration"
                type="number"
                value={newShift.breakDuration}
                onChange={(e) => setNewShift({ ...newShift, breakDuration: parseInt(e.target.value) })}
                className="border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium text-slate-700">Location</label>
              <Select
                value={newShift.location}
                onValueChange={(value) => setNewShift({ ...newShift, location: value })}
              >
                <SelectTrigger className="border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg">
                  {mockLocations.map((location) => (
                    <SelectItem key={location} value={location} className="hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-md">
              <Switch
                id="shift-active"
                checked={newShift.active}
                onCheckedChange={(checked) => setNewShift({ ...newShift, active: checked })}
                className="data-[state=checked]:bg-emerald-600"
              />
              <label htmlFor="shift-active" className="text-sm font-medium text-slate-700">Shift Active</label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-3 border-t">
            <DialogClose asChild>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-100">Cancel</Button>
            </DialogClose>
            <Button onClick={editShiftId ? handleUpdateShift : handleAddShift} className="bg-blue-600 hover:bg-blue-700 text-white">
              {editShiftId ? "Update Shift" : "Create Shift"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Assignment Dialog */}
      <Dialog open={addAssignmentOpen} onOpenChange={setAddAssignmentOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border-slate-200 shadow-lg">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-xl text-slate-800">Add Shift Assignment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-5">
            <div className="space-y-2">
              <label htmlFor="assignment-date" className="text-sm font-medium text-slate-700">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-slate-300 hover:bg-slate-100"
                  >
                    {getFormattedDate(newAssignment.date || selectedDate)}
                    <CalendarIcon className="ml-auto h-4 w-4 text-blue-600" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-slate-200 shadow-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={newAssignment.date}
                    onSelect={(date) => setNewAssignment({ ...newAssignment, date })}
                    initialFocus
                    className="rounded-md bg-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="shift" className="text-sm font-medium text-slate-700">Shift</label>
              <Select
                value={newAssignment.shiftId}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, shiftId: value })}
              >
                <SelectTrigger className="border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white">
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg">
                  {shifts
                    .filter(shift => shift.active)
                    .map((shift) => (
                      <SelectItem key={shift.id} value={shift.id} className="hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
                        {shift.name} ({formatTimeRange(
                          formatTime(shift.startTime).time,
                          formatTime(shift.startTime).period,
                          formatTime(shift.endTime).time,
                          formatTime(shift.endTime).period
                        )})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="employee" className="text-sm font-medium text-slate-700">Employee</label>
              <Select
                value={newAssignment.employeeId}
                onValueChange={(value) => setNewAssignment({ ...newAssignment, employeeId: value })}
              >
                <SelectTrigger className="border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg">
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id} className="hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="work-order" className="text-sm font-medium text-slate-700">Work Order (Optional)</label>
              <Select
                value={newAssignment.workOrderId || ""}
                onValueChange={(value) => setNewAssignment({ 
                  ...newAssignment, 
                  workOrderId: value === "none" ? null : value 
                })}
              >
                <SelectTrigger className="border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white">
                  <SelectValue placeholder="Select work order" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg">
                  <SelectItem value="none" className="hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">None</SelectItem>
                  {workOrdersData.map((workOrder) => (
                    <SelectItem key={workOrder.id} value={workOrder.id} className="hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">
                      {workOrder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-3 border-t">
            <DialogClose asChild>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-100">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddAssignment} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              Assign Shift
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}