// File: /app/dashboard/page.tsx
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Users, 
  Layers, 
  ChevronRight, 
  Clock, 
  AlertTriangle,
  Plus 
} from 'lucide-react';
import DashboardMetricsGrid from '@/components/dashboard/dashboardScreen/DashboardMetricsGrid';
import WorkOrdersChart from '@/components/dashboard/dashboardScreen/WorkOrdersChart';
import EfficiencyChart from '@/components/dashboard/dashboardScreen/EfficiencyChart';
import ActivityTimeline from '@/components/dashboard/dashboardScreen/ActivityTimeline';
import TeamPerformance from '@/components/dashboard/dashboardScreen/TeamPerformance';
import AlertsList from '@/components/dashboard/dashboardScreen/AlertsList';


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Work Order
          </Button>
        </div>
      </div>

      <Suspense fallback={<div>Loading metrics...</div>}>
        <DashboardMetricsGrid />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Work Orders Status</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading chart...</div>}>
              <WorkOrdersChart />
            </Suspense>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Labor Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading chart...</div>}>
              <EfficiencyChart />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading activity...</div>}>
              <ActivityTimeline />
            </Suspense>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" className="w-full">
                View All Activity
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading alerts...</div>}>
              <AlertsList />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">Team Performance</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading team data...</div>}>
            <TeamPerformance />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}


