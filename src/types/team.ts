export interface TeamMember {
  id: string;
  name: string;
  role?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  teamLead: TeamMember;
  members: TeamMember[];
  location?: string;
}