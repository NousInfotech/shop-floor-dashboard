'use client';

import { useState } from 'react';
import { Play, CheckSquare, Coffee, FileText, Pause, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  initialStatus?: string;
  onStatusChange?: (newStatus: string) => void;
  disabled?: boolean;
}

export function ActionButtons({
  initialStatus = 'PENDING',
  onStatusChange,
  disabled = false,
}: ActionButtonsProps) {
  const [status, setStatus] = useState(initialStatus);
  
  const handleAction = (actionType: string) => {
    let newStatus = '';
    
    switch (actionType) {
      case 'start':
        newStatus = 'RUNNING';
        break;
      case 'pause':
        newStatus = 'PAUSED';
        break;
      case 'resume':
        newStatus = 'RUNNING';
        break;
      case 'complete':
        newStatus = 'COMPLETED';
        break;
      case 'break':
        newStatus = 'BREAK';
        break;
      case 'indirect':
        newStatus = 'INDIRECT';
        break;
      default:
        newStatus = status;
    }
    
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg shadow-sm">
      <Button
        onClick={() => handleAction('start')}
        variant="outline"
        disabled={disabled || status === 'RUNNING' || status === 'COMPLETED'}
        className={`flex items-center space-x-1 ${
          status !== 'RUNNING' && status !== 'COMPLETED'
            ? 'bg-green-500 hover:bg-green-600 text-white border-green-600'
            : 'bg-gray-100 text-gray-400 border-gray-300'
        }`}
      >
        <Play size={16} />
        <span>Start</span>
      </Button>
      
      <Button
        onClick={() => handleAction('pause')}
        variant="outline"
        disabled={disabled || status !== 'RUNNING'}
        className={`flex items-center space-x-1 ${
          status === 'RUNNING'
            ? 'bg-amber-50 hover:bg-amber-100 text-amber-500 border-amber-200'
            : 'bg-gray-100 text-gray-400 border-gray-300'
        }`}
      >
        <Pause size={16} />
        <span>Pause</span>
      </Button>
      
      <Button
        onClick={() => handleAction('resume')}
        variant="outline"
        disabled={disabled || status !== 'PAUSED'}
        className={`flex items-center space-x-1 ${
          status === 'PAUSED'
            ? 'bg-green-50 hover:bg-green-100 text-green-500 border-green-200'
            : 'bg-gray-100 text-gray-400 border-gray-300'
        }`}
      >
        <SkipForward size={16} />
        <span>Resume</span>
      </Button>
      
      <Button
        onClick={() => handleAction('complete')}
        variant="outline"
        disabled={disabled || status === 'PENDING' || status === 'COMPLETED'}
        className={`flex items-center space-x-1 ${
          status === 'RUNNING' || status === 'PAUSED'
            ? 'bg-blue-50 hover:bg-blue-100 text-blue-500 border-blue-200'
            : 'bg-gray-100 text-gray-400 border-gray-300'
        }`}
      >
        <CheckSquare size={16} />
        <span>Complete</span>
      </Button>
      
      <Button
        onClick={() => handleAction('break')}
        variant="outline"
        disabled={disabled || status !== 'RUNNING'}
        className={`flex items-center space-x-1 ${
          status === 'RUNNING'
            ? 'bg-rose-50 hover:bg-rose-100 text-rose-500 border-rose-200'
            : 'bg-gray-100 text-gray-400 border-gray-300'
        }`}
      >
        <Coffee size={16} />
        <span>Break</span>
      </Button>
      
      <Button
        onClick={() => handleAction('indirect')}
        variant="outline"
        disabled={disabled || status === 'COMPLETED'}
        className={`flex items-center space-x-1 ${
          status !== 'COMPLETED'
            ? 'bg-gray-50 hover:bg-gray-100 text-gray-500 border-gray-200'
            : 'bg-gray-100 text-gray-400 border-gray-300'
        }`}
      >
        <FileText size={16} />
        <span>Indirect</span>
      </Button>
    </div>
  );
}