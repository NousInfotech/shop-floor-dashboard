
'use client';

import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  AlertCircle 
} from 'lucide-react';

type ActivityItem = {
  id: number;
  type: 'completed' | 'assigned' | 'started' | 'issue';
  text: string;
  time: string;
  workOrder?: string;
};

export default function ActivityTimeline() {
  // This would normally be fetched from an API
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: 'completed',
      text: 'Team Alpha completed work order',
      workOrder: 'WO-2023-089',
      time: '15 min ago'
    },
    {
      id: 2,
      type: 'assigned',
      text: 'Sarah Johnson assigned to Team Beta',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'started',
      text: 'Team Delta started work order',
      workOrder: 'WO-2023-092',
      time: '2 hours ago'
    },
    {
      id: 4,
      type: 'issue',
      text: 'Equipment failure reported on Line 3',
      time: '3 hours ago'
    },
    {
      id: 5,
      type: 'completed',
      text: 'Team Gamma completed work order',
      workOrder: 'WO-2023-084',
      time: '4 hours ago'
    }
  ];

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'assigned':
        return <UserCheck className="h-5 w-5 text-blue-500" />;
      case 'started':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'issue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className="mt-0.5">
            {getIcon(activity.type)}
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm">{activity.text}</span>
              {activity.workOrder && (
                <Badge variant="secondary" className="font-mono">
                  {activity.workOrder}
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{activity.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
