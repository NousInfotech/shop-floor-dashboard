'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import PageHeader from '@/components/layout/page-header';
import { Eye, X, Filter, Search, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ProductSiteData } from '@/types';

export default function ProductSitesPage() {
  const { productSites }: { productSites: ProductSiteData[] } = useSelector(
    (state: RootState) => state.data
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductSiteData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [lotFilter, setLotFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [serialFilter, setSerialFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [showFilters, setShowFilters] = useState(false);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setStockFilter('all');
    setLotFilter('all');
    setSerialFilter('all');
  };

  const filteredData = productSites
    .filter((item) =>
      searchQuery
        ? item.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .filter((item) =>
      statusFilter === 'all'
        ? true
        : item.status.toLowerCase() === statusFilter.toLowerCase()
    )
    .filter((item) =>
      stockFilter === 'all'
        ? true
        : (item.stockManaged === 'Yes') === (stockFilter === 'yes')
    )
    .filter((item) =>
      lotFilter === 'all'
        ? true
        : (item.lotManagement === 'Yes') === (lotFilter === 'yes')
    )
    .filter((item) =>
      serialFilter === 'all'
        ? true
        : (item.serialNoManagement === 'Yes') === (serialFilter === 'yes')
    );

  const viewDetails = (product: ProductSiteData) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (stockFilter !== 'all') count++;
    if (lotFilter !== 'all') count++;
    if (serialFilter !== 'all') count++;
    return count;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Product Sites"
        description="View and manage product configuration for manufacturing sites."
        isReadOnly={true}
        onSearch={handleSearchChange}
        searchValue={searchQuery}
      />

      <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3">
          {['all', 'active', 'inactive'].map((status) => (
            <Button
              key={status}
              variant="ghost"
              size="sm"
              className={`rounded-full px-5 transition-all ${
                statusFilter === status 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setStatusFilter(status as 'all' | 'active' | 'inactive')}
            >
              {status === 'active' && <CheckCircle className="h-4 w-4 mr-1" />}
              {status === 'inactive' && <XCircle className="h-4 w-4 mr-1" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
        
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={`rounded-full bg-white px-5 flex items-center ${
                getActiveFiltersCount() > 0 ? 'border-blue-500 text-blue-500' : ''
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-white">
         
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Managed</label>
                <Select value={stockFilter} onValueChange={(value: string) => setStockFilter(value as "all" | "yes" | "no")}

>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Lot Management</label>
                <Select value={lotFilter} onValueChange={(value: string) => setLotFilter(value as "all" | "yes" | "no")}
>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                    <SelectContent className='bg-white'>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Serial No Management</label>
                <Select value={serialFilter} onValueChange={(value: string) => setSerialFilter(value as "all" | "yes" | "no")}
>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                   <SelectContent className='bg-white'>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => setShowFilters(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Card className="shadow-sm rounded-xl overflow-hidden bg-white" id="export-section">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200 text-gray-900 text-xs uppercase tracking-wider">
              <tr>
                {[
                  'Product Code',
                  'Description',
                  'Ref Code',
                  'Status',
                  'Stock Managed',
                  'Lot Management',
                  'Serial No Management',
                  '',
                ].map((header) => (
                  <th key={header} className="px-5 py-4 font-semibold text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4 text-blue-600 font-medium">
                      {item.productCode}
                    </td>
                    <td className="px-5 py-4">{item.description}</td>
                    <td className="px-5 py-4">{item.refCode}</td>
                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 ${
                          item.status === 'Active'
                            ? 'bg-green-50 text-green-700 border-0'
                            : 'bg-gray-50 text-gray-700 border-0'
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 ${
                          item.stockManaged === 'Yes'
                            ? 'bg-blue-50 text-blue-700 border-0'
                            : 'bg-gray-50 text-gray-700 border-0'
                        }`}
                      >
                        {item.stockManaged}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 ${
                          item.lotManagement === 'Yes'
                            ? 'bg-purple-50 text-purple-700 border-0'
                            : 'bg-gray-50 text-gray-700 border-0'
                        }`}
                      >
                        {item.lotManagement}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 ${
                          item.serialNoManagement === 'Yes'
                            ? 'bg-amber-50 text-amber-700 border-0'
                            : 'bg-gray-50 text-gray-700 border-0'
                        }`}
                      >
                        {item.serialNoManagement}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => viewDetails(item)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center">
                      <Search className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="mb-1 font-medium">No products found</p>
                      <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dialog for Details */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl rounded-lg p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Product Details</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>

          {selectedProduct && (
            <Tabs defaultValue="details" className="px-6 pb-6">
              <TabsList className="grid w-full grid-cols-3 mt-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="details" 
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Basic Details
                </TabsTrigger>
                <TabsTrigger 
                  value="configuration" 
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Configuration
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 font-medium">Product Code</h3>
                    <p className="font-medium">{selectedProduct.productCode}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 font-medium">Description</h3>
                    <p>{selectedProduct.description}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 font-medium">Description 2</h3>
                    <p>{selectedProduct.desc2 || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 font-medium">Ref Code</h3>
                    <p>{selectedProduct.refCode}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-500 font-medium">Status</h3>
                    <Badge
                      variant="outline"
                      className={`rounded-full px-3 py-1 ${
                        selectedProduct.status === 'Active'
                          ? 'bg-green-50 text-green-700 border-0'
                          : 'bg-gray-50 text-gray-700 border-0'
                      }`}
                    >
                      {selectedProduct.status}
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="configuration" className="mt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">
                      Stock Management
                    </h3>
                    <Badge
                      variant="outline"
                      className={`rounded-full px-3 py-1 ${
                        selectedProduct.stockManaged === 'Yes'
                          ? 'bg-blue-50 text-blue-700 border-0'
                          : 'bg-gray-50 text-gray-700 border-0'
                      }`}
                    >
                      {selectedProduct.stockManaged}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Lot Management</h3>
                    <Badge
                      variant="outline"
                      className={`rounded-full px-3 py-1 ${
                        selectedProduct.lotManagement === 'Yes'
                          ? 'bg-purple-50 text-purple-700 border-0'
                          : 'bg-gray-50 text-gray-700 border-0'
                      }`}
                    >
                      {selectedProduct.lotManagement}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">
                      Serial No Management
                    </h3>
                    <Badge
                      variant="outline"
                      className={`rounded-full px-3 py-1 ${
                        selectedProduct.serialNoManagement === 'Yes'
                          ? 'bg-amber-50 text-amber-700 border-0'
                          : 'bg-gray-50 text-gray-700 border-0'
                      }`}
                    >
                      {selectedProduct.serialNoManagement}
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Calendar className="h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No history data available</p>
                  <p className="text-gray-400 text-sm mt-1">History records will appear here when available</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}