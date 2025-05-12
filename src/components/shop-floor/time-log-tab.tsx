'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { WorkOrder } from '@/types/work-order';
import { Clock, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface TimeLog {
  timestamp: string;
  operationId: string;
  action: string;
  description: string;
}

interface TimeLogTabProps {
  workOrder: WorkOrder;
  timeLog?: TimeLog[];
}

export default function TimeLogTab({ timeLog = [] }: TimeLogTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter logs based on search term
  const filteredLogs = timeLog.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.operationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2 flex items-center">
          <Clock className="mr-2" size={20} />
          Time Log History
        </h3>
        <p className="text-gray-500">Record of all actions and events</p>
      </div>
      
      <div className="flex mb-4 items-center gap-2">
        <div className="relative flex-1">
          <Input 
            type="text" 
            placeholder="Search logs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-medium">Time</TableHead>
              <TableHead className="font-medium">Operation</TableHead>
              <TableHead className="font-medium">Action</TableHead>
              <TableHead className="font-medium">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="text-sm">{log.timestamp}</TableCell>
                  <TableCell className="text-sm">{log.operationId}</TableCell>
                  <TableCell className="text-sm font-medium">{log.action}</TableCell>
                  <TableCell className="text-sm">{log.description}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center">
                    <Clock size={40} className="text-gray-300 mb-2" />
                    <p>No time logs recorded yet</p>
                    <p className="text-sm text-gray-400">Logs will appear as you perform actions</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}