// components/teams/TeamMemberModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { addTeamMember } from '@/redux/features/teams/teamSlice';
import { TeamMember } from '@/types/team';
import { employees } from '@/data/employees'




interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ isOpen, onClose }) => {
  const { selectedTeam } = useSelector((state: RootState) => state.team);
  const dispatch = useDispatch();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedEmployee('');
    }
  }, [isOpen]);

  const availableEmployees: TeamMember[] = employees.map(emp => ({
  id: emp.id,
  name: `${emp.firstName} ${emp.lastName}`,
  role: emp.role,
}));
  const handleAddMember = () => {
    if (selectedTeam && selectedEmployee) {
      const employee = availableEmployees.find(e => e.id === selectedEmployee);
      if (employee) {
        dispatch(addTeamMember({
          teamId: selectedTeam.id,
          member: {
            id: employee.id,
            name: employee.name,
            role: employee.role
          }
        }));
      }
      onClose();
    }
  };

  // Filter out employees already in the team
  const filteredEmployees = availableEmployees.filter(
    employee => !selectedTeam?.members.some(member => member.id === employee.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Team Member</DialogTitle>
          <p className="text-sm text-gray-500">Select an employee to add to the team.</p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="employee">Employee</Label>
            <Select
              value={selectedEmployee}
              onValueChange={setSelectedEmployee}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} {employee.role ? `(${employee.role})` : ''}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-employees" disabled>
                    No available employees
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-blue-900 hover:bg-blue-800 text-white flex items-center gap-2" 
            onClick={handleAddMember}
            disabled={!selectedEmployee}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            Add Member
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberModal;