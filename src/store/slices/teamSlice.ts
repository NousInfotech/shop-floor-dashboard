import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Team, TeamMember } from '@/types/test';

interface TeamsState {
  teams: Team[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamsState = {
  teams: [
    {
      id: "T001",
      name: "Assembly Team A",
      leader: "Emp-1",
      members: [
        { id: "Emp-1", name: "John Doe", role: "Leader", status: "active" },
        { id: "Emp-3", name: "Robert Chen", role: "Member", status: "active" },
        { id: "Emp-7", name: "Emily Davis", role: "Member", status: "inactive" }
      ],
      workOrders: ["WO001", "WO005"]
    },
    {
      id: "T002",
      name: "Packaging Team",
      leader: "Emp-4",
      members: [
        { id: "Emp-4", name: "Maria Garcia", role: "Leader", status: "active" },
        { id: "Emp-8", name: "James Wilson", role: "Member", status: "active" }
      ],
      workOrders: ["WO002"]
    }
  ],
  loading: false,
  error: null
};

export const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    // Create a new team
    createTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },
    
    // Update an existing team
    updateTeam: (state, action: PayloadAction<{ id: string; updates: Partial<Team> }>) => {
      const { id, updates } = action.payload;
      const index = state.teams.findIndex(team => team.id === id);
      
      if (index !== -1) {
        state.teams[index] = { ...state.teams[index], ...updates };
      }
    },
    
    // Delete a team
    deleteTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter(team => team.id !== action.payload);
    },
    
    // Add a member to a team
    addMemberToTeam: (state, action: PayloadAction<{ teamId: string; member: TeamMember }>) => {
      const { teamId, member } = action.payload;
      const team = state.teams.find(team => team.id === teamId);
      
      if (team) {
        team.members.push(member);
      }
    },
    
    // Remove a member from a team
    removeMemberFromTeam: (state, action: PayloadAction<{ teamId: string; memberId: string }>) => {
      const { teamId, memberId } = action.payload;
      const team = state.teams.find(team => team.id === teamId);
      
      if (team) {
        team.members = team.members.filter(member => member.id !== memberId);
      }
    },
    
    // Update team member status
    updateTeamMemberStatus: (state, action: PayloadAction<{
      teamId: string;
      memberId: string;
      status: 'active' | 'inactive'
    }>) => {
      const { teamId, memberId, status } = action.payload;
      const team = state.teams.find(team => team.id === teamId);
      
      if (team) {
        const member = team.members.find(member => member.id === memberId);
        if (member) {
          member.status = status;
        }
      }
    },
    
    // Assign work order to team
    assignWorkOrderToTeam: (state, action: PayloadAction<{ teamId: string; workOrderId: string }>) => {
      const { teamId, workOrderId } = action.payload;
      const team = state.teams.find(team => team.id === teamId);
      
      if (team && !team.workOrders.includes(workOrderId)) {
        team.workOrders.push(workOrderId);
      }
    },
    
    // Remove work order from team
    removeWorkOrderFromTeam: (state, action: PayloadAction<{ teamId: string; workOrderId: string }>) => {
      const { teamId, workOrderId } = action.payload;
      const team = state.teams.find(team => team.id === teamId);
      
      if (team) {
        team.workOrders = team.workOrders.filter(wo => wo !== workOrderId);
      }
    },
    
    // Set team leader
    setTeamLeader: (state, action: PayloadAction<{ teamId: string; memberId: string }>) => {
      const { teamId, memberId } = action.payload;
      const team = state.teams.find(team => team.id === teamId);
      
      if (team) {
        const member = team.members.find(member => member.id === memberId);
        if (member) {
          // Update the old leader's role
          const oldLeader = team.members.find(m => m.role === "Leader");
          if (oldLeader) {
            oldLeader.role = "Member";
          }
          
          // Set new leader
          member.role = "Leader";
          team.leader = memberId;
        }
      }
    },
    
    // Fetch teams request
    fetchTeamsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // Fetch teams success
    fetchTeamsSuccess: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Fetch teams failure
    fetchTeamsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  createTeam,
  updateTeam,
  deleteTeam,
  addMemberToTeam,
  removeMemberFromTeam,
  updateTeamMemberStatus,
  assignWorkOrderToTeam,
  removeWorkOrderFromTeam,
  setTeamLeader,
  fetchTeamsStart,
  fetchTeamsSuccess,
  fetchTeamsFailure
} = teamSlice.actions;

export default teamSlice.reducer;