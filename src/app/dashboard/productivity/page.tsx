"use client";
import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, Activity } from 'lucide-react';
import MetricCard from '@/components/production/MetricCard';
import WorkOrderCard from '@/components/production/WorkOrderCard';
import QualityBatchCard from '@/components/production/QualityBatchCard';
import AnimatedBarChart from '@/components/production/AnimatedBarChart';
import mockProductionData from '@/data/mockProductionData';

const ProductionDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('Day');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading production data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Production</h1>
              <p className="text-gray-600">Monitor and track production metrics and activities</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200">
            {['Day', 'Week', 'Month'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  timeFilter === filter
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Production"
            value={mockProductionData.totalProduction}
            change={mockProductionData.productionGrowth}
            icon={BarChart3}
          />
          <MetricCard
            title="Avg. Production Rate"
            value={mockProductionData.avgProductionRate}
            change={mockProductionData.rateGrowth}
            icon={Activity}
            suffix="/hr"
          />
          <MetricCard
            title="Quality Score"
            value={mockProductionData.qualityScore}
            change={mockProductionData.qualityGrowth}
            icon={AlertTriangle}
            suffix="%"
          />
        </div>

        {/* Charts and Work Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Work Orders */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Work Orders</h3>
            <div className="space-y-4">
              {mockProductionData.activeWorkOrders.map((order) => (
                <WorkOrderCard key={order.id} order={order} />
              ))}
              {mockProductionData.qualityBatches.map((batch) => (
                <QualityBatchCard key={batch.id} batch={batch} />
              ))}
            </div>
          </div>

          {/* Production Rate Chart */}
          <AnimatedBarChart
            data={mockProductionData.productionRateData}
            title="Production Rate"
            yAxisLabel=""
          />

          {/* Quality Score Chart */}
          <AnimatedBarChart
            data={mockProductionData.qualityScoreData}
            title="Quality Score"
            yAxisLabel="%"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductionDashboard;
