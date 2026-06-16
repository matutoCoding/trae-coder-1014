import { DryingRecord, FinishedProduct } from '@/types';

export const dryingRecordList: DryingRecord[] = [
  {
    id: '1',
    batchNo: 'GC-2025-001',
    type: '紫菜',
    processType: '烘干',
    inputQuantity: 2500,
    outputQuantity: 250,
    inputUnit: '公斤',
    outputUnit: '公斤',
    startTime: '2025-10-25 09:00',
    endTime: '2025-10-25 16:00',
    operator: '陈志强',
    remark: '头水紫菜烘干，温度控制60℃'
  },
  {
    id: '2',
    batchNo: 'GC-2025-002',
    type: '海带',
    processType: '晾晒',
    inputQuantity: 15000,
    outputQuantity: 3000,
    inputUnit: '公斤',
    outputUnit: '公斤',
    startTime: '2025-04-15 07:00',
    endTime: '2025-04-16 18:00',
    operator: '陈志强',
    remark: '自然晾晒，天气晴好'
  },
  {
    id: '3',
    batchNo: 'GC-2025-003',
    type: '紫菜',
    processType: '烘干',
    inputQuantity: 1800,
    outputQuantity: 180,
    inputUnit: '公斤',
    outputUnit: '公斤',
    startTime: '2025-10-28 10:00',
    endTime: '2025-10-28 17:00',
    operator: '林美玲',
    remark: '二水紫菜烘干'
  },
  {
    id: '4',
    batchNo: 'GC-2025-004',
    type: '海带',
    processType: '晾晒',
    inputQuantity: 18500,
    outputQuantity: 3700,
    inputUnit: '公斤',
    outputUnit: '公斤',
    startTime: '2025-04-18 07:30',
    endTime: '2025-04-19 17:30',
    operator: '陈志强',
    remark: '品质优良，晾晒均匀'
  },
  {
    id: '5',
    batchNo: 'GC-2025-005',
    type: '紫菜',
    processType: '烘干',
    inputQuantity: 3200,
    outputQuantity: 320,
    inputUnit: '公斤',
    outputUnit: '公斤',
    startTime: '2025-11-02 08:30',
    endTime: '2025-11-02 15:30',
    operator: '林美玲',
    remark: '三水紫菜烘干成品'
  },
  {
    id: '6',
    batchNo: 'GC-2025-006',
    type: '海带',
    processType: '烘干',
    inputQuantity: 8000,
    outputQuantity: 1600,
    inputUnit: '公斤',
    outputUnit: '公斤',
    startTime: '2025-04-25 09:00',
    endTime: '2025-04-26 12:00',
    operator: '陈志强',
    remark: '机械烘干，效率更高'
  }
];

export const finishedProductList: FinishedProduct[] = [
  {
    id: '1',
    batchNo: 'CP-2025-001',
    type: '紫菜',
    grade: '特级',
    packageCount: 500,
    packageSpec: '100g/袋',
    totalWeight: 50,
    unit: '公斤',
    packageDate: '2025-10-26',
    operator: '林美玲',
    storageLocation: 'A仓库-01货架'
  },
  {
    id: '2',
    batchNo: 'CP-2025-002',
    type: '海带',
    grade: '一级',
    packageCount: 1500,
    packageSpec: '1kg/袋',
    totalWeight: 1500,
    unit: '公斤',
    packageDate: '2025-04-17',
    operator: '陈志强',
    storageLocation: 'B仓库-03货架'
  },
  {
    id: '3',
    batchNo: 'CP-2025-003',
    type: '紫菜',
    grade: '一级',
    packageCount: 360,
    packageSpec: '100g/袋',
    totalWeight: 36,
    unit: '公斤',
    packageDate: '2025-10-29',
    operator: '林美玲',
    storageLocation: 'A仓库-02货架'
  },
  {
    id: '4',
    batchNo: 'CP-2025-004',
    type: '海带',
    grade: '特级',
    packageCount: 2000,
    packageSpec: '500g/袋',
    totalWeight: 1000,
    unit: '公斤',
    packageDate: '2025-04-20',
    operator: '陈志强',
    storageLocation: 'B仓库-01货架'
  },
  {
    id: '5',
    batchNo: 'CP-2025-005',
    type: '紫菜',
    grade: '特级',
    packageCount: 640,
    packageSpec: '50g/罐',
    totalWeight: 32,
    unit: '公斤',
    packageDate: '2025-11-03',
    operator: '林美玲',
    storageLocation: 'A仓库-03货架'
  },
  {
    id: '6',
    batchNo: 'CP-2025-006',
    type: '海带',
    grade: '二级',
    packageCount: 3200,
    packageSpec: '2kg/袋',
    totalWeight: 6400,
    unit: '公斤',
    packageDate: '2025-04-27',
    operator: '陈志强',
    storageLocation: 'C仓库-01货架'
  }
];
