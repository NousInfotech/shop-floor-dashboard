import { Calendar, Clock, Coffee, Plus, X, Play, Pause, Edit, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { WorkOrder, WorkOrderStatus } from '@/types/work-order';

interface WorkOrderProgressProps {
  workOrder: WorkOrder;
  onClose: () => void;
  onUpdate?: (updatedWorkOrder: WorkOrder) => void; // New prop for handling updates
}

export default function WorkOrderProgress({ workOrder, onClose, onUpdate }: WorkOrderProgressProps) {
  // State management
  const [activeTab, setActiveTab] = useState<'progress' | 'breaks'>('progress');
  const [currentWorkOrder, setCurrentWorkOrder] = useState<WorkOrder>({
    ...workOrder,
    completionPercentage: workOrder.completionPercentage || 0
  });
  const [isRunning, setIsRunning] = useState(currentWorkOrder.status === 'in-progress');
  const [breaks, setBreaks] = useState<Array<{ id: number, startTime: Date, endTime?: Date }>>([]);
  const [breakActive, setBreakActive] = useState(false);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<WorkOrder>({...currentWorkOrder});
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate days overdue
  const calculateDaysOverdue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysOverdue = currentWorkOrder.endDate ? calculateDaysOverdue(currentWorkOrder.endDate) : 0;

  // Update progress every minute when work is running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !breakActive) {
      interval = setInterval(() => {
        // Simulating progress increase over time
        setCurrentWorkOrder(prev => {
          const newPercentage = Math.min((prev.completionPercentage || 0) + 1, 100);
          return {
            ...prev,
            completionPercentage: newPercentage,
            status: newPercentage >= 100 ? 'completed' : 'in-progress'
          };
        });
      }, 60000); // Update every minute
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, breakActive]);

  // Handle start/pause button
  const handleStartPause = () => {
    if (currentWorkOrder.status === 'completed') {
      return; // Can't start a completed work order
    }
    
    if (isRunning) {
      setIsRunning(false);
      setCurrentWorkOrder(prev => ({
        ...prev,
        status: 'on-hold'
      }));
    } else {
      setIsRunning(true);
      setCurrentWorkOrder(prev => ({
        ...prev,
        status: 'in-progress'
      }));
    }
  };

  // Handle start break
  const handleStartBreak = () => {
    if (!isRunning) return;
    
    setBreakActive(true);
    setBreaks(prev => [
      ...prev,
      {
        id: Date.now(),
        startTime: new Date()
      }
    ]);
  };

  // Handle end break
  const handleEndBreak = (breakId: number) => {
    setBreakActive(false);
    setBreaks(prev => 
      prev.map(b => 
        b.id === breakId ? { ...b, endTime: new Date() } : b
      )
    );
  };

  // Handle edit work order
  const handleEdit = () => {
    setEditFormData({...currentWorkOrder});
    setIsEditing(true);
  };

  // Handle change in edit form
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle number inputs specially
    if (name === 'completionPercentage') {
      const percentage = parseInt(value, 10);
      if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
        setEditFormData(prev => ({
          ...prev,
          [name]: percentage
        }));
      }
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle edit form submission
const handleEditSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const updatedWorkOrder = {
    ...editFormData,
    status: ((editFormData.completionPercentage ?? 0) >= 100
      ? 'completed'
      : isRunning
      ? 'in-progress'
      : 'on-hold') as WorkOrderStatus,
  };

  setCurrentWorkOrder(updatedWorkOrder);

  if (onUpdate) {
    onUpdate(updatedWorkOrder);
  }

  setIsEditing(false);
};


  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Render status indicator
  const renderStatus = () => {
    const getStatusColors = () => {
      switch (currentWorkOrder.status) {
        case 'in-progress':
          return { icon: 'text-blue-500', text: 'text-blue-700' };
        case 'on-hold':
          return { icon: 'text-yellow-500', text: 'text-yellow-700' };
        case 'completed':
          return { icon: 'text-green-500', text: 'text-green-700' };
        default:
          return { icon: 'text-gray-500', text: 'text-gray-700' };
      }
    };

    const colors = getStatusColors();
    
    return (
      <div className="flex items-center">
        {currentWorkOrder.status === 'on-hold' ? (
          <Pause className={`w-5 h-5 ${colors.icon} mr-2`} />
        ) : currentWorkOrder.status === 'completed' ? (
          <Clock className="w-5 h-5 text-green-500 mr-2" />
        ) : (
          <Play className="w-5 h-5 text-blue-500 mr-2" />
        )}
        <span className={colors.text}>{currentWorkOrder.status.replace(/-/g, ' ')}</span>
      </div>
    );
  };

  // Render completion bar
  const renderCompletionBar = () => {
    const getProgressColor = () => {
      const percentage = currentWorkOrder.completionPercentage || 0;
      if (percentage >= 100) return 'bg-green-600';
      if (percentage >= 75) return 'bg-blue-600';
      if (percentage >= 50) return 'bg-blue-500';
      if (percentage >= 25) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Completion</span>
          <span className="text-sm font-medium text-gray-700">{currentWorkOrder.completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`${getProgressColor()} h-2.5 rounded-full transition-all duration-300`} 
            style={{ width: `${currentWorkOrder.completionPercentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Render edit form modal
  const renderEditModal = () => {
    if (!isEditing) return null;
    
    return (
      <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Edit Work Order</h3>
            <button 
              onClick={handleCancelEdit}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleEditSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Work Order ID */}
              <div className="col-span-2">
                <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                  Work Order ID
                </label>
                <input
                  type="text"
                  name="id"
                  id="id"
                  value={editFormData.id}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled // ID typically shouldn't be editable
                />
              </div>
              
              {/* Operation */}
              <div className="col-span-2">
                <label htmlFor="operation" className="block text-sm font-medium text-gray-700 mb-1">
                  Operation
                </label>
                <input
                  type="text"
                  name="operation"
                  id="operation"
                  value={editFormData.operation}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={editFormData.startDate ? new Date(editFormData.startDate).toISOString().split('T')[0] : ''}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={editFormData.endDate ? new Date(editFormData.endDate).toISOString().split('T')[0] : ''}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              {/* Completion Percentage */}
              <div>
                <label htmlFor="completionPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                  Completion Percentage
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="completionPercentage"
                    id="completionPercentage"
                    min="0"
                    max="100"
                    value={editFormData.completionPercentage || 0}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="ml-2 text-gray-500">%</span>
                </div>
              </div>
              
              {/* Notes (optional) */}
              <div className="col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  rows={3}
                  value={editFormData.notes || ''}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any additional notes here..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <Save className="w-4 h-4 inline mr-1" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header section with work order details */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{currentWorkOrder.id}</h2>
              <p className="text-gray-600 mt-1">{currentWorkOrder.operation}</p>
            </div>
            
            <div className="flex items-center">
              {currentWorkOrder.status === 'on-hold' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mr-3">
                  <Pause className="w-4 h-4 mr-1" />
                  On Hold
                </span>
              )}
              {currentWorkOrder.status === 'in-progress' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-3">
                  <Play className="w-4 h-4 mr-1" />
                  In Progress
                </span>
              )}
              {currentWorkOrder.status === 'completed' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-3">
                  <Clock className="w-4 h-4 mr-1" />
                  Completed
                </span>
              )}
              
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Due Date section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Due Date</h3>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <div className="text-gray-900">{currentWorkOrder.endDate ? formatDate(currentWorkOrder.endDate) : 'No due date'}</div>
                  {daysOverdue > 0 && (
                    <div className="text-sm text-red-600 mt-1">
                      Overdue by {daysOverdue} days
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Status</h3>
              {renderStatus()}
            </div>
          </div>

          {/* Completion progress */}
          <div className="mb-8">
            {renderCompletionBar()}
          </div>

          {/* Notes section (if available) */}
          {currentWorkOrder.notes && (
            <div className="mb-8 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700">{currentWorkOrder.notes}</p>
            </div>
          )}

          {/* Tabs navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('progress')}
                className={`pb-4 font-medium text-sm flex items-center ${
                  activeTab === 'progress'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Progress Details
              </button>
              <button
                onClick={() => setActiveTab('breaks')}
                className={`pb-4 font-medium text-sm flex items-center ${
                  activeTab === 'breaks'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Coffee className="w-4 h-4 mr-2" />
                Breaks
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="py-6">
            {activeTab === 'progress' ? (
              <div>
                <p className="text-gray-600">
                  Progress details for {currentWorkOrder.id} are shown here.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Work Order Created</p>
                        <p className="text-xs text-gray-500">
                          {currentWorkOrder.startDate ? formatDate(currentWorkOrder.startDate) : 'Not started'}
                        </p>
                      </div>
                    </div>
                    {isRunning && (
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="w-0.5 h-full bg-gray-200"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Work In Progress</p>
                          <p className="text-xs text-gray-500">
                            Current completion: {currentWorkOrder.completionPercentage}%
                          </p>
                        </div>
                      </div>
                    )}
                    {currentWorkOrder.status === 'completed' && (
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Work Order Completed</p>
                          <p className="text-xs text-gray-500">
                            Completed on {formatDate(new Date().toISOString())}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Breaks list */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-gray-900">Breaks</h3>
                  <button
                    onClick={handleStartBreak}
                    disabled={!isRunning || breakActive || currentWorkOrder.status === 'completed'}
                    className={`inline-flex items-center px-4 py-2 rounded-lg shadow-sm text-sm font-medium ${
                      !isRunning || breakActive || currentWorkOrder.status === 'completed'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-900 text-white hover:bg-blue-800 focus:outline-none'
                    }`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Start Break
                  </button>
                </div>
                
                {breaks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No breaks recorded yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {breaks.map((breakItem) => (
                      <div 
                        key={breakItem.id} 
                        className="p-4 border border-gray-200 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-900">Break #{breaks.indexOf(breakItem) + 1}</p>
                          <p className="text-sm text-gray-500">
                            {formatTime(breakItem.startTime)} 
                            {breakItem.endTime ? ` - ${formatTime(breakItem.endTime)}` : ' - Ongoing'}
                          </p>
                          {breakItem.endTime && (
                            <p className="text-xs text-gray-500">
                              Duration: {Math.round((breakItem.endTime.getTime() - breakItem.startTime.getTime()) / 60000)} minutes
                            </p>
                          )}
                        </div>
                        
                        {!breakItem.endTime && (
                          <button
                            onClick={() => handleEndBreak(breakItem.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                          >
                            End Break
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer with actions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none mr-3"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Work Order
          </button>
          
          <button
            onClick={handleStartPause}
            disabled={currentWorkOrder.status === 'completed'}
            className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none ${
              currentWorkOrder.status === 'completed'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isRunning
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Edit Modal */}
      {renderEditModal()}
    </>
  );
}