const mockProductionData = {
  totalProduction: 491,
  productionGrowth: 12,
  avgProductionRate: 22.2,
  rateGrowth: 8.2,
  qualityScore: 96.1,
  qualityGrowth: 1.5,
  productionRateData: [45, 52, 48, 57, 41, 38, 65, 62],
  qualityScoreData: [97.2, 98.1, 94.8, 95.9, 98.7],
  activeWorkOrders: [
    {
      id: 1,
      name: "Assemble Product XYZ-100",
      progress: 35,
      status: "In Progress",
      date: "8/30/2023"
    }
  ],
  qualityBatches: [
    {
      id: 472,
      status: "Completed",
      progress: 100,
      date: "8/25/2023"
    }
  ]
};

export default mockProductionData;
