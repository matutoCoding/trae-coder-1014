import { HarvestRecord } from '@/types';

export const harvestRecordList: HarvestRecord[] = [
  {
    id: '1',
    seaAreaId: '2',
    seaAreaName: 'B区-西洋岛',
    type: '海带',
    quantity: 15000,
    unit: '公斤',
    quality: '优',
    harvestDate: '2025-04-15',
    operator: '李海生',
    remark: '首轮采收，品相良好'
  },
  {
    id: '2',
    seaAreaId: '4',
    seaAreaName: 'D区-牙城湾',
    type: '海带',
    quantity: 18500,
    unit: '公斤',
    quality: '优',
    harvestDate: '2025-04-18',
    operator: '李海生',
    remark: '产量超预期，藻体肥厚'
  },
  {
    id: '3',
    seaAreaId: '1',
    seaAreaName: 'A区-东海湾',
    type: '紫菜',
    quantity: 2500,
    unit: '公斤',
    quality: '优',
    harvestDate: '2025-10-25',
    operator: '张建国',
    remark: '头水紫菜，品质最佳'
  },
  {
    id: '4',
    seaAreaId: '3',
    seaAreaName: 'C区-东冲口',
    type: '紫菜',
    quantity: 1800,
    unit: '公斤',
    quality: '良',
    harvestDate: '2025-10-28',
    operator: '王明华',
    remark: '二水紫菜，品质正常'
  },
  {
    id: '5',
    seaAreaId: '2',
    seaAreaName: 'B区-西洋岛',
    type: '海带',
    quantity: 22000,
    unit: '公斤',
    quality: '良',
    harvestDate: '2025-04-25',
    operator: '李海生',
    remark: '次轮采收，部分藻体偏薄'
  },
  {
    id: '6',
    seaAreaId: '1',
    seaAreaName: 'A区-东海湾',
    type: '紫菜',
    quantity: 3200,
    unit: '公斤',
    quality: '优',
    harvestDate: '2025-11-02',
    operator: '张建国',
    remark: '三水紫菜，色泽光亮'
  },
  {
    id: '7',
    seaAreaId: '4',
    seaAreaName: 'D区-牙城湾',
    type: '海带',
    quantity: 16800,
    unit: '公斤',
    quality: '优',
    harvestDate: '2025-05-02',
    operator: '李海生',
    remark: '末轮采收，整体优良'
  },
  {
    id: '8',
    seaAreaId: '5',
    seaAreaName: 'E区-三沙港',
    type: '紫菜',
    quantity: 1200,
    unit: '公斤',
    quality: '中',
    harvestDate: '2025-11-05',
    operator: '王明华',
    remark: '受天气影响，品质一般'
  }
];

export const harvestSummary = {
  totalHarvest: 81000,
  unit: '公斤',
  seaweedCount: 8700,
  kelpCount: 72300,
  excellentRate: 0.68,
  thisMonth: 18700
};
