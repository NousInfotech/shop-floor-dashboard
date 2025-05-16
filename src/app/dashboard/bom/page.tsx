'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import PageHeader from '@/components/layout/page-header';
import {  ChevronDown, ChevronRight, CheckCircle, XCircle, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BOMPage() {
  const { bom } = useSelector((state: RootState) => state.data);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBOM, setExpandedBOM] = useState<string | null>(null);
  
  const filteredData = searchQuery 
    ? bom.filter(item => 
        item.bomCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc1.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bom;

  const toggleExpand = (bomCode: string) => {
    if (expandedBOM === bomCode) {
      setExpandedBOM(null);
    } else {
      setExpandedBOM(bomCode);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader 
        title="Bill of Materials" 
        description="View and manage bill of materials for production."
        isReadOnly={true}
        onSearch={(e) => setSearchQuery(e.target.value)}
        searchValue={searchQuery}
      />
      
      <Card className="shadow-sm rounded-xl overflow-hidden bg-white"id="export-section">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200 text-gray-900 text-xs uppercase tracking-wider ">
              <tr>
                <th className="px-5 py-4 font-semibold text-left"></th>
                <th className="px-5 py-4 font-semibold text-left">BOM code</th>
                <th className="px-5 py-4 font-semibold text-left">Description</th>
                <th className="px-5 py-4 font-semibold text-left">Base qty</th>
                <th className="px-5 py-4 font-semibold text-left">Units</th>
                <th className="px-5 py-4 font-semibold text-left">Start date</th>
                <th className="px-5 py-4 font-semibold text-left">End date</th>
                <th className="px-5 py-4 font-semibold text-left">Status</th>
                <th className="px-5 py-4 font-semibold text-left"></th>
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
                        onClick={() => toggleExpand(item.bomCode)}
                        className="p-1 h-8 w-8 rounded-full hover:bg-blue-50"
                      >
                        {expandedBOM === item.bomCode ? 
                          <ChevronDown className="h-4 w-4 text-blue-600" /> : 
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        }
                      </Button>
                    </td>
                    <td className="px-5 py-4 font-medium text-blue-600">{item.bomCode}</td>
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
                    {/* <td className="px-5 py-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td> */}
                  </tr>
                  {expandedBOM === item.bomCode && (
                    <tr>
                      <td colSpan={9} className="p-0">
                        <div className="bg-blue-50 p-6 border-t border-b border-blue-100">
                          <h4 className="text-sm font-medium mb-3 text-blue-800 flex items-center">
                            <Package className="h-4 w-4 mr-2" />
                            Components
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm bg-white rounded-lg shadow-sm overflow-hidden">
                              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                  <th className="px-4 py-3 font-medium text-left">Component</th>
                                  <th className="px-4 py-3 font-medium text-left">Description</th>
                                  <th className="px-4 py-3 font-medium text-left">Quantity</th>
                                  <th className="px-4 py-3 font-medium text-left">Unit</th>
                                  <th className="px-4 py-3 font-medium text-left">Ref code</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {item.components.map((component, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-blue-600">{component.component}</td>
                                    <td className="px-4 py-3">{component.description}</td>
                                    <td className="px-4 py-3">{component.quantity}</td>
                                    <td className="px-4 py-3">{component.unit}</td>
                                    <td className="px-4 py-3">{component.refCode}</td>
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