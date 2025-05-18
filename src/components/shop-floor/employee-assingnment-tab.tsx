import { useState } from "react"
import { Employee, EmploymentType } from "@/types/employee"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Barcode, ChevronDown, MoveIcon, X, Users } from "lucide-react"

// Operation type
type Operation = {
  id: string
  name: string
}

// Team type
type Team = {
  id: string
  name: string
  operationId: string
  members: string[] // Employee IDs
}

interface Props {
  workOrder: {
    employees?: Employee[]
  }
}

// List of available operations
const operations: Operation[] = [
  { id: "10", name: "10: Cutting" },
  { id: "20", name: "20: Drilling" },
  { id: "30", name: "30: Assembly" },
  { id: "40", name: "40: Quality Check" }
]

const StatusBadge = ({ status }: { status: Employee["status"] }) => {
  const getColor = () => {
    switch (status) {
      case "Active": return "text-green-600"
      case "Inactive": return "text-red-600"
      case "Break": return "text-yellow-600"
      default: return ""
    }
  }
  return <span className={`font-medium ${getColor()}`}>{status}</span>
}

const EmployeeAssignmentTab = ({ workOrder }: Props) => {
  const [createTeam, setCreateTeam] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [teams, setTeams] = useState<Team[]>([])
  const [employees, setEmployees] = useState<Employee[]>(workOrder.employees || [])
  const [, setMoveOperationId] = useState<string | undefined>(undefined)

  const [newEmployee, setNewEmployee] = useState<{
    id: string
    name: string
    employmentType: EmploymentType
    operation: string | undefined
  }>({
    id: "",
    name: "",
    employmentType: "Permanent",
    operation: undefined
  })

  const handleAddEmployee = () => {
    if (!newEmployee.id || !newEmployee.name) return

    const newEmp: Employee = {
      id: newEmployee.id,
      barcode: newEmployee.id,
      name: newEmployee.name,
      employmentType: newEmployee.employmentType,
      status: "Active",
      assignedOperation: newEmployee.operation
        ? operations.find(op => op.id === newEmployee.operation)?.name
        : undefined
    }

    setEmployees(prev => [...prev, newEmp])

    // If create team is checked and team name is provided
    if (createTeam && teamName && newEmployee.operation) {
      // Check if team already exists
      const existingTeam = teams.find(t => t.name === teamName)
      
      if (existingTeam) {
        // Add employee to existing team
        setTeams(prev => prev.map(team => 
          team.id === existingTeam.id 
            ? { ...team, members: [...team.members, newEmp.id] }
            : team
        ))
      } else {
        // Create new team
        const newTeam: Team = {
          id: Date.now().toString(),
          name: teamName,
          operationId: newEmployee.operation,
          members: [newEmp.id]
        }
        setTeams(prev => [...prev, newTeam])
      }
    }

    // Reset
    setNewEmployee({
      id: "",
      name: "",
      employmentType: "Permanent",
      operation: undefined
    })
  }

  const handleRemoveEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id))
    
    // Remove employee from any teams they are in
    setTeams(prev => 
      prev.map(team => ({
        ...team,
        members: team.members.filter(memberId => memberId !== id)
      }))
    )
    
    // Remove any empty teams
    setTeams(prev => prev.filter(team => team.members.length > 0))
  }

  const handleMoveEmployee = (employeeId: string, operationId: string) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === employeeId
          ? {
              ...emp,
              assignedOperation: operations.find(op => op.id === operationId)?.name
            }
          : emp
      )
    )
    setMoveOperationId(undefined)
  }

  const getEmploymentTypeOptions = () => {
    return (
      <div className="p-1 bg-white shadow-lg rounded-md border w-48">
        {["Permanent", "Contract"].map((type) => (
          <div
            key={type}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() =>
              setNewEmployee({ ...newEmployee, employmentType: type as EmploymentType })
            }
          >
            {newEmployee.employmentType === type && (
              <span className="text-green-600">✓</span>
            )}
            {type}
          </div>
        ))}
      </div>
    )
  }

  const getOperationOptions = () => {
    return (
      <div className="p-1 bg-white shadow-lg rounded-md border w-48">
        {operations.map(op => (
          <div
            key={op.id}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => setNewEmployee({ ...newEmployee, operation: op.id })}
          >
            {op.name}
          </div>
        ))}
      </div>
    )
  }

  const getMoveOperationOptions = (employeeId: string) => {
    return (
      <div className="p-1 bg-white shadow-lg rounded-md border w-48">
        {operations.map(op => (
          <div
            key={op.id}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleMoveEmployee(employeeId, op.id)}
          >
            {op.name}
          </div>
        ))}
      </div>
    )
  }

  // Function to get all team members for a given operation
  // const getTeamMembersForOperation = (operationId: string) => {
  //   const teamsForOperation = teams.filter(team => team.operationId === operationId);
  //   const memberIds = teamsForOperation.flatMap(team => team.members);
  //   return employees.filter(emp => memberIds.includes(emp.id));
  // }

  // Function to get team name for an employee
  const getTeamForEmployee = (employeeId: string) => {
    const team = teams.find(team => team.members.includes(employeeId));
    return team ? team.name : null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 p-6 pb-2 text-slate-800">Add New Employee</h2>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* ID Input */}
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-slate-50">
              <Barcode className="text-blue-600" />
              <Input
                placeholder="Scan/Enter employee barcode"
                value={newEmployee.id}
                onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-8 bg-transparent"
              />
            </div>

            {/* Name Input */}
            <Input
              placeholder="Enter employee name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="border-slate-300 focus-visible:ring-blue-500"
            />

            {/* Employment Type Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between border-slate-300 bg-white hover:bg-slate-50">
                  {newEmployee.employmentType}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-48 shadow-lg">
                {getEmploymentTypeOptions()}
              </PopoverContent>
            </Popover>

            {/* Operation Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between border-slate-300 bg-white hover:bg-slate-50">
                  {newEmployee.operation
                    ? operations.find(op => op.id === newEmployee.operation)?.name
                    : "Operation"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-48 shadow-lg">
                {getOperationOptions()}
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white w-28 flex items-center gap-2 shadow-sm"
                onClick={handleAddEmployee}
              >
                Add
              </Button>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="createTeam"
                  checked={createTeam}
                  onCheckedChange={(checked) => setCreateTeam(!!checked)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label htmlFor="createTeam" className="text-slate-700 font-medium">Create team</label>
              </div>
            </div>

            {createTeam && (
              <div className="w-full max-w-md">
                <Input
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="border-slate-300 focus-visible:ring-blue-500"
                />
              </div>
            )}

            {!newEmployee.operation && (
              <p className="text-slate-500 text-sm italic">
                No operation selected – employee will be assigned to general work order
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold p-6 pb-4 flex items-center gap-2 text-slate-800 border-b">
          <Users className="h-5 w-5 text-blue-600" />
          Assigned Employees
        </h2>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-slate-700">ID/Barcode</TableHead>
                <TableHead className="text-slate-700">Name</TableHead>
                <TableHead className="text-slate-700">Type</TableHead>
                <TableHead className="text-slate-700">Assigned Operation</TableHead>
                <TableHead className="text-slate-700">Team</TableHead>
                <TableHead className="text-slate-700">Status</TableHead>
                <TableHead className="text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No employees assigned yet
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => {
                  const teamName = getTeamForEmployee(employee.id);
                  
                  return (
                    <TableRow key={employee.id} className="hover:bg-slate-50">
                      <TableCell className="font-mono text-sm text-slate-600">{employee.barcode}</TableCell>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.employmentType}</TableCell>
                      <TableCell>
                        {employee.assignedOperation ? (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                            {employee.assignedOperation}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-sm">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {teamName ? (
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-sm flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {teamName}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={employee.status} />
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        {/* Move operation */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                              <MoveIcon className="w-4 h-4 text-blue-600" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-48 shadow-lg">
                            {getMoveOperationOptions(employee.id)}
                          </PopoverContent>
                        </Popover>

                        {/* Remove employee */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmployee(employee.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {teams.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold p-6 pb-4 flex items-center gap-2 text-slate-800 border-b">
            <Users className="h-5 w-5 text-green-600" />
            Teams
          </h2>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(team => {
              const operation = operations.find(op => op.id === team.operationId);
              const teamMembers = employees.filter(emp => team.members.includes(emp.id));
              
              return (
                <div key={team.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-lg text-slate-800">{team.name}</h3>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                      {operation?.name || "Unknown Operation"}
                    </span>
                  </div>
                  
                  <div className="text-sm text-slate-600 mb-2">
                    <span className="font-medium">{team.members.length}</span> team member{team.members.length !== 1 ? 's' : ''}
                  </div>
                  
                  <div className="mt-3 space-y-1">
                    {teamMembers.map(member => (
                      <div key={member.id} className="text-sm flex justify-between">
                        <span>{member.name}</span>
                        <StatusBadge status={member.status} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeAssignmentTab