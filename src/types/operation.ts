// types/operation.ts
export interface Operation {
    id: string;
    name: string;
    workCenter: string;
     status: "RUNNING" | "PENDING" | "COMPLETED" | "PAUSED" | "INDIRECT" | "BREAK";
    startTime?: string;
    completedAt?: string;
    timer: string;
  }