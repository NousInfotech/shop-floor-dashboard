'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WorkOrder } from '@/types/work-order'
import { StatusBadge } from '@/components/shared/status-badge'
import { Settings, X } from 'lucide-react'

interface EmployeeAssignmentTabProps {
  workOrder: WorkOrder
}

export default function EmployeeAssignmentTab({ workOrder }: EmployeeAssignmentTabProps) {
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    name: '',
    employmentType: 'Permanent',
  })
  const [createTeam, setCreateTeam] = useState(false)

  const handleAddEmployee = () => {
    // Add employee logic would go here
    // Reset form after adding
    setNewEmployee({
      id: '',
      name: '',
      employmentType: 'Permanent',
    })
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-6">Add New Employee</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
        <div className="sm:col-span-1">
          <Input 
            type="text" 
            value={newEmployee.id}
            onChange={(e) => setNewEmployee({...newEmployee, id: e.target.value})}
            placeholder="Scan/Enter employee ID" 
          />
        </div>
        <div className="sm:col-span-2">
          <Input 
            type="text" 
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
            placeholder="Enter employee name" 
          />
        </div>
        <div className="sm:col-span-1">
          <Select 
            value={newEmployee.employmentType}
            onValueChange={(value) => setNewEmployee({...newEmployee, employmentType: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Permanent">Permanent</SelectItem>
              <SelectItem value="Temporary">Temporary</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-1">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleAddEmployee}
          >
            Add
          </Button>
        </div>
      </div>
      
      <div className="flex items-center mb-6">
        <Checkbox 
          id="createTeam" 
          checked={createTeam}
          onCheckedChange={(checked) => setCreateTeam(checked === true)}
          className="mr-2" 
        />
        <label htmlFor="createTeam">Create team</label>
        <span className="ml-4 text-sm text-gray-500">
          (Create automatically when click on start production button)
        </span>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-500 mb-4">
          No operation selected - employee will be assigned to general work order
        </p>
      </div>
      
      <h3 className="text-lg font-medium mb-4">Assigned Employees</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID/Barcode</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Assigned Operation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrder.employees.length > 0 ? (
              workOrder.employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.barcode}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>Not assigned</TableCell>
                  <TableCell>
                    <StatusBadge status={emp.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800">
                        <Settings size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800">
                        <X size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  No employees assigned yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-6">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2"></span>
          <span className="text-sm">Green indicates → Employee already existing</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2"></span>
          <span className="text-sm">Red indicates → Employee is not existing</span>
        </div>
      </div>
    </div>
  )
}