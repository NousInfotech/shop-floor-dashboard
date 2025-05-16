import { RoutingData } from './../types/index';
export const routingData: RoutingData[] = [
  {
    routingCode: "ROU-001",
    desc1: "Standard Assembly Process",
    baseQty: 10,
    units: "units",
    startDate: "2025-01-15",
    endDate: "2025-12-31",
    status: "Active",
    operations: [
      {
        operationNo: "10",
        laborWorkCentre: "WELD-01",
        unitTime: "5",
        machineCentre: "WLD-M1",
        machineTime: "3",
        expectedSetupTime: "15",
        expectedRuntime: "45"
      },
      {
        operationNo: "20",
        laborWorkCentre: "ASSM-02",
        unitTime: "8",
        machineCentre: "ASM-M2",
        machineTime: "6",
        expectedSetupTime: "10",
        expectedRuntime: "60"
      },
      {
        operationNo: "30",
        laborWorkCentre: "QC-01",
        unitTime: "2",
        machineCentre: "TST-M1",
        machineTime: "1.5",
        expectedSetupTime: "5",
        expectedRuntime: "20"
      }
    ]
  },
  {
    routingCode: "ROU-002",
    desc1: "Electronic Assembly Process",
    baseQty: 5,
    units: "units",
    startDate: "2025-02-01",
    endDate: "2025-10-31",
    status: "Active",
    operations: [
      {
        operationNo: "10",
        laborWorkCentre: "PREP-01",
        unitTime: "3",
        machineCentre: "CUT-M1",
        machineTime: "2.5",
        expectedSetupTime: "8",
        expectedRuntime: "30"
      },
      {
        operationNo: "20",
        laborWorkCentre: "SMT-01",
        unitTime: "6",
        machineCentre: "SMT-M1",
        machineTime: "5",
        expectedSetupTime: "20",
        expectedRuntime: "40"
      }
    ]
  }
];
