import { BOMData } from './../types/index';
export const bomData: BOMData[] = [
  {
    bomCode: "BOM-A100",
    desc1: "Assembly A100",
    baseQty: 1,
    units: "pcs",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "Active",
    components: [
      {
        component: "PRD001",
        description: "Aluminum Sheet 0.5mm",
        quantity: 2,
        unit: "pcs",
        refCode: "ALM-005"
      },
      {
        component: "PRD002",
        description: "Carbon Steel Rod 10mm",
        quantity: 4,
        unit: "pcs",
        refCode: "CSR-010"
      },
      {
        component: "PRD004",
        description: "Copper Wire 2mm",
        quantity: 0.5,
        unit: "kg",
        refCode: "CPW-002"
      }
    ]
  },
  {
    bomCode: "BOM-B200",
    desc1: "Electronic Module B200",
    baseQty: 1,
    units: "pcs",
    startDate: "2025-02-15",
    endDate: "2025-11-30",
    status: "Active",
    components: [
      {
        component: "PRD003",
        description: "Silicon Wafer 8\"",
        quantity: 1,
        unit: "pcs",
        refCode: "SIW-008"
      },
      {
        component: "PRD005",
        description: "PCB Board 100x150mm",
        quantity: 1,
        unit: "pcs",
        refCode: "PCB-1015"
      },
      {
        component: "PRD004",
        description: "Copper Wire 2mm",
        quantity: 0.2,
        unit: "kg",
        refCode: "CPW-002"
      }
    ]
  }
];