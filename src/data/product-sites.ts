import { ProductSiteData } from "@/types";
export const productSitesData: ProductSiteData[] = [
  {
    productCode: "P1001",
    description: "Steel Rod 20mm",
    refCode: "SR20-01",
    status: "Active",
    stockManaged: "Yes",
    lotManagement: "Yes",
    serialNoManagement: "No",
    desc2: "Heavy-duty steel rod",
    lotSeqCode: "LOT123",
  },
  {
    productCode: "P1002",
    description: "Copper Wire 5m",
    refCode: "CW05-01",
    status: "Inactive",
    stockManaged: "No",
    lotManagement: "No",
    serialNoManagement: "Yes",
    desc2: "",
    lotSeqCode: "CWLOT99",
  },
  {
    productCode: "P1003",
    description: "Aluminium Sheet",
    refCode: "AS01",
    status: "Active",
    stockManaged: "Yes",
    lotManagement: "No",
    serialNoManagement: "No",
    desc2: "Standard aluminum sheet",
    lotSeqCode: "",
  }
];
