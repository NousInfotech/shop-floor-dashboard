'use client'

import { useState, useEffect } from 'react'
import { WorkOrder } from '@/types/work-order'
import { Clock, Filter, Coffee, Pause, Play, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TimeLogEntry {
  timestamp: string;
  operationId: string; // Changed to string to match the expected type
  operationName: string;
  event: string;
  duration: string;
  notes: string;
}

interface CustomTimeLogEntry {
  timestamp: string;
  operationId: string;
  action: string;
  description: string;
}

// Define an interface for break items
interface BreakItem {
  startTime: string;
  duration: string;
  reason: string;
}

// Extend the Operation type to include breaks
interface ExtendedOperation {
  id: string;
  name?: string;
  status?: string;
  workCenter?: string;
  breaks?: BreakItem[];
}

interface TimeLogTabProps {
  workOrder: WorkOrder;
  timeLog?: CustomTimeLogEntry[]; // Add the timeLog prop
}

export default function TimeLogTab({ workOrder, timeLog = [] }: TimeLogTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperation, setSelectedOperation] = useState<string>('all');
  const [timeLogEntries, setTimeLogEntries] = useState<TimeLogEntry[]>([]);
  const [operationOptions, setOperationOptions] = useState<{id: string, name: string}[]>([]);

  // Convert custom timeLog entries to our format
  useEffect(() => {
    if (timeLog && timeLog.length > 0) {
      const customEntries: TimeLogEntry[] = timeLog.map(entry => ({
        timestamp: entry.timestamp,
        operationId: entry.operationId,
        operationName: entry.operationId === 'General' ? 'General' : 
          workOrder.operations?.find(op => op.id === entry.operationId)?.name || entry.operationId,
        event: entry.action.split(' ')[0], // Extract first word as event
        duration: '-',
        notes: entry.description
      }));
      
      setTimeLogEntries(prev => [...customEntries, ...prev]);
    }
  }, [timeLog, workOrder.operations]);

  useEffect(() => {
    if (workOrder && workOrder.operations) {
      // Create options for the operation filter
      const options = [
        { id: 'all', name: 'All Operations' },
        { id: 'General', name: 'General' }
      ];
      
      workOrder.operations.forEach(operation => {
        if (operation && operation.id) {
          options.push({
            id: operation.id.toString(),
            name: `${operation.id}: ${operation.name || ''}`
          });
        }
      });
      
      setOperationOptions(options);

      // Generate time log entries from operations
      const entries: TimeLogEntry[] = [];

      workOrder.operations.forEach(operation => {
        if (!operation) return;

        const opId = operation.id.toString();
        const opName = operation.name || '';

        // Start entry
        entries.push({
          timestamp: new Date().toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }),
          operationId: opId,
          operationName: opName,
          event: 'Start',
          duration: '-',
          notes: 'Operation started'
        });

        // Add break entry if it exists in production data
        const extendedOp = operation as ExtendedOperation;
        if (extendedOp.breaks && extendedOp.breaks.length > 0) {
          extendedOp.breaks.forEach((breakItem: BreakItem) => {
            entries.push({
              timestamp: new Date(breakItem.startTime).toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              }),
              operationId: opId,
              operationName: opName,
              event: 'Break',
              duration: breakItem.duration || '-',
              notes: breakItem.reason || 'Operator break'
            });
          });
        }

        // Add entries based on operation status
        if (operation.status === 'PAUSED') {
          const startTime = new Date();
          startTime.setHours(startTime.getHours() - 1);

          entries.push({
            timestamp: startTime.toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }),
            operationId: opId,
            operationName: opName,
            event: 'Pause',
            duration: '1h 0m',
            notes: 'Paused by operator'
          });
        }

        if (operation.status === 'RUNNING') {
          const startTime = new Date();
          startTime.setMinutes(startTime.getMinutes() - 30); // Assuming operation started 30 minutes ago

          entries.push({
            timestamp: startTime.toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }),
            operationId: opId,
            operationName: opName,
            event: 'Play',
            duration: '30m',
            notes: 'Operation running'
          });
        }

        if (operation.status === 'INDIRECT') {
          const startTime = new Date();
          startTime.setMinutes(startTime.getMinutes() - 45); // Assuming indirect started 45 minutes ago

          entries.push({
            timestamp: startTime.toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }),
            operationId: opId,
            operationName: opName,
            event: 'Indirect',
            duration: '45m',
            notes: 'Indirect work - Machine Setup'
          });
        }

        if (operation.status === 'BREAK') {
          const startTime = new Date();
          startTime.setMinutes(startTime.getMinutes() - 15); // Assuming break started 15 minutes ago

          entries.push({
            timestamp: startTime.toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }),
            operationId: opId,
            operationName: opName,
            event: 'Break',
            duration: '15m',
            notes: 'Coffee break'
          });
        }

        if (operation.status === 'COMPLETED') {
          const completeTime = new Date();
          completeTime.setHours(completeTime.getHours() - 2);

          entries.push({
            timestamp: completeTime.toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }),
            operationId: opId,
            operationName: opName,
            event: 'Complete',
            duration: '2h 0m',
            notes: 'Operation completed successfully'
          });
        }
      });

      // Sort entries by timestamp (newest first)
      entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // setTimeLogEntries(prev => {
      //   // Filter out duplicates when merging
      //   const uniqueEntries = [...entries];
      //   return uniqueEntries;
      // });
    }
  }, [workOrder]);

  // Listen for status changes in operations and add new log entries
  useEffect(() => {
    // This would typically be implemented with a message bus or event emitter
    // For now, this is a placeholder for the real implementation
    // const handleOperationStatusChange = (
    //   operationId: string, 
    //   operationName: string, 
    //   event: string, 
    //   notes: string
    // ) => {
    //   const newEntry: TimeLogEntry = {
    //     timestamp: new Date().toLocaleString('en-US', {
    //       month: '2-digit',
    //       day: '2-digit',
    //       year: 'numeric',
    //       hour: '2-digit',
    //       minute: '2-digit',
    //       second: '2-digit',
    //       hour12: true
    //     }),
    //     operationId,
    //     operationName,
    //     event,
    //     duration: '-',
    //     notes
    //   };
      
    //   setTimeLogEntries(prev => [newEntry, ...prev]);
    // };
    
    // This would be replaced with actual event listeners
    // window.addEventListener('operation-status-change', handleOperationStatusChange);
    
    return () => {
      // window.removeEventListener('operation-status-change', handleOperationStatusChange);
    };
  }, []);

  const filteredLogs = timeLogEntries.filter(entry => {
    const matchesSearch =
      entry.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.operationName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOperation = 
      selectedOperation === 'all' || 
      (selectedOperation === 'General' && entry.operationId === 'General') ||
      entry.operationId === selectedOperation;

    return matchesSearch && matchesOperation;
  });

  // Group logs by date first
  const groupedByDate: Record<string, TimeLogEntry[]> = {};
  
  filteredLogs.forEach(entry => {
    const date = entry.timestamp.split(',')[0]; // Extract date part
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(entry);
  });

  // Event color mapping
  const getEventColor = (event: string) => {
    switch (event.toLowerCase()) {
      case 'start': return 'bg-green-100 text-green-800';
      case 'pause': return 'bg-yellow-100 text-yellow-800';
      case 'break': return 'bg-orange-100 text-orange-800';
      case 'resume': return 'bg-blue-100 text-blue-800'; 
      case 'play': return 'bg-blue-100 text-blue-800';
      case 'complete': return 'bg-blue-100 text-blue-800';
      case 'indirect': return 'bg-purple-100 text-purple-800';
      case 'status': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get icon based on event type
  const getEventIcon = (event: string) => {
    switch (event.toLowerCase()) {
      case 'break': return <Coffee size={14} className="mr-1" />;
      case 'pause': return <Pause size={14} className="mr-1" />;
      case 'play': return <Play size={14} className="mr-1" />;
      case 'indirect': return <FileText size={14} className="mr-1" />;
      case 'complete': return <Clock size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Operation Time Log</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative w-full max-w-md">
          <Input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
        
        <Select
          value={selectedOperation}
          onValueChange={(value) => setSelectedOperation(value)}
        >
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter by operation" />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            {operationOptions.map(op => (
              <SelectItem key={op.id.toString()} value={op.id.toString()}>
                {op.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {Object.keys(groupedByDate).length > 0 ? (
        Object.entries(groupedByDate).map(([date, entries]) => (
          <div key={date} className="mb-8">
            <div className="bg-gray-50 p-4 mb-2 rounded-t-lg">
              <h2 className="text-lg font-medium text-gray-800">{date}</h2>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-100 font-medium">
                <div className="col-span-3">Operation</div>
                <div className="col-span-2">Event</div>
                <div className="col-span-3">Time</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-2">Notes</div>
              </div>

              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 py-3 px-4 border-b border-gray-100 hover:bg-gray-50"
                >
                  <div className="col-span-3 font-medium">
                    {entry.operationId === 'General' ? 'General' : `${entry.operationId}: ${entry.operationName}`}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${getEventColor(entry.event)}`}
                    >
                      {getEventIcon(entry.event)}
                      {entry.event}
                    </span>
                  </div>
                  <div className="col-span-3">{entry.timestamp.split(',')[1]?.trim() || entry.timestamp}</div>
                  <div className="col-span-2">{entry.duration}</div>
                  <div className="col-span-2 truncate" title={entry.notes}>
                    {entry.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Clock className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No time logs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedOperation !== 'all'
              ? 'Try adjusting your search criteria'
              : 'Time logs will appear as operations are performed'}
          </p>
        </div>
      )}
    </div>
  );
}