// components/teams/TeamFormModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { 
  updateTeam, 
  // closeEditModal, 
  createTeam 
} from '@/redux/features/teams/teamSlice';
import { Team, TeamMember } from '@/types/team';
import { v4 as uuidv4 } from 'uuid';
import { employees } from '@/data/employees'


// Mock data for locations
const locations = [
  { id: '1', name: 'Building A - Main Floor' },
  { id: '2', name: 'Building B - Assembly Area' },
  { id: '3', name: 'North Wing - Production' },
  { id: '4', name: 'South Wing - Workshop' },
];

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
}

const TeamFormModal: React.FC<TeamFormModalProps> = ({ isOpen, onClose, mode }) => {
  const { selectedTeam } = useSelector((state: RootState) => state.team);
  const dispatch = useDispatch();
  
    const availableEmployees: TeamMember[] = employees.map(emp => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    role: emp.role,
  }));
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    teamLead: string;
    location: string;
  }>({
    name: '',
    description: '',
    teamLead: '',
    location: '',
  });

  // Reset form data when the modal opens or mode changes
  useEffect(() => {
    if (mode === 'edit' && selectedTeam) {
      setFormData({
        name: selectedTeam.name,
        description: selectedTeam.description,
        teamLead: selectedTeam.teamLead.id,
        location: '', // Set default location if your model has it
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        teamLead: '',
        location: '',
      });
    }
  }, [selectedTeam, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const teamLead = availableEmployees.find(emp => emp.id === formData.teamLead);
    
    if (!teamLead) {
      return; // Handle error - team lead is required
    }

    if (mode === 'edit' && selectedTeam) {
      dispatch(updateTeam({
        ...selectedTeam,
        name: formData.name,
        description: formData.description,
        teamLead: teamLead,
        // If your data model has location, add it here
      }));
    } else if (mode === 'create') {
      const newTeam: Team = {
        id: uuidv4(),
        name: formData.name,
        description: formData.description,
        teamLead: teamLead,
        members: [teamLead], // Initially add the team lead as a member
      };
      dispatch(createTeam(newTeam));
    }
    
    onClose();
  };

  const isFormValid = formData.name && formData.description && formData.teamLead;

  const title = mode === 'create' ? 'Create a New Team' : 'Edit Team';
  const subtitle = mode === 'create' 
    ? 'Create a team and assign a team lead to manage work orders and tasks.'
    : 'Make changes to the team details.';
  const submitButtonText = mode === 'create' ? 'Create Team' : 'Save Changes';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter team name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="teamLead">Team Lead</Label>
            <Select 
              value={formData.teamLead} 
              onValueChange={(value) => handleSelectChange('teamLead', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a team lead" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {availableEmployees.map((employee) => (
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
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Home Location</Label>
            <Select 
              value={formData.location} 
              onValueChange={(value) => handleSelectChange('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location (optional)" />
              </SelectTrigger>
             <SelectContent className='bg-white'>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="px-4">
            Cancel
          </Button>
          <Button 
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 flex items-center gap-2"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {mode === 'create' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            )}
            {submitButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamFormModal;