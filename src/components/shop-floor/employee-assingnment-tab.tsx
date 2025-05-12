// src/components/shop-floor/employee-assignment-tab.tsx

import { useState } from "react"
import { Employee } from "@/types/employee"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Settings, X } from "lucide-react"

interface Props {
  workOrder: {
    employees: Employee[]
  }
}

const StatusBadge = ({ status }: { status: Employee["status"] }) => {
  const getColor = () => {
    switch (status) {
      case "Active":
        return "bg-green-200 text-green-800"
      case "Inactive":
        return "bg-gray-200 text-gray-800"
      case "Break":
        return "bg-yellow-200 text-yellow-800"
      default:
        return ""
    }
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}
    >
      {status}
    </span>
  )
}

const EmployeeAssignmentTab = ({ workOrder }: Props) => {
  const [createTeam, setCreateTeam] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>(workOrder.employees || [])

  const [newEmployee, setNewEmployee] = useState<{
    id: string
    name: string
    employmentType: "Permanent" | "Temporary" | "Contract"
  }>({
    id: "",
    name: "",
    employmentType: "Permanent",
  })

  const handleAddEmployee = () => {
    const newEmp: Employee = {
      id: newEmployee.id,
      barcode: newEmployee.id,
      name: newEmployee.name,
      employmentType: newEmployee.employmentType,
      status: "Active",
    }

    setEmployees((prev) => [...prev, newEmp])

    // Clear input fields
    setNewEmployee({
      id: "",
      name: "",
      employmentType: "Permanent",
    })
  }

  const handleRemoveEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id))
  }

  const handleStartProduction = () => {
    if (createTeam && employees.length > 0) {
      const team = {
        teamName: "Team A",
        members: employees,
      }

      console.log("Team created:", team)
      // Send this team to backend if needed
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Assign Employees</h2>
        <div className="flex items-center gap-2">
          <span>Create Team</span>
          <Switch checked={createTeam} onCheckedChange={setCreateTeam} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <Input
          placeholder="Employee ID"
          value={newEmployee.id}
          onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
        />
        <Input
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
        />
       <select
  className="border px-2 py-1 rounded-md"
  value={newEmployee.employmentType}
  onChange={(e) => {
    const selectedType = e.target.value;
    if (["Permanent", "Temporary", "Contract"].includes(selectedType)) {
      setNewEmployee({
        ...newEmployee,
        employmentType: selectedType as "Permanent" | "Temporary" | "Contract", // Restrict values to this subset
      });
    }
  }}
>
          <option value="Permanent">Permanent</option>
          <option value="Temporary">Temporary</option>
          <option value="Contract">Contract</option>
        </select>
        <Button onClick={handleAddEmployee}>Add Employee</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Barcode</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Assigned Operation</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.barcode}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.assignedOperation || "Not Assigned"}</TableCell>
                <TableCell>
                  <StatusBadge status={employee.status} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Settings size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveEmployee(employee.id)}
                    >
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

      <div className="mt-6">
        <Button onClick={handleStartProduction}>Start Production</Button>
      </div>
    </div>
  )
}

export default EmployeeAssignmentTab
