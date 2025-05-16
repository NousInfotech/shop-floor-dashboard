'use client';
import React, { useState, useEffect } from 'react';
import { 
  Activity,  BarChart3, Calendar, CheckCircle2, ChevronRight,  Cpu, DollarSign, Eye, Layers,
  Loader2, Package,  Plus, Settings, Sparkles, TrendingUp, Users,
  Building2Icon,  ListChecks, SquareArrowUp
} from 'lucide-react';
import { GetCurrentDateTime } from '@/components/dashboard/dashboardScreen/getCurrentDateTime';
import { initialWorkOrders } from '@/data/initialWorkOrders';
import { departmentData } from '@/data/departmentData';
import { AnimatedCounter } from '@/components/dashboard/dashboardScreen/AnimatedCounter';
import { DonutChart } from '@/components/dashboard/dashboardScreen/DonutChart';
import { AnimatedBarChart } from '@/components/dashboard/dashboardScreen/AnimatedBarChart';
import { WorkOrderItem } from '@/components/dashboard/dashboardScreen/WorkOrderItem';
import { HorizontalBarChart } from '@/components/dashboard/dashboardScreen/HorizontalBarChart';
import { ShiftSchedule } from '@/components/dashboard/dashboardScreen/ShiftSchedule';

export type WorkOrderStatus = 'on-hold' | 'in-progress' | 'idle' | 'completed';
export type WorkOrderPriority = 'high' | 'urgent' | 'medium' | 'low';
export type WorkOrderFilter = WorkOrderStatus | 'all' | 'urgent';

export interface Order {
  id: number;
  name: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  dueDate: string;
  progress: number;
  quantity: number;
  rate: number;
}

