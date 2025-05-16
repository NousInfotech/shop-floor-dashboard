import { StockDetailsData } from "@/types";
export const stockDetailsData: StockDetailsData[] = [
  {
    productCode: "PRD001",
    desc1: "Aluminum Sheet 0.5mm",
    desc2: "Conductive",
    stockUnit: "pcs",
    purchaseUnit: "batch",
    purchaseStockConversion: "100",
    salesUnit: "pcs",
    salesStockConversion: "1",
    packingUnit: "box",
    packToStock: "50"
  },
  {
    productCode: "PRD002",
    desc1: "Carbon Steel Rod 10mm",
    desc2: "High Strength",
    stockUnit: "pcs",
    purchaseUnit: "bundle",
    purchaseStockConversion: "25",
    salesUnit: "pcs",
    salesStockConversion: "1",
    packingUnit: "crate",
    packToStock: "20"
  },
  {
    productCode: "PRD003",
    desc1: "Silicon Wafer 8\"",
    desc2: "Semiconductor",
    stockUnit: "pcs",
    purchaseUnit: "case",
    purchaseStockConversion: "10",
    salesUnit: "pcs",
    salesStockConversion: "1",
    packingUnit: "tray",
    packToStock: "5"
  },
  {
    productCode: "PRD004",
    desc1: "Copper Wire 2mm",
    desc2: "Electrical",
    stockUnit: "kg",
    purchaseUnit: "roll",
    purchaseStockConversion: "50",
    salesUnit: "kg",
    salesStockConversion: "1",
    packingUnit: "spool",
    packToStock: "10"
  }
];

