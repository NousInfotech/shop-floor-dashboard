import { LucideIcon } from "lucide-react";
export interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  isReadOnly?: boolean;
}

export interface ProductSiteData {
  productCode: string;
  description: string;
  desc2?: string;
  refCode: string;
  status: string;
  stockManaged: string;
  lotManagement: string;
  serialNoManagement: string;
   lotSeqCode: string;
}

export interface BOMData {
  bomCode: string;
  desc1: string;
  baseQty: number;
  units: string;
  startDate: string;
  endDate: string;
  status: string;
  components: {
    component: string;
    description: string;
    quantity: number;
    unit: string;
    refCode: string;
  }[];
}

export interface RoutingData {
  routingCode: string;
  desc1: string;
  baseQty: number;
  units: string;
  startDate: string;
  endDate: string;
  status: string;
  operations: {
    operationNo: string;
    laborWorkCentre: string;
    unitTime: string;
    machineCentre: string;
    machineTime: string;
    expectedSetupTime: string;
    expectedRuntime: string;
  }[];
}

export interface StockDetailsData {
  productCode: string;
  desc1: string;
  desc2?: string;
  stockUnit: string;
  purchaseUnit: string;
  purchaseStockConversion: string;
  salesUnit: string;
  salesStockConversion: string;
  packingUnit: string;
  packToStock: string;
}

export interface QCData {
  qcManagement: string;
  defaultStatus: string;
  technicalSheet: string;
}

export interface ProductCategoryData {
  category: string;
  description: string;
}