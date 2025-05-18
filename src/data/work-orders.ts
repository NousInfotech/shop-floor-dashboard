// data/work-orders.ts
import { WorkOrder } from '@/types/work-order';

export const workOrdersData: WorkOrder[] = [
  {
    id: '1',
    orderNo: '20172943',
    name: "main",
    siteLocation: 'Main Factory',
    startTime: '01/04/2021 2:10 PM',
    endTime: '01/04/2021 2:39 PM',
    date: '01/04/2021',  // Adding date as a property
    status: 'RUNNING',
    part: {
      number: 'PN1001',
      name: 'Rotor Assembly',
    },
    operationNo: '40',
    operations: [
      {
        id: '10',
        name: 'Cutting',
        workCenter: 'TC11',
        status: 'COMPLETED',
        startTime: '01/04/2021 2:10 PM',
        completedAt: '01/04/2021 1:59:54 PM',
        timer: '00:00:00',
      },
      {
        id: '20',
        name: 'Drilling',
        workCenter: 'TN01',
        status: 'RUNNING',
        startTime: '01/04/2021 2:20 PM',
        timer: '00:00:00',
      },
      {
        id: '30',
        name: 'Assembly',
        workCenter: 'AS05',
        status: 'PENDING',
        timer: '00:00:00',
      },
    ],
    employees: [
      {
        id: '1',
        barcode: 'BC001',
        name: 'John Doe',
        employmentType: 'Permanent',
        status: 'Active',
      },
    ],
  },
  {
    id: '2',
    orderNo: '20178164',
    name: 'warehouse',
    siteLocation: 'Main Factory',
    startTime: '01/04/2021 7:52 PM',
    endTime: '02/04/2021 9:30 AM',
    date: '01/04/2021',  // Adding date as a property
    status: 'PENDING',
    part: {
      number: 'PN2002',
      name: 'Bearing Housing',
    },
    operationNo: '25',
    operations: [
      {
        id: '10',
        name: 'Machining',
        workCenter: 'MC02',
        status: 'PENDING',
        timer: '00:00:00',
      },
      {
        id: '20',
        name: 'Finishing',
        workCenter: 'FN03',
        status: 'PENDING',
        timer: '00:00:00',
      },
    ],
    employees: [],
  },
  {
    id: '3',
    orderNo: '20178164',
    name: 'factory',
    siteLocation: 'Main Factory',
    startTime: '01/04/2021 7:52 PM',
    endTime: '02/04/2021 9:30 AM',
    date: '01/04/2021',  // Adding date as a property
    status: 'PENDING',
    part: {
      number: 'PN2002',
      name: 'Bearing Housing',
    },
    operationNo: '25',
    operations: [
      {
        id: '10',
        name: 'Machining',
        workCenter: 'MC02',
        status: 'PENDING',
        timer: '00:00:00',
      },
      {
        id: '20',
        name: 'Finishing',
        workCenter: 'FN03',
        status: 'PENDING',
        timer: '00:00:00',
      },
    ],
    employees: [],
  },
  {
    id: '4',
    orderNo: '20178164',
    name: '',
    siteLocation: 'Main Factory',
    startTime: '01/04/2021 7:52 PM',
    endTime: '02/04/2021 9:30 AM',
    date: '01/04/2021',  // Adding date as a property
    status: 'PENDING',
    part: {
      number: 'PN2002',
      name: 'Bearing Housing',
    },
    operationNo: '25',
    operations: [
      {
        id: '10',
        name: 'Machining',
        workCenter: 'MC02',
        status: 'PENDING',
        timer: '00:00:00',
      },
      {
        id: '20',
        name: 'Finishing',
        workCenter: 'FN03',
        status: 'PENDING',
        timer: '00:00:00',
      },
    ],
    employees: [],
  },
   {
    id: '5',
    orderNo: '20172943',
    name: "",
    siteLocation: 'Warehouse',
    startTime: '01/04/2021 2:10 PM',
    endTime: '01/04/2021 2:39 PM',
    date: '01/04/2021',  // Adding date as a property
    status: 'RUNNING',
    part: {
      number: 'PN1001',
      name: 'Rotor Assembly',
    },
    operationNo: '40',
    operations: [
      {
        id: '10',
        name: 'Cutting',
        workCenter: 'TC11',
        status: 'COMPLETED',
        startTime: '01/04/2021 2:10 PM',
        completedAt: '01/04/2021 1:59:54 PM',
        timer: '00:00:00',
      },
      {
        id: '20',
        name: 'Drilling',
        workCenter: 'TN01',
        status: 'RUNNING',
        startTime: '01/04/2021 2:20 PM',
        timer: '00:00:00',
      },
      {
        id: '30',
        name: 'Assembly',
        workCenter: 'AS05',
        status: 'PENDING',
        timer: '00:00:00',
      },
    ],
    employees: [
      {
        id: '1',
        barcode: 'BC001',
        name: 'John Doe',
        employmentType: 'Permanent',
        status: 'Active',
      },
    ],
  },
  {
    id: '6',
    orderNo: '20178164',
    name: '',
    siteLocation: 'Assembly plants',
    startTime: '01/04/2021 7:52 PM',
    endTime: '02/04/2021 9:30 AM',
    date: '01/04/2021',  // Adding date as a property
    status: 'PENDING',
    part: {
      number: 'PN2002',
      name: 'Bearing Housing',
    },
    operationNo: '25',
    operations: [
      {
        id: '10',
        name: 'Machining',
        workCenter: 'MC02',
        status: 'PENDING',
        timer: '00:00:00',
      },
      {
        id: '20',
        name: 'Finishing',
        workCenter: 'FN03',
        status: 'PENDING',
        timer: '00:00:00',
      },
    ],
    employees: [],
  },
];
