
// File: /components/dashboard/AlertsList.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Clock } from 'lucide-react';

type Alert = {
  id: number;
  type: 'warning' | 'critical' | 'deadline';
  message: string;
  time: string;
};

export default function AlertsList() {
  // This would normally be fetched from an API
  const alerts: Alert[] = [
    {
      id: 1,
      type: 'deadline',
      message: 'WO-2023-092 approaching deadline',
      time: 'Due in 4 hours'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Team Charlie under capacity',
      time: 'Requires attention'
    },
    {
      id: 3,
      type: 'critical',
      message: 'Unassigned work order',
      time: 'WO-2023-097'
    },
    {
      id: 4,
      type: 'deadline',
      message: 'WO-2023-085 deadline extended',
      time: 'New: May 7, 2025'
    }
  ];

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'deadline':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getBadgeVariant = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'outline';
      case 'deadline':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div key={alert.id} className="flex items-start space-x-3 p-2 rounded-md bg-muted/40">
          <div className="mt-0.5">{getIcon(alert.type)}</div>
          <div>
            <p className="text-sm">{alert.message}</p>
            <div className="flex items-center mt-1 space-x-2">
              <Badge variant={getBadgeVariant(alert.type)} className="text-xs">
                {alert.type}
              </Badge>
              <span className="text-xs text-muted-foreground">{alert.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
