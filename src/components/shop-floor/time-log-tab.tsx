'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { WorkOrder } from '@/types/work-order';
import { TimeLog } from '@/types/time-log'; // Import the TimeLog interface

interface TimeLogTabProps {
  workOrder: WorkOrder;
}

// export default function TimeLogTab({ workOrder }: TimeLogTabProps) {
    
export default function TimeLogTab({ }: TimeLogTabProps) {
  // For this example, we'll use a placeholder for time logs
  // In a real application, you would fetch this data from an API or state management
  const timeLogs: TimeLog[] = []; // Define the timeLogs array with the correct type

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Time Log History</h3>
        <p className="text-gray-500">Record of all actions and events</p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Operation</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeLogs.length > 0 ? (
            timeLogs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.operationId}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.description}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No time logs recorded yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
