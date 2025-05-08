'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Layers, 
  Users, 
  UserCheck, 
  Activity, 
  BarChart 
} from 'lucide-react';

export default function DashboardMetricsGrid() {
  // Normally you would fetch this data from an API
  const metrics = [
    {
      title: "Total Work Orders",
      value: "128",
      description: "24 in progress",
      icon: <Layers className="h-4 w-4 text-blue-600" />,
      trend: "+8% from last week"
    },
    {
      title: "Active Employees",
      value: "45",
      description: "2 on leave",
      icon: <Users className="h-4 w-4 text-green-600" />,
      trend: "Stable"
    },
    {
      title: "Teams Assigned",
      value: "12",
      description: "3 at capacity",
      icon: <UserCheck className="h-4 w-4 text-purple-600" />,
      trend: "+1 from yesterday"
    },
    {
      title: "Labor Efficiency",
      value: "87%",
      description: "Target: 90%",
      icon: <Activity className="h-4 w-4 text-orange-600" />,
      trend: "+2% from last month"
    },
    {
      title: "Productivity Rate",
      value: "92%",
      description: "Above target",
      icon: <BarChart className="h-4 w-4 text-teal-600" />,
      trend: "+5% from target"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
            <div className="text-xs text-muted-foreground mt-1">{metric.trend}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
