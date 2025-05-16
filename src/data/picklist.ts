export const pickLists = [
  {
    pickListId: "PL-2025-001",
    workOrderId: "WO-8754",
    bomCode: "BOM-001",
    productName: "Aluminum Brackets A-450",
    requestedBy: "John Smith",
    requestDate: "2025-05-10",
    requiredDate: "2025-05-18",
    status: "Ready",
    items: [
      { itemId: "I-450", desc: "Aluminum Plate 6061", quantity: 15, uom: "PCS", location: "A-12-03", picked: true },
      { itemId: "I-621", desc: "Stainless Bolts M8", quantity: 90, uom: "PCS", location: "B-04-12", picked: true },
      { itemId: "I-380", desc: "Rubber Gasket", quantity: 30, uom: "PCS", location: "D-08-01", picked: false }
    ]
  },
  {
    pickListId: "PL-2025-002",
    workOrderId: "WO-8755",
    bomCode: "BOM-002",
    productName: "Steel Frame Assembly",
    requestedBy: "Sarah Johnson",
    requestDate: "2025-05-11",
    requiredDate: "2025-05-20",
    status: "In Progress",
    items: [
      { itemId: "I-105", desc: "Steel Tube 2x1", quantity: 8, uom: "M", location: "C-01-08", picked: true },
      { itemId: "I-218", desc: "Corner Joints", quantity: 12, uom: "PCS", location: "C-03-04", picked: false },
      { itemId: "I-376", desc: "Anti-rust Coating", quantity: 2, uom: "L", location: "E-11-02", picked: false }
    ]
  },
  {
    pickListId: "PL-2025-003",
    workOrderId: "WO-8760",
    bomCode: "BOM-005",
    productName: "Electronic Control Panel",
    requestedBy: "Michael Chen",
    requestDate: "2025-05-12",
    requiredDate: "2025-05-16",
    status: "Pending",
    items: [
      { itemId: "I-702", desc: "Control PCB", quantity: 5, uom: "PCS", location: "F-02-09", picked: false },
      { itemId: "I-845", desc: "LCD Display 7\"", quantity: 5, uom: "PCS", location: "F-05-03", picked: false },
      { itemId: "I-921", desc: "Cable Harness", quantity: 10, uom: "PCS", location: "G-01-11", picked: false },
      { itemId: "I-330", desc: "Plastic Enclosure", quantity: 5, uom: "PCS", location: "D-06-07", picked: false }
    ]
  }
];