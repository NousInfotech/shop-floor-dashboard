import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createWorkOrder } from '@/redux/features/workOrders/workOrdersSlice';
import { WorkOrder } from '@/types/work-order';
import { Employee } from '@/types/employee';

interface NewWorkOrderModalProps {
  onClose: () => void;
}

export default function NewWorkOrderModal({ onClose }: NewWorkOrderModalProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Omit<WorkOrder, 'id'>>({
    startDate: '',
    endDate: '',
    site: '',
    workCenter: '',
    operation: '',
    employees: [],
    team: '',
    createTeamAutomatically: true,
    status: 'planned',
    progress: 0,
    target: 0,
    produced: 0
  });

  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: '', 
    name: '', 
    exists: true, 
    status: 'Active',
    employmentType: 'Full-time',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'target' || name === 'produced' ? Number(value) : value
    }));
  };

  const handleAddEmployee = () => {
    // Ensure name is not an empty string
    if (newEmployee.name && newEmployee.name.trim()) {
      const employeeToAdd: Employee = {
        id: `emp-${Date.now()}`, // Generate a new ID
        name: newEmployee.name,
        exists: newEmployee.exists,
        status: newEmployee.status,
        employmentType: newEmployee.employmentType
      };

      setFormData(prev => ({
        ...prev,
        employees: [...prev.employees, employeeToAdd]
      }));

      // Reset to defaults with explicit type
      setNewEmployee({
        id: '',
        name: '', 
        exists: true, 
        status: 'Active', 
        employmentType: 'Full-time'
      });
    }
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.filter(emp => emp.id !== employeeId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate a unique ID for the new work order
    const newWorkOrder: WorkOrder = {
      ...formData,
      id: `wo-${Date.now()}`
    };

    // Dispatch the create action
    dispatch(createWorkOrder(newWorkOrder));

    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Work Order</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Site
              </label>
              <input
                type="text"
                name="site"
                value={formData.site}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Work Center
              </label>
              <input
                type="text"
                name="workCenter"
                value={formData.workCenter}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Operation
              </label>
              <input
                type="text"
                name="operation"
                value={formData.operation}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Production Target
            </label>
            <input
              type="number"
              name="target"
              value={formData.target}
              onChange={handleInputChange}
              min="0"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Employees
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Employee Name"
                className="flex-grow mr-2 border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
              <select
                value={newEmployee.exists ? 'true' : 'false'}
                onChange={(e) => setNewEmployee(prev => ({
                  ...prev,
                  exists: e.target.value === 'true'
                }))}
                className="mr-2 border border-gray-300 rounded-md shadow-sm py-2 px-3"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <button
                type="button"
                onClick={handleAddEmployee}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>

            <ul className="space-y-1">
              {formData.employees.map((emp) => (
                <li
                  key={emp.id}
                  className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
                >
                  <span className={!emp.exists ? 'line-through text-gray-500' : ''}>
                    {emp.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmployee(emp.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Work Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}