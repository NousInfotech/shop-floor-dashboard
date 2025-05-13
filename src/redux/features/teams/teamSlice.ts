import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Team, TeamMember } from '@/types/team';

interface TeamState {
  teams: Team[];
  selectedTeam: Team | null;
  isEditModalOpen: boolean;
  isAddMemberModalOpen: boolean;
  isDeleteModalOpen: boolean;
}

const initialState: TeamState = {
  teams: [
    {
      id: '1',
      name: 'Assembly Team A',
      description: 'Main assembly line team for product line A',
      teamLead: { id: '1', name: 'Emily Johnson', role: 'Production Lead' },
      members: [
        { id: '1', name: 'Emily Johnson', role: 'Production Lead' },
        { id: '2', name: 'James Wilson', role: 'Assembler' },
        { id: '3', name: 'Sarah Lee', role: 'Quality Control' },
      ],
      location: '2' // Building B - Assembly Line
    },
    {
      id: '2',
      name: 'Machining Team',
      description: 'CNC and conventional machining operations',
      teamLead: { id: '4', name: 'Miguel Rodriguez', role: 'Machinist' },
      members: [
        { id: '4', name: 'Miguel Rodriguez', role: 'Machinist' },
      ],
      location: '3' // Building C - Machining Shop
    },
  ],
  selectedTeam: null,
  isEditModalOpen: false,
  isAddMemberModalOpen: false,
  isDeleteModalOpen: false,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    selectTeam: (state, action: PayloadAction<string>) => {
      state.selectedTeam = state.teams.find(team => team.id === action.payload) || null;
    },
    openEditModal: (state, action: PayloadAction<string>) => {
      state.selectedTeam = state.teams.find(team => team.id === action.payload) || null;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
    },
    updateTeam: (state, action: PayloadAction<Team>) => {
      const index = state.teams.findIndex(team => team.id === action.payload.id);
      if (index !== -1) {
        state.teams[index] = action.payload;
      }
      state.isEditModalOpen = false;
    },
    createTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },
    openAddMemberModal: (state, action: PayloadAction<string>) => {
      state.selectedTeam = state.teams.find(team => team.id === action.payload) || null;
      state.isAddMemberModalOpen = true;
    },
    closeAddMemberModal: (state) => {
      state.isAddMemberModalOpen = false;
    },
    addTeamMember: (state, action: PayloadAction<{ teamId: string, member: TeamMember }>) => {
      const { teamId, member } = action.payload;
      const team = state.teams.find(t => t.id === teamId);
      if (team) {
        team.members.push(member);
      }
      state.isAddMemberModalOpen = false;
    },
    removeTeamMember: (state, action: PayloadAction<{ teamId: string, memberId: string }>) => {
      const { teamId, memberId } = action.payload;
      const team = state.teams.find(t => t.id === teamId);
      if (team) {
        // Make sure we're not removing the team lead
        if (team.teamLead.id !== memberId) {
          team.members = team.members.filter(m => m.id !== memberId);
        }
      }
    },
    openDeleteModal: (state, action: PayloadAction<string>) => {
      state.selectedTeam = state.teams.find(team => team.id === action.payload) || null;
      state.isDeleteModalOpen = true;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
    },
    deleteTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter(team => team.id !== action.payload);
      state.isDeleteModalOpen = false;
    },
  },
});

export const { 
  selectTeam, 
  openEditModal, 
  closeEditModal, 
  updateTeam, 
  createTeam, 
  openAddMemberModal, 
  closeAddMemberModal, 
  addTeamMember, 
  removeTeamMember,
  openDeleteModal,
  closeDeleteModal,
  deleteTeam
} = teamSlice.actions;

export default teamSlice.reducer;