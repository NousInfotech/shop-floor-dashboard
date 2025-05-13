import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { selectTeam, removeTeamMember, deleteTeam } from '@/redux/features/teams/teamSlice';

// Define TypeScript interfaces
interface TeamMember {
  id: string;
  name: string;
  role?: string;
  email?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  teamLead: TeamMember;
  members: TeamMember[];
}
import { Input } from '@/components/ui/input';
import TeamFormModal from './TeamModel';
import TeamMemberModal from './TeamMemberModal';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const TeamTable = () => {
  const teams = useSelector((state: RootState) => state.team.teams);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ teamId: string, memberId: string } | null>(null);
  const [viewMembersTeam, setViewMembersTeam] = useState<Team | null>(null);
  const [isViewMembersOpen, setIsViewMembersOpen] = useState(false);

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (teamId: string) => {
    dispatch(selectTeam(teamId));
    setIsEditModalOpen(true);
  };

  const handleAddMember = (teamId: string) => {
    dispatch(selectTeam(teamId));
    setIsAddMemberModalOpen(true);
  };

  const confirmDelete = (teamId: string) => {
    setTeamToDelete(teamId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (teamToDelete) {
      dispatch(deleteTeam(teamToDelete));
    }
    setIsDeleteDialogOpen(false);
    setTeamToDelete(null);
  };

  const confirmRemoveMember = (teamId: string, memberId: string) => {
    setMemberToRemove({ teamId, memberId });
    setIsRemoveMemberDialogOpen(true);
  };

  const handleRemoveMember = () => {
    if (memberToRemove) {
      dispatch(removeTeamMember(memberToRemove));
    }
    setIsRemoveMemberDialogOpen(false);
    setMemberToRemove(null);
  };

  const openViewMembers = (team: Team) => {
    setViewMembersTeam(team);
    setIsViewMembersOpen(true);
  };

  return (
    <>
      <div className="mt-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search teams..."
            className="w-full md:w-96 mb-4 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="text-left py-3 px-4">Team Name</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-left py-3 px-4">Team Lead</th>
                <th className="text-left py-3 px-4">Members</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => (
                <tr key={team.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm">{team.name}</td>
                  <td className="py-4 px-4 text-sm">{team.description}</td>
                  <td className="py-4 px-4 text-sm">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        {team.teamLead.name.charAt(0)}
                      </div>
                      {team.teamLead.name}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span>{team.members.length} {team.members.length === 1 ? 'Member' : 'Members'}</span>
                        <button
                          onClick={() => openViewMembers(team)}
                          className="ml-3 px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          View Members
                        </button>
                      </div>
                      <div className="mt-2 flex -space-x-2 overflow-hidden">
                        {team.members.slice(0, 5).map(member => (
                          <div 
                            key={member.id}
                            className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs"
                            title={member.name}
                          >
                            {member.name.charAt(0)}
                          </div>
                        ))}
                        {team.members.length > 5 && (
                          <div className="h-8 w-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium">
                            +{team.members.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleAddMember(team.id)}
                        className="p-1 rounded hover:bg-gray-200"
                        title="Add Member"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="8.5" cy="7" r="4" />
                          <line x1="20" y1="8" x2="20" y2="14" />
                          <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleEdit(team.id)}
                        className="p-1 rounded hover:bg-gray-200"
                        title="Edit Team"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => confirmDelete(team.id)}
                        className="p-1 rounded hover:bg-gray-200 text-red-500"
                        title="Delete Team"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Members Modal */}
      <Dialog open={isViewMembersOpen} onOpenChange={setIsViewMembersOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              Team Members - {viewMembersTeam?.name}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({viewMembersTeam?.members.length} {viewMembersTeam?.members.length === 1 ? 'Member' : 'Members'})
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto py-2">
            {viewMembersTeam?.members.map((member: TeamMember) => (
              <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">
                      {member.name}
                      {member.id === viewMembersTeam?.teamLead.id && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Team Lead
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{member.role || member.email || 'Team Member'}</div>
                  </div>
                </div>
                {member.id !== viewMembersTeam?.teamLead.id && (
                  <button
                    onClick={() => {
                      setIsViewMembersOpen(false);
                      confirmRemoveMember(viewMembersTeam.id, member.id);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => {
  setIsViewMembersOpen(false);
  handleAddMember(viewMembersTeam?.id ?? "");
}}

            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Member
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <TeamFormModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        mode="edit" 
      />

      {/* Add Member Modal */}
      <TeamMemberModal 
        isOpen={isAddMemberModalOpen} 
        onClose={() => setIsAddMemberModalOpen(false)} 
      />

      {/* Delete Team Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this team?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the team and remove all team data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={isRemoveMemberDialogOpen} onOpenChange={setIsRemoveMemberDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} className="bg-red-600 hover:bg-red-700 text-white">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TeamTable;