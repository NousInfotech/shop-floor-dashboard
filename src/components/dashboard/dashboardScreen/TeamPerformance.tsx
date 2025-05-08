

'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';


type TeamData = {
  id: number;
  name: string;
  leader: string;
  members: number;
  efficiency: number;
  status: 'available' | 'assigned' | 'break';
  currentWO?: string;
};

export default function TeamPerformance() {
  // This would normally be fetched from an API
  const teams: TeamData[] = [
    {
      id: 1,
      name: 'Team Alpha',
      leader: 'John Smith',
      members: 5,
      efficiency: 94,
      status: 'assigned',
      currentWO: 'WO-2023-089'
    },
    {
      id: 2,
      name: 'Team Beta',
      leader: 'Jane Brown',
      members: 4,
      efficiency: 87,
      status: 'assigned',
      currentWO: 'WO-2023-092'
    },
    {
      id: 3,
      name: 'Team Delta',
      leader: 'Mike Johnson',
      members: 6,
      efficiency: 91,
      status: 'assigned',
      currentWO: 'WO-2023-090'
    },
    {
      id: 4,
      name: 'Team Gamma',
      leader: 'Sarah Wilson',
      members: 3,
      efficiency: 82,
      status: 'available'
    },
    {
      id: 5,
      name: 'Team Epsilon',
      leader: 'Robert Lee',
      members: 4,
      efficiency: 89,
      status: 'break'
    }
  ];

  const getStatusBadge = (status: TeamData['status']) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Available</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Assigned</Badge>;
      case 'break':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">On Break</Badge>;
      default:
        return null;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'bg-green-600';
    if (efficiency >= 80) return 'bg-blue-600';
    return 'bg-amber-600';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team</TableHead>
            <TableHead>Leader</TableHead>
            <TableHead className="text-center">Members</TableHead>
            <TableHead>Efficiency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current WO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.name}</TableCell>
              <TableCell>{team.leader}</TableCell>
              <TableCell className="text-center">{team.members}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                <div className="relative h-2 w-full rounded-full bg-muted">
  <div
    className={`h-full rounded-full transition-all ${getEfficiencyColor(team.efficiency)}`}
    style={{ width: `${team.efficiency}%` }}
  />
</div>

                  <span className="text-sm">{team.efficiency}%</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(team.status)}</TableCell>
              <TableCell>{team.currentWO || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}