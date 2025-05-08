'use client';

import { Play, Pause, SkipForward, CheckSquare, Coffee, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onComplete?: () => void;
  onBreak?: () => void;
  onIndirect?: () => void;
//   isRunning?: boolean;
//   status?: string;  
}

export function ActionButtons({
  onStart,
  onPause,
  onResume,
  onComplete,
  onBreak,
  onIndirect,
//   isRunning = false,
//   status,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={onStart}
        variant="outline"
        className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white border-green-600"
      >
        <Play size={16} />
        <span>Start</span>
      </Button>
      
      <Button
        onClick={onPause}
        variant="outline"
        className="flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 text-amber-500 border-amber-200"
      >
        <Pause size={16} />
        <span>Pause</span>
      </Button>
      
      <Button
        onClick={onResume}
        variant="outline"
        className="flex items-center space-x-1 bg-green-50 hover:bg-green-100 text-green-500 border-green-200"
      >
        <SkipForward size={16} />
        <span>Resume</span>
      </Button>
      
      <Button
        onClick={onComplete}
        variant="outline"
        className="flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 text-blue-500 border-blue-200"
      >
        <CheckSquare size={16} />
        <span>Complete</span>
      </Button>
      
      <Button
        onClick={onBreak}
        variant="outline"
        className="flex items-center space-x-1 bg-rose-50 hover:bg-rose-100 text-rose-500 border-rose-200"
      >
        <Coffee size={16} />
        <span>Break</span>
      </Button>
      
      <Button
        onClick={onIndirect}
        variant="outline"
        className="flex items-center space-x-1 bg-gray-50 hover:bg-gray-100 text-gray-500 border-gray-200"
      >
        <FileText size={16} />
        <span>Indirect</span>
      </Button>
    </div>
  );
}