'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import PageHeader from '@/components/layout/page-header';
import { Eye, ChevronDown, ChevronRight, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function RoutingPage() {
  const { routing } = useSelector((state: RootState) => state.data);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRouting, setExpandedRouting] = useState<string | null>(null);
  
  const filteredData = searchQuery 
    ? routing.filter(item => 
        item.routingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc1.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : routing;

  const toggleExpand = (routingCode: string) => {
    if (expandedRouting === routingCode) {
      setExpandedRouting(null);
    } else {
      setExpandedRouting(routingCode);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader 
        title="Routing" 
        description="View and manage routing operations for manufacturing processes."
        isReadOnly={true}
        onSearch={(e) => setSearchQuery(e.target.value)}
        searchValue={searchQuery}
      />
      
      <Card className="shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 font-medium text-left"></th>
                <th className="px-5 py-4 font-medium text-left">Routing code</th>
                <th className="px-5 py-4 font-medium text-left">Description</th>
                <th className="px-5 py-4 font-medium text-left">Base qty</th>
                <th className="px-5 py-4 font-medium text-left">Units</th>
                <th className="px-5 py-4 font-medium text-left">Start date</th>
                <th className="px-5 py-4 font-medium text-left">End date</th>
                <th className="px-5 py-4 font-medium text-left">Status</th>
                <th className="px-5 py-4 font-medium text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item, index) => (
                <>
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleExpand(item.routingCode)}
                        className="p-1 h-8 w-8 rounded-full hover:bg-blue-50"
                      >
                        {expandedRouting === item.routingCode ? 
                          <ChevronDown className="h-4 w-4 text-blue-600" /> : 
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        }
                      </Button>
                    </td>
                    <td className="px-5 py-4 font-medium text-blue-600">{item.routingCode}</td>
                    <td className="px-5 py-4">{item.desc1}</td>
                    <td className="px-5 py-4">{item.baseQty}</td>
                    <td className="px-5 py-4">{item.units}</td>
                    <td className="px-5 py-4">{item.startDate}</td>
                    <td className="px-5 py-4">{item.endDate}</td>
                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 ${
                          item.status === 'Active'
                            ? 'bg-green-50 text-green-700 border-0'
                            : 'bg-gray-50 text-gray-700 border-0'
                        }`}
                      >
                        {item.status === 'Active' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {item.status !== 'Active' && <XCircle className="h-3 w-3 mr-1" />}
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                  {expandedRouting === item.routingCode && (
                    <tr>
                      <td colSpan={9} className="p-0">
                        <div className="bg-blue-50 p-6 border-t border-b border-blue-100">
                          <h4 className="text-sm font-medium mb-3 text-blue-800 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Operations
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm bg-white rounded-lg shadow-sm overflow-hidden">
                              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                  <th className="px-4 py-3 font-medium text-left">Ope no</th>
                                  <th className="px-4 py-3 font-medium text-left">Labor Work centre</th>
                                  <th className="px-4 py-3 font-medium text-left">Unit time</th>
                                  <th className="px-4 py-3 font-medium text-left">Machine Centre</th>
                                  <th className="px-4 py-3 font-medium text-left">Machine time</th>
                                  <th className="px-4 py-3 font-medium text-left">Expected setup time</th>
                                  <th className="px-4 py-3 font-medium text-left">Expected runtime</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {item.operations.map((operation, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium">{operation.operationNo}</td>
                                    <td className="px-4 py-3">{operation.laborWorkCentre}</td>
                                    <td className="px-4 py-3">{operation.unitTime}</td>
                                    <td className="px-4 py-3">{operation.machineCentre}</td>
                                    <td className="px-4 py-3">{operation.machineTime}</td>
                                    <td className="px-4 py-3">{operation.expectedSetupTime}</td>
                                    <td className="px-4 py-3">{operation.expectedRuntime}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}