'use client';

import { useState, useRef } from 'react';
import { 
  ClipboardList, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Printer,
  Download,
  Search
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
//   DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define types for our data structures
interface PickListItem {
  itemId: string;
  desc: string;
  quantity: number;
  uom: string;
  location: string;
  picked: boolean;
}

interface PickList {
  pickListId: string;
  workOrderId: string;
  productName: string;
  requestedBy: string;
  requiredDate: string;
  status: string;
  items: PickListItem[];
}

interface UomData {
  code: string;
  name: string;
  description: string;
  type: string;
  active: boolean;
}

export default function PickListPage() {
  // Sample data - would normally come from your Redux store or API
  const initialPickLists: PickList[] = [
    {
      pickListId: 'PL-2025-0042',
      workOrderId: 'WO-2025-0104',
      productName: 'Industrial Hydraulic Pump Assembly',
      requestedBy: 'Sarah Johnson',
      requiredDate: '2025-05-18',
      status: 'Ready',
      items: [
        { itemId: 'COMP-1042', desc: 'Hydraulic Pump Motor', quantity: 1, uom: 'EA', location: 'A-12-C3', picked: false },
        { itemId: 'COMP-2856', desc: 'Pressure Relief Valve', quantity: 2, uom: 'EA', location: 'B-04-D1', picked: false },
        { itemId: 'COMP-0473', desc: 'O-Ring Seal Kit', quantity: 1, uom: 'KIT', location: 'C-08-A2', picked: false }
      ]
    },
    {
      pickListId: 'PL-2025-0041',
      workOrderId: 'WO-2025-0103',
      productName: 'High-Speed Centrifugal Fan',
      requestedBy: 'Michael Chang',
      requiredDate: '2025-05-16',
      status: 'In Progress',
      items: [
        { itemId: 'COMP-3741', desc: 'Fan Blade Assembly', quantity: 1, uom: 'EA', location: 'D-15-B4', picked: true },
        { itemId: 'COMP-0964', desc: 'Ball Bearing Set', quantity: 2, uom: 'SET', location: 'A-07-C5', picked: true },
        { itemId: 'COMP-2391', desc: 'Motor Coupling', quantity: 1, uom: 'EA', location: 'B-11-D3', picked: false }
      ]
    },
    {
      pickListId: 'PL-2025-0040',
      workOrderId: 'WO-2025-0102',
      productName: 'Automated Conveyor System Module',
      requestedBy: 'Emma Rodriguez',
      requiredDate: '2025-05-17',
      status: 'Pending',
      items: [
        { itemId: 'COMP-5263', desc: 'Drive Roller Assembly', quantity: 4, uom: 'EA', location: 'E-05-A1', picked: false },
        { itemId: 'COMP-1738', desc: 'Control Panel Unit', quantity: 1, uom: 'EA', location: 'C-12-B2', picked: false },
        { itemId: 'COMP-4982', desc: 'Proximity Sensor', quantity: 6, uom: 'EA', location: 'D-09-C4', picked: false }
      ]
    },
    {
      pickListId: 'PL-2025-0039',
      workOrderId: 'WO-2025-0101',
      productName: 'Precision Machining Tool Set',
      requestedBy: 'James Wilson',
      requiredDate: '2025-05-15',
      status: 'Completed',
      items: [
        { itemId: 'COMP-6752', desc: 'Carbide Drill Bit Set', quantity: 1, uom: 'SET', location: 'F-03-D5', picked: true },
        { itemId: 'COMP-3105', desc: 'Tool Holder Assembly', quantity: 2, uom: 'EA', location: 'B-08-A3', picked: true },
        { itemId: 'COMP-4276', desc: 'Cutting Fluid Reservoir', quantity: 1, uom: 'EA', location: 'C-14-B1', picked: true }
      ]
    }
  ];

  const uomData: UomData[] = [
    { code: 'EA', name: 'Each', description: 'Individual item count', type: 'Count', active: true },
    { code: 'KG', name: 'Kilogram', description: 'Metric weight measure', type: 'Weight', active: true },
    { code: 'L', name: 'Liter', description: 'Metric volume measure', type: 'Volume', active: true },
    { code: 'M', name: 'Meter', description: 'Metric length measure', type: 'Length', active: true },
    { code: 'M2', name: 'Square Meter', description: 'Metric area measure', type: 'Area', active: true },
    { code: 'BOX', name: 'Box', description: 'Standard packaging container', type: 'Package', active: true },
    { code: 'CS', name: 'Case', description: 'Multiple item container', type: 'Package', active: true },
    { code: 'SET', name: 'Set', description: 'Predefined group of items', type: 'Count', active: true },
    { code: 'KIT', name: 'Kit', description: 'Assembly package of components', type: 'Package', active: true },
    { code: 'FT', name: 'Foot', description: 'Imperial length measure', type: 'Length', active: false },
    { code: 'GAL', name: 'Gallon', description: 'Imperial volume measure', type: 'Volume', active: false },
    { code: 'LB', name: 'Pound', description: 'Imperial weight measure', type: 'Weight', active: true }
  ];

  // State
  const [pickLists, setPickLists] = useState<PickList[]>(initialPickLists);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPickList, setExpandedPickList] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('picklists');
  const [uomSearchQuery, setUomSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [uomTypeFilter, setUomTypeFilter] = useState('All');
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [selectedPickListId, setSelectedPickListId] = useState<string | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const printRef = useRef<HTMLDivElement>(null);

  // Filters and search
  const filteredPickLists = pickLists.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.pickListId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.workOrderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredUoms = uomData.filter(item => {
    const matchesSearch = uomSearchQuery === '' || 
      item.code.toLowerCase().includes(uomSearchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(uomSearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(uomSearchQuery.toLowerCase());
    
    const matchesType = uomTypeFilter === 'All' || item.type === uomTypeFilter;
    
    return matchesSearch && matchesType;
  });

  // Toggle expanding a pick list
  const toggleExpand = (pickListId: string) => {
    if (expandedPickList === pickListId) {
      setExpandedPickList(null);
    } else {
      setExpandedPickList(pickListId);
    }
  };

  // Mark an item as picked
  const toggleItemPicked = (pickListId: string, itemId: string) => {
    setPickLists(prevPickLists => 
      prevPickLists.map(pickList => {
        if (pickList.pickListId === pickListId) {
          return {
            ...pickList,
            items: pickList.items.map(item => {
              if (item.itemId === itemId) {
                return { ...item, picked: !item.picked };
              }
              return item;
            })
          };
        }
        return pickList;
      })
    );
  };

  // Open dialog to confirm marking a pick list as complete
  const openCompleteDialog = (pickListId: string) => {
    setSelectedPickListId(pickListId);
    setIsCompleteDialogOpen(true);
  };

  // Mark a pick list as complete
  const markAsComplete = () => {
    setPickLists(prevPickLists => 
      prevPickLists.map(pickList => {
        if (pickList.pickListId === selectedPickListId) {
          // Mark all items as picked
          const updatedItems = pickList.items.map(item => ({ ...item, picked: true }));
          return {
            ...pickList,
            status: 'Completed',
            items: updatedItems
          };
        }
        return pickList;
      })
    );
    
    setIsCompleteDialogOpen(false);
    toast.success(`Pick List ${selectedPickListId} has been marked as completed.`, {
      duration: 3000,
    });
  };

  // Print functionality
  const handlePrint = (pickListId?: string) => {
    // In a real app, we'd use a library like react-to-print
    // This is a simulation
    toast.info(pickListId 
      ? `Printing Pick List ${pickListId}` 
      : "Printing all visible pick lists", {
      duration: 3000,
    });
    
    // In real implementation:
    // const printContent = printRef.current;
    // window.print();
  };

  // Export functionality
  const handleExport = () => {
    setExportDialogOpen(false);
    
    toast.info(`Exporting data as ${exportFormat.toUpperCase()}`, {
      duration: 3000,
    });
    
    // In a real app, we'd create and download the file
    // This simulates that behavior
    setTimeout(() => {
      const fileName = activeTab === 'picklists' 
        ? `pick-lists-export-${new Date().toISOString().slice(0,10)}.${exportFormat}`
        : `uom-export-${new Date().toISOString().slice(0,10)}.${exportFormat}`;
        
      toast.success(`File "${fileName}" has been downloaded.`, {
        duration: 3000,
      });
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-blue-50 text-blue-700';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700';
      case 'Pending':
        return 'bg-purple-50 text-purple-700';
      case 'Completed':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Shop Floor Management</h1>
            <p className="text-sm text-gray-500">Manage pick lists and units of measure for production</p>
          </div>
          <TabsList className="grid grid-cols-2 w-full md:w-auto">
            <TabsTrigger value="picklists" className="px-4 py-2">
              Pick Lists
            </TabsTrigger>
            <TabsTrigger value="uom" className="px-4 py-2">
              Units of Measure
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="picklists" className="mt-0">
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b">
              <div className="relative w-full md:w-96 mb-4 md:mb-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search pick lists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter {statusFilter !== 'All' && `(${statusFilter})`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className='bg-white'>
                    <DropdownMenuCheckboxItem 
                      checked={statusFilter === 'All'}
                      onCheckedChange={() => setStatusFilter('All')}
                    >
                      All Statuses
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={statusFilter === 'Ready'}
                      onCheckedChange={() => setStatusFilter('Ready')}
                    >
                      Ready
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={statusFilter === 'In Progress'}
                      onCheckedChange={() => setStatusFilter('In Progress')}
                    >
                      In Progress
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={statusFilter === 'Pending'}
                      onCheckedChange={() => setStatusFilter('Pending')}
                    >
                      Pending
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={statusFilter === 'Completed'}
                      onCheckedChange={() => setStatusFilter('Completed')}
                    >
                      Completed
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10"
                  onClick={() => handlePrint()}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10"
                  onClick={() => setExportDialogOpen(true)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto" ref={printRef}>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-4 font-medium text-left"></th>
                    <th className="px-4 py-4 font-medium text-left">Pick List ID</th>
                    <th className="px-4 py-4 font-medium text-left">Work Order</th>
                    <th className="px-4 py-4 font-medium text-left">Product</th>
                    <th className="px-4 py-4 font-medium text-left">Requested By</th>
                    <th className="px-4 py-4 font-medium text-left">Required Date</th>
                    <th className="px-4 py-4 font-medium text-left">Status</th>
                    <th className="px-4 py-4 font-medium text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPickLists.length > 0 ? (
                    filteredPickLists.map((item, index) => (
                      <>
                        <tr key={`row-${index}`} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleExpand(item.pickListId)}
                              className="p-1 h-8 w-8 rounded-full hover:bg-blue-50"
                            >
                              {expandedPickList === item.pickListId ? 
                                <ChevronDown className="h-4 w-4 text-blue-600" /> : 
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                              }
                            </Button>
                          </td>
                          <td className="px-4 py-4 font-medium text-blue-600">{item.pickListId}</td>
                          <td className="px-4 py-4">{item.workOrderId}</td>
                          <td className="px-4 py-4">{item.productName}</td>
                          <td className="px-4 py-4">{item.requestedBy}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-gray-400" />
                              {item.requiredDate}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              variant="outline"
                              className={`rounded-full px-3 py-1 border-0 ${getStatusColor(item.status)}`}
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-blue-50 hover:text-blue-600"
                              disabled={item.status === 'Completed'}
                            >
                              <ClipboardList className="h-4 w-4 mr-1" />
                              Process
                            </Button>
                          </td>
                        </tr>
                        {expandedPickList === item.pickListId && (
                          <tr key={`expanded-${index}`}>
                            <td colSpan={8} className="p-0">
                              <div className="bg-blue-50 p-4 lg:p-6 border-t border-b border-blue-100">
                                <h4 className="text-sm font-medium mb-3 text-blue-800 flex items-center">
                                  <ClipboardList className="h-4 w-4 mr-2" />
                                  Items to Pick
                                </h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm bg-white rounded-lg shadow-sm overflow-hidden">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                      <tr>
                                        <th className="px-4 py-3 font-medium text-left">Item ID</th>
                                        <th className="px-4 py-3 font-medium text-left">Description</th>
                                        <th className="px-4 py-3 font-medium text-left">Quantity</th>
                                        <th className="px-4 py-3 font-medium text-left">UOM</th>
                                        <th className="px-4 py-3 font-medium text-left">Location</th>
                                        <th className="px-4 py-3 font-medium text-left">Status</th>
                                        <th className="px-4 py-3 font-medium text-left">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                      {item.items.map((material, idx) => (
                                        <tr key={`item-${idx}`} className="hover:bg-gray-50 transition-colors">
                                          <td className="px-4 py-3 font-medium text-blue-600">{material.itemId}</td>
                                          <td className="px-4 py-3">{material.desc}</td>
                                          <td className="px-4 py-3">{material.quantity}</td>
                                          <td className="px-4 py-3">{material.uom}</td>
                                          <td className="px-4 py-3">
                                            <Badge variant="outline" className="bg-gray-100 border-0">
                                              {material.location}
                                            </Badge>
                                          </td>
                                          <td className="px-4 py-3">
                                            {material.picked ? (
                                              <Badge variant="outline" className="bg-green-50 text-green-700 border-0 flex items-center">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Picked
                                              </Badge>
                                            ) : (
                                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-0 flex items-center">
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Not Picked
                                              </Badge>
                                            )}
                                          </td>
                                          <td className="px-4 py-3">
                                            {item.status !== 'Completed' && (
                                              <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="hover:bg-green-50 hover:text-green-600 text-xs"
                                                onClick={() => toggleItemPicked(item.pickListId, material.itemId)}
                                              >
                                                {material.picked ? 'Unpick' : 'Mark Picked'}
                                              </Button>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="flex justify-end mt-4">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mr-2"
                                    onClick={() => handlePrint(item.pickListId)}
                                  >
                                    <Printer className="h-4 w-4 mr-1" />
                                    Print Pick List
                                  </Button>
                                  {item.status !== 'Completed' && (
                                    <Button 
                                      size="sm" 
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                      onClick={() => openCompleteDialog(item.pickListId)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Mark as Complete
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        No pick lists match your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="uom" className="mt-0">
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b">
              <div className="relative w-full md:w-96 mb-4 md:mb-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search units of measure..."
                  value={uomSearchQuery}
                  onChange={(e) => setUomSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter by Type {uomTypeFilter !== 'All' && `(${uomTypeFilter})`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className='bg-white'>
                    <DropdownMenuCheckboxItem 
                      checked={uomTypeFilter === 'All'}
                      onCheckedChange={() => setUomTypeFilter('All')}
                    >
                      All Types
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={uomTypeFilter === 'Count'}
                      onCheckedChange={() => setUomTypeFilter('Count')}
                    >
                      Count
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={uomTypeFilter === 'Weight'}
                      onCheckedChange={() => setUomTypeFilter('Weight')}
                    >
                      Weight
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={uomTypeFilter === 'Length'}
                      onCheckedChange={() => setUomTypeFilter('Length')}
                    >
                      Length
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={uomTypeFilter === 'Volume'}
                      onCheckedChange={() => setUomTypeFilter('Volume')}
                    >
                      Volume
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={uomTypeFilter === 'Area'}
                      onCheckedChange={() => setUomTypeFilter('Area')}
                    >
                      Area
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={uomTypeFilter === 'Package'}
                      onCheckedChange={() => setUomTypeFilter('Package')}
                    >
                      Package
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10"
                  onClick={() => setExportDialogOpen(true)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-4 font-medium text-left">UOM Code</th>
                    <th className="px-4 py-4 font-medium text-left">Name</th>
                    <th className="px-4 py-4 font-medium text-left">Description</th>
                    <th className="px-4 py-4 font-medium text-left">Type</th>
                    <th className="px-4 py-4 font-medium text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUoms.length > 0 ? (
                    filteredUoms.map((uom, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 font-medium text-blue-600">{uom.code}</td>
                        <td className="px-4 py-4">{uom.name}</td>
                        <td className="px-4 py-4">{uom.description}</td>
                        <td className="px-4 py-4">
                          <Badge
                            variant="outline"
                            className="rounded-full px-3 py-1 border-0 bg-gray-100 text-gray-700">
                            {uom.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 py-1 border-0 ${
                              uom.active
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {uom.active ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
                            ) : (
                              <><XCircle className="h-3 w-3 mr-1" /> Inactive</>
                            )}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No units of measure match your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mark as Complete Dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Pick List as Complete</DialogTitle>
          </DialogHeader>
          
          {selectedPickListId && (
            <>
              <div className="py-4">
                <p className="mb-4">Are you sure you want to mark pick list <span className="font-medium">{selectedPickListId}</span> as complete?</p>
                
                {pickLists.find(p => p.pickListId === selectedPickListId)?.items.some(item => !item.picked) && (
                  <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertDescription>
                      Some items have not been marked as picked. Proceeding will automatically mark all items as picked.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>Cancel</Button>
                <Button onClick={markAsComplete} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Pick List
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export {activeTab === 'picklists' ? 'Pick Lists' : 'Units of Measure'}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4">Choose export format:</p>
            <div className="flex gap-4">
              <Button 
                variant={exportFormat === 'csv' ? "default" : "outline"} 
                className={exportFormat === 'csv' ? "bg-blue-600 text-white" : ""}
                onClick={() => setExportFormat('csv')}
              >
                CSV
              </Button>
              <Button 
                variant={exportFormat === 'xlsx' ? "default" : "outline"}
                className={exportFormat === 'xlsx' ? "bg-blue-600 text-white" : ""}
                onClick={() => setExportFormat('xlsx')}
              >
                Excel (XLSX)
              </Button>
              <Button 
                variant={exportFormat === 'pdf' ? "default" : "outline"}
                className={exportFormat === 'pdf' ? "bg-blue-600 text-white" : ""}
                onClick={() => setExportFormat('pdf')}
              >
                PDF
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}