export default function DynamicDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [showGreeting, setShowGreeting] = useState(false);
  const [workOrders, setWorkOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<WorkOrderFilter>('all');
  const [activeView, setActiveView] = useState('overview');

  // Initialize work orders with type-safe data
  useEffect(() => {
    // Type assertion to ensure the imported data matches our Order type
    const typedOrders = initialWorkOrders.map(order => ({
      ...order,
      status: order.status as WorkOrderStatus,
      priority: order.priority as WorkOrderPriority
    }));
    setWorkOrders(typedOrders);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    const greetingTimer = setTimeout(() => setShowGreeting(true), 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(greetingTimer);
    };
  }, []);

  const countWorkOrdersByStatus = (): Record<WorkOrderStatus, number> => {
    const counts: Record<WorkOrderStatus, number> = {
      'on-hold': 0,
      'in-progress': 0,
      'idle': 0,
      'completed': 0,
    };

    workOrders.forEach((order) => {
      counts[order.status] += 1;
    });

    return counts;
  };

  const workOrderCounts = countWorkOrdersByStatus();

  // Donut chart data
  const calculateDonutSegments = () => {
    const total = workOrders.length;
    return [
      { color: '#94A3B8', percentage: (workOrderCounts['on-hold'] / total) * 100, label: 'On Hold' },
      { color: '#8B5CF6', percentage: (workOrderCounts['idle'] / total) * 100, label: 'Idle' },
      { color: '#6366F1', percentage: (workOrderCounts['in-progress'] / total) * 100, label: 'In Progress' },
      { color: '#22C55E', percentage: (workOrderCounts['completed'] / total) * 100, label: 'Completed' },
    ];
  };

  // Work order actions
  const handlePlayOrder = (id: string | number) => {
    setWorkOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: 'in-progress' as WorkOrderStatus } : order
    ));
  };

  const handlePauseOrder = (id: string | number) => {
    setWorkOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: 'idle' as WorkOrderStatus } : order
    ));
  };

  const handleHoldOrder = (id: string | number) => {
    setWorkOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: 'on-hold' as WorkOrderStatus } : order
    ));
  };

  const handleCompleteOrder = (id: string | number) => {
    setWorkOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: 'completed' as WorkOrderStatus, progress: 100 } : order
    ));
  };

  // Filter work orders
  const getFilteredWorkOrders = () => {
    if (activeFilter === 'all') return workOrders;
    if (activeFilter === 'urgent') return workOrders.filter(order => order.priority === 'urgent');
    return workOrders.filter(order => order.status === activeFilter);
  };

  const filteredWorkOrders = getFilteredWorkOrders();
  const activeWorkOrders = workOrders.filter(order => order.status === 'in-progress');

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      {/* Header with greeting and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <div className={`transition-all duration-700 ${showGreeting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              Manufacturing Dashboard
              <Sparkles className="ml-2 h-5 w-5 text-yellow-400" />
            </h1>
            <p className="text-gray-600 mt-1">Overview of shop floor operations and performance</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow transition-all duration-200 flex items-center text-sm font-medium">
            <Eye className="mr-2 h-4 w-4" />
            View Reports
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center text-sm font-medium">
            <Plus className="mr-2 h-4 w-4" />
            New Work Order
          </button>
        </div>
      </div>

      {/* View Navigation Tabs */}
      <div className="flex space-x-2 mb-6">
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
            activeView === 'overview' 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setActiveView('overview')}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Overview
        </button>
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
            activeView === 'orders' 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setActiveView('orders')}
        >
          <ListChecks className="h-4 w-4 mr-2" />
          Work Orders
        </button>
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
            activeView === 'production' 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setActiveView('production')}
        >
          <Building2Icon className="h-4 w-4 mr-2" />
          Production
        </button>
      </div>

      {activeView === 'overview' && (
        <>
          {/* Key metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <AnimatedCounter 
              value={workOrders.length} 
              title="Total Work Orders" 
              icon={<Layers className="h-5 w-5 text-white" />} 
              color="from-blue-500 to-blue-600" 
              subtext={`/${workOrders.length + 3} total`}
              onClick={() => {
                setActiveView('orders');
                setActiveFilter('all');
              }}
            />
            <AnimatedCounter 
              value={Math.round((workOrderCounts['completed'] / workOrders.length) * 100)} 
              title="Completion Rate" 
              icon={<CheckCircle2 className="h-5 w-5 text-white" />} 
              color="from-emerald-500 to-emerald-600" 
              subtext="%"
              onClick={() => {
                setActiveView('orders');
                setActiveFilter('completed');
              }}
            />
            <AnimatedCounter 
              value={4} 
              title="Active Employees" 
              icon={<Users className="h-5 w-5 text-white" />} 
              color="from-violet-500 to-purple-600" 
              subtext="/5 total"
            />
            <AnimatedCounter 
              value={3} 
              title="Active Sites" 
              icon={<Settings className="h-5 w-5 text-white" />} 
              color="from-amber-500 to-orange-600" 
              subtext="/4 total"
            />
          </div>

          {/* Middle section - charts and status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Work orders status */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-800">Work Order Status</h2>
                <div className="p-2 bg-gray-100 rounded-md">
                  <Layers className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <DonutChart 
                segments={calculateDonutSegments()} 
                centerContent={{ value: workOrders.length, label: 'Orders' }}
              />
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-gray-400"></div>
                  <span className="text-xs text-gray-600">On Hold</span>
                  <span className="ml-auto text-lg font-medium">{workOrderCounts['on-hold']}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-purple-500"></div>
                  <span className="text-xs text-gray-600">Idle</span>
                  <span className="ml-auto text-lg font-medium">{workOrderCounts['idle']}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-blue-500"></div>
                  <span className="text-xs text-gray-600">In Progress</span>
                  <span className="ml-auto text-lg font-medium">{workOrderCounts['in-progress']}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                  <span className="text-xs text-gray-600">Completed</span>
                  <span className="ml-auto text-lg font-medium">{workOrderCounts['completed']}</span>
                </div>
              </div>
            </div>
            
            {/* Employee Distribution */}
            <HorizontalBarChart 
              data={departmentData} 
              title="Employee Distribution" 
            />
          </div>

          {/* Bottom row with work order preview and shift schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Work Orders */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-gray-700 mr-2" />
                  <h2 className="text-lg font-medium text-gray-800">Active Work Orders</h2>
                </div>
                <button 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  onClick={() => {
                    setActiveView('orders');
                    setActiveFilter('in-progress');
                  }}
                >
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              {activeWorkOrders.length > 0 ? (
                <div className="space-y-4">
                  {activeWorkOrders.map(order => (
                    <WorkOrderItem 
                      key={order.id} 
                      order={order} 
                      onPlay={handlePlayOrder}
                      onPause={handlePauseOrder}
                      onHold={handleHoldOrder}
                      onComplete={handleCompleteOrder}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Loader2 className="h-10 w-10 mb-3 text-gray-400" />
                  <p className="text-center">No active work orders at the moment</p>
                </div>
              )}
            </div>
            
            {/* Shift Schedule */}
            <ShiftSchedule />
          </div>
        </>
      )}

      {activeView === 'orders' && (
        <>
          {/* Work Orders View */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
              <h2 className="text-xl font-medium text-gray-800 flex items-center">
                <ListChecks className="mr-2 h-5 w-5 text-gray-700" />
                Work Orders Management
              </h2>
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'all' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter('all')}
                >
                  All Orders
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'in-progress' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter('in-progress')}
                >
                  In Progress
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'on-hold' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter('on-hold')}
                >
                  On Hold
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'completed' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter('completed')}
                >
                  Completed
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'urgent' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter('urgent')}
                >
                  Urgent
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredWorkOrders.length > 0 ? (
                filteredWorkOrders.map(order => (
                  <WorkOrderItem 
                    key={order.id} 
                    order={order} 
                    onPlay={handlePlayOrder}
                    onPause={handlePauseOrder}
                    onHold={handleHoldOrder}
                    onComplete={handleCompleteOrder}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mb-3 text-gray-400" />
                  <p className="text-center font-medium text-lg">No work orders found</p>
                  <p className="text-center text-gray-500">Try changing your filter or create a new work order</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeView === 'production' && (
        <>
          {/* Production View */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-gray-800 flex items-center">
                <Building2Icon className="mr-2 h-5 w-5 text-gray-700" />
                Production Performance
              </h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all">
                  Last Week
                </button>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all">
                  This Week
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all">
                  Month
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-purple-800">Production Output</h3>
                  <SquareArrowUp className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-900">78 <span className="text-sm font-normal">units</span></p>
                <p className="text-xs text-purple-700 mt-1">↑ 12% from last week</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-emerald-800">Efficiency Rate</h3>
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-emerald-900">92<span className="text-sm font-normal">%</span></p>
                <p className="text-xs text-emerald-700 mt-1">↑ 3% from last week</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-amber-800">Operational Cost</h3>
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-amber-900">$4,358</p>
                <p className="text-xs text-amber-700 mt-1">↓ 5% from last week</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Weekly Production</h3>
              <AnimatedBarChart 
                data={[
                  { label: 'Mon', value: 12, color: '#8B5CF6' },
                  { label: 'Tue', value: 19, color: '#8B5CF6' },
                  { label: 'Wed', value: 15, color: '#8B5CF6' },
                  { label: 'Thu', value: 22, color: '#8B5CF6' },
                  { label: 'Fri', value: 10, color: '#8B5CF6' },
                  { label: 'Sat', value: 0, color: '#8B5CF6' },
                  { label: 'Sun', value: 0, color: '#8B5CF6' }
                ]} 
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Resource Utilization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">Machine Utilization</span>
                    <span className="text-sm font-medium text-gray-800">78%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
                    <div className="h-3 rounded-full bg-blue-500" style={{ width: '78%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">Labor Efficiency</span>
                    <span className="text-sm font-medium text-gray-800">92%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
                    <div className="h-3 rounded-full bg-green-500" style={{ width: '92%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">Material Usage</span>
                    <span className="text-sm font-medium text-gray-800">65%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="h-3 rounded-full bg-amber-500" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="flex items-center mb-3">
                    <Cpu className="h-5 w-5 text-gray-700 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Machine Status</h4>
                      <p className="text-xs text-gray-600">3 active, 1 maintenance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Users className="h-5 w-5 text-gray-700 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Workforce</h4>
                      <p className="text-xs text-gray-600">4 operators on floor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-700 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Inventory</h4>
                      <p className="text-xs text-gray-600">Raw materials at 72%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>  
      )}
      
      {/* Footer */}
      <div className="mt-auto pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="mb-4 md:mb-0">
            <p>© 2025 Manufacturing System | Last updated: <GetCurrentDateTime/></p>
          </div>
          <div className="flex space-x-4">
            <button className="hover:text-gray-800 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="hover:text-gray-800 transition-colors">
              <Users className="h-5 w-5" />
            </button>
            <button className="hover:text-gray-800 transition-colors">
              <Calendar className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}