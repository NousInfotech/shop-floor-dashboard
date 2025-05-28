/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateTeam, createTeam } from '@/redux/features/teams/teamSlice';
import { Team, TeamMember } from '@/types/team';
import { v4 as uuidv4 } from 'uuid';
import { employees } from '@/data/employees';

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
}

const locations = [
  { id: '1', name: 'Building A - Main Floor' },
  { id: '2', name: 'Building B - Assembly Area' },
  { id: '3', name: 'North Wing - Production' },
  { id: '4', name: 'South Wing - Workshop' },
];

const TeamFormModal: React.FC<TeamFormModalProps> = ({ isOpen, onClose, mode }) => {
  const { selectedTeam } = useSelector((state: RootState) => state.team);
  const dispatch = useDispatch();

  const availableEmployees: TeamMember[] = employees.map(emp => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    role: emp.role,
  }));

  // State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamLead: '',
    location: '',
  });

  // Members state for drag-and-drop
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [available, setAvailable] = useState<TeamMember[]>([]);

  // For multi-select
  const [selectedAvailableIds, setSelectedAvailableIds] = useState<string[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // Drag state
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<'available' | 'members' | null>(null);

  // Reset form data and members when the modal opens or mode changes
  useEffect(() => {
    if (mode === 'edit' && selectedTeam) {
      setFormData({
        name: selectedTeam.name,
        description: selectedTeam.description,
        teamLead: selectedTeam.teamLead.id,
        location: '', // Set default location if needed
      });
      setMembers(selectedTeam.members);
      setAvailable(availableEmployees.filter(e => !selectedTeam.members.some(m => m.id === e.id)));
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        teamLead: '',
        location: '',
      });
      setMembers([]);
      setAvailable(availableEmployees);
    }
    setSelectedAvailableIds([]);
    setSelectedMemberIds([]);
  }, [selectedTeam, mode, isOpen]);

  // Handle text and textarea changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select (dropdown) changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, itemId: string, from: 'available' | 'members') => {
    setDraggedItem(itemId);
    setDraggedFrom(from);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropZone: 'available' | 'members') => {
    e.preventDefault();
    
    if (!draggedItem || !draggedFrom || draggedFrom === dropZone) {
      setDraggedItem(null);
      setDraggedFrom(null);
      return;
    }

    // Determine which items to move
    let idsToMove: string[] = [];
    
    if (draggedFrom === 'available') {
      idsToMove = selectedAvailableIds.length > 0 && selectedAvailableIds.includes(draggedItem)
        ? selectedAvailableIds
        : [draggedItem];
    } else {
      idsToMove = selectedMemberIds.length > 0 && selectedMemberIds.includes(draggedItem)
        ? selectedMemberIds
        : [draggedItem];
    }

    // Move items
    if (draggedFrom === 'available' && dropZone === 'members') {
      const toAdd = available.filter(emp => idsToMove.includes(emp.id));
      setMembers(prev => [...prev, ...toAdd]);
      setAvailable(prev => prev.filter(emp => !idsToMove.includes(emp.id)));
      setSelectedAvailableIds([]);
    } else if (draggedFrom === 'members' && dropZone === 'available') {
      const toRemove = members.filter(emp => idsToMove.includes(emp.id));
      setAvailable(prev => [...prev, ...toRemove]);
      setMembers(prev => prev.filter(emp => !idsToMove.includes(emp.id)));
      setSelectedMemberIds([]);
    }

    setDraggedItem(null);
    setDraggedFrom(null);
  };

  // Multi-select handlers
  const handleAvailableClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedAvailableIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMemberClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Move selected items
  const moveSelectedToMembers = () => {
    if (selectedAvailableIds.length === 0) return;
    
    const toAdd = available.filter(emp => selectedAvailableIds.includes(emp.id));
    setMembers(prev => [...prev, ...toAdd]);
    setAvailable(prev => prev.filter(emp => !selectedAvailableIds.includes(emp.id)));
    setSelectedAvailableIds([]);
  };

  const moveSelectedToAvailable = () => {
    if (selectedMemberIds.length === 0) return;
    
    const toRemove = members.filter(emp => selectedMemberIds.includes(emp.id));
    setAvailable(prev => [...prev, ...toRemove]);
    setMembers(prev => prev.filter(emp => !selectedMemberIds.includes(emp.id)));
    setSelectedMemberIds([]);
  };

  // Form submit
  const handleSubmit = () => {
    const teamLead = availableEmployees.find(emp => emp.id === formData.teamLead);
    if (!formData.name.trim() || !teamLead) return;

    // Ensure team lead is included in members if not already
    const finalMembers = members.some(m => m.id === teamLead.id) 
      ? members 
      : [teamLead, ...members];

    if (mode === 'edit' && selectedTeam) {
      dispatch(updateTeam({
        ...selectedTeam,
        name: formData.name,
        description: formData.description,
        teamLead,
        members: finalMembers,
      }));
    } else if (mode === 'create') {
      const newTeam: Team = {
        id: uuidv4(),
        name: formData.name,
        description: formData.description,
        teamLead,
        members: finalMembers,
      };
      dispatch(createTeam(newTeam));
    }
    onClose();
  };

  const isFormValid = formData.name.trim() && formData.teamLead;

  const title = mode === 'create' ? 'Create a New Team' : 'Edit Team';
  const subtitle = mode === 'create'
    ? 'Create a team and assign a team lead to manage work orders and tasks.'
    : 'Make changes to the team details.';
  const submitButtonText = mode === 'create' ? 'Create Team' : 'Save Changes';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </DialogHeader>
        <div className="grid gap-4 py-4 px-2 max-h-[70vh] overflow-y-auto">
          {/* Basic Form Fields */}
          <div className="grid gap-2">
            <Label htmlFor="name">Team Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter team name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="teamLead">Team Lead <span className="text-red-500">*</span></Label>
            <Select
              value={formData.teamLead}
              onValueChange={value => handleSelectChange('teamLead', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a team lead" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {availableEmployees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} {employee.role ? `(${employee.role})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter team description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Home Location</Label>
            <Select
              value={formData.location}
              onValueChange={value => handleSelectChange('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location (optional)" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {locations.map(location => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Members Drag & Drop Section */}
          <div className="grid gap-2">
            <Label>Team Members</Label>
            <div className="flex gap-4">
              {/* Available Employees */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Available Employees</h4>
                  {selectedAvailableIds.length > 0 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={moveSelectedToMembers}
                      className="text-xs"
                    >
                      Add Selected ({selectedAvailableIds.length})
                    </Button>
                  )}
                </div>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-3 min-h-[200px] max-h-[200px] overflow-y-auto bg-gray-50"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'available')}
                >
                  {available.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center mt-8">No available employees</p>
                  ) : (
                    available.map(emp => (
                      <div
                        key={emp.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, emp.id, 'available')}
                        onClick={(e) => handleAvailableClick(emp.id, e)}
                        className={`flex items-center gap-2 p-2 mb-1 rounded cursor-pointer border transition-colors ${
                          selectedAvailableIds.includes(emp.id)
                            ? 'bg-blue-100 border-blue-400'
                            : 'bg-white hover:bg-gray-100 border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAvailableIds.includes(emp.id)}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs flex-shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{emp.name}</div>
                          {emp.role && <div className="text-xs text-gray-500 truncate">{emp.role}</div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </div>
              </div>

              {/* Team Members */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Team Members</h4>
                  {selectedMemberIds.length > 0 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={moveSelectedToAvailable}
                      className="text-xs"
                    >
                      Remove Selected ({selectedMemberIds.length})
                    </Button>
                  )}
                </div>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-3 min-h-[200px] max-h-[200px] overflow-y-auto bg-green-50"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'members')}
                >
                  {members.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center mt-8">
                     {" Drag employees here or use the 'Add Selected' button"}
                    </p>
                  ) : (
                    members.map(emp => (
                      <div
                        key={emp.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, emp.id, 'members')}
                        onClick={(e) => handleMemberClick(emp.id, e)}
                        className={`flex items-center gap-2 p-2 mb-1 rounded cursor-pointer border transition-colors ${
                          selectedMemberIds.includes(emp.id)
                            ? 'bg-green-100 border-green-400'
                            : 'bg-white hover:bg-gray-100 border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMemberIds.includes(emp.id)}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs flex-shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {emp.name}
                            {emp.id === formData.teamLead && (
                              <span className="ml-2 px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                Lead
                              </span>
                            )}
                          </div>
                          {emp.role && <div className="text-xs text-gray-500 truncate">{emp.role}</div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              • Drag employees between lists or use checkboxes for multi-select
              • {"Click 'Add Selected' or 'Remove Selected' buttons for group moves"}
              • Team lead will automatically be added to team members
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="px-4">
            Cancel
          </Button>
          <Button
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 flex items-center gap-2"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {submitButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamFormModal;