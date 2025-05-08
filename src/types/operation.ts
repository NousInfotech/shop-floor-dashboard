// types/operation.ts
export interface Operation {
    id: string;
    name: string;
    workCenter: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED';
    startTime?: string;
    completedAt?: string;
    timer: string;
  }