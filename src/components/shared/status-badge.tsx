'use client';

import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: string; // Add the size prop here
}

export function StatusBadge({ status, className, size }: StatusBadgeProps) {
  const getStatusClass = () => {
    switch (status.toUpperCase()) {
      case 'RUNNING':
      case 'ACTIVE':
        return 'bg-green-500 text-white';
      case 'PENDING':
        return 'bg-gray-400 text-white';
      case 'COMPLETED':
        return 'bg-blue-500 text-white';
      case 'INACTIVE':
        return 'bg-red-500 text-white';
      case 'BREAK':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium',
        getStatusClass(),
        className,
        size // Apply the size prop to control the size of the badge if needed
      )}
    >
      {status}
    </span>
  );
}
