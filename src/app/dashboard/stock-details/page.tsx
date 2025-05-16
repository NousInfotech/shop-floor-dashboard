'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import PageHeader from '@/components/layout/page-header';
import {  Search, Package, Database, Beaker } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { qcData } from '@/data/qc-data';

export default function StockDetailsPage() {
  const { stockDetails } = useSelector((state: RootState) => state.data);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  const filteredData = searchQuery 
    ? stockDetails.filter(item => 
        item.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc1.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stockDetails;

  const selectedProductData = selectedProduct 
    ? stockDetails.find(item => item.productCode === selectedProduct)
    : null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader 
        title="Stock Details" 
        description="View and manage stock unit conversions and details."
        isReadOnly={true}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="shadow-sm rounded-xl overflow-hidden bg-white">
            <div className="p-5">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Package className="h-4 w-4 mr-2 text-blue-600" />
                Products
              </h3>
              <div className="relative mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9 bg-gray-50 border-0 focus:ring-blue-500 focus:ring-1"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-y-auto max-h-96 divide-y divide-gray-100 -mx-5">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <div 
                      key={index} 
                      className={`px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedProduct === item.productCode ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedProduct(item.productCode)}
                    >
                      <div className="font-medium text-blue-600">{item.productCode}</div>
                      <div className="text-sm text-gray-600 mt-1">{item.desc1}</div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
                    <Search className="h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium">No products found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          {selectedProductData ? (
            <Card className="shadow-sm rounded-xl overflow-hidden bg-white">
              <Tabs defaultValue="units">
                <div className="px-5 pt-5 pb-0 border-b border-gray-100">
                  <TabsList className="bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="units" 
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Units
                    </TabsTrigger>
                    <TabsTrigger 
                      value="qc" 
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center"
                    >
                      <Beaker className="h-4 w-4 mr-2" />
                      QC/QA
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="units" className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Product Code</label>
                        <Input 
                          className="bg-gray-50 border-0 focus:ring-blue-500"
                          value={selectedProductData.productCode} 
                          readOnly 
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Description</label>
                        <Input 
                          className="bg-gray-50 border-0 focus:ring-blue-500"
                          value={selectedProductData.desc1} 
                          readOnly 
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Stock Unit</label>
                        <Input 
                          className="bg-gray-50 border-0 focus:ring-blue-500"
                          value={selectedProductData.stockUnit} 
                          readOnly 
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Sales Unit</label>
                        <Input 
                          className="bg-gray-50 border-0 focus:ring-blue-500"
                          value={selectedProductData.salesUnit} 
                          readOnly 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Purchase Unit</label>
                        <Input 
                          className="bg-gray-50 border-0 focus:ring-blue-500"
                          value={selectedProductData.purchaseUnit} 
                          readOnly 
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Purchase-Stock Conversion</label>
                        <Input 
                          className="bg-gray-50 border-0 focus:ring-blue-500"
                          value={selectedProductData.purchaseStockConversion} 
                          readOnly 
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Sales-Stock Conversion</label>
                        <Input 
                          className="bg-gray-50 border-0 focus:ring-blue-500"
                          value={selectedProductData.salesStockConversion} 
                          readOnly 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">Packing Unit</label>
                          <Input 
                            className="bg-gray-50 border-0 focus:ring-blue-500"
                            value={selectedProductData.packingUnit} 
                            readOnly 
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">Pack to Stock</label>
                          <Input 
                            className="bg-gray-50 border-0 focus:ring-blue-500"
                            value={selectedProductData.packToStock} 
                            readOnly 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="qc" className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">QC Management</label>
                        <div className="mt-1">
                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 py-1 ${
                              qcData[0].qcManagement === 'Yes'
                                ? 'bg-purple-50 text-purple-700 border-0'
                                : 'bg-gray-50 text-gray-700 border-0'
                            }`}
                          >
                            {qcData[0].qcManagement}
                          </Badge>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Default Status</label>
                        <Input 
                          className="bg-gray-50 border-0 focus:ring-blue-500"
                          value={qcData[0].defaultStatus} 
                          readOnly 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Technical Sheet</label>
                        <Input 
                          className="bg-gray-50 border-0 focus:ring-blue-500"
                          value={qcData[0].technicalSheet} 
                          readOnly 
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          ) : (
            <Card className="shadow-sm rounded-xl overflow-hidden bg-white">
              <CardContent className="p-10 flex flex-col items-center justify-center">
                <Package className="h-14 w-14 text-gray-200 mb-4" />
                <p className="text-gray-500 font-medium">Select a product to view details</p>
                <p className="text-gray-400 text-sm mt-1">Choose from the list on the left</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}