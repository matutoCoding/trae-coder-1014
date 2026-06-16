import { InventoryItem, ProcessingTrace, ReinforceTask } from '@/types';

export const inventoryList: InventoryItem[] = [
  { id: '1', type: '紫菜', grade: '特级', quantity: 82, unit: '公斤', warehouse: 'A仓库-01货架', updateTime: '2025-11-05 10:00' },
  { id: '2', type: '紫菜', grade: '一级', quantity: 36, unit: '公斤', warehouse: 'A仓库-02货架', updateTime: '2025-11-03 15:30' },
  { id: '3', type: '紫菜', grade: '二级', quantity: 18, unit: '公斤', warehouse: 'A仓库-03货架', updateTime: '2025-11-01 09:00' },
  { id: '4', type: '海带', grade: '特级', quantity: 1000, unit: '公斤', warehouse: 'B仓库-01货架', updateTime: '2025-05-10 11:00' },
  { id: '5', type: '海带', grade: '一级', quantity: 1500, unit: '公斤', warehouse: 'B仓库-03货架', updateTime: '2025-05-08 14:20' },
  { id: '6', type: '海带', grade: '二级', quantity: 6400, unit: '公斤', warehouse: 'C仓库-01货架', updateTime: '2025-05-05 16:45' }
];

export const getInventoryQty = (type: string, grade: string) => {
  const item = inventoryList.find(i => i.type === type && i.grade === grade);
  return item ? item.quantity : 0;
};

export const processingTraceList: ProcessingTrace[] = [
  { harvestId: '1', dryingId: '2', productId: '2', inventoryId: '5', grade: '一级', outputQuantity: 1500, orderIds: ['4'], status: 'in_stock' },
  { harvestId: '2', dryingId: '4', productId: '4', inventoryId: '4', grade: '特级', outputQuantity: 1000, orderIds: ['2', '5'], status: 'in_stock' },
  { harvestId: '3', dryingId: '1', productId: '1', inventoryId: '1', grade: '特级', outputQuantity: 50, orderIds: ['1', '2', '5'], status: 'in_stock' },
  { harvestId: '4', dryingId: '3', productId: '3', inventoryId: '2', grade: '一级', outputQuantity: 36, orderIds: ['1'], status: 'in_stock' },
  { harvestId: '5', dryingId: '6', productId: '6', inventoryId: '6', grade: '二级', outputQuantity: 6400, orderIds: ['3', '4'], status: 'in_stock' },
  { harvestId: '6', dryingId: '5', productId: '5', inventoryId: '1', grade: '特级', outputQuantity: 32, orderIds: [], status: 'in_stock' },
  { harvestId: '7', status: 'harvested' },
  { harvestId: '8', status: 'harvested' }
];

export const initialReinforceTasks: ReinforceTask[] = [
  { id: '1', task: '加固A区筏架缆绳', status: 'done', area: 'A区-东海湾', assignee: '张建国' },
  { id: '2', task: '收紧B区浮球固定索', status: 'done', area: 'B区-西洋岛', assignee: '李海生' },
  { id: '3', task: '加固C区养殖网帘', status: 'doing', area: 'C区-东冲口', assignee: '王明华' },
  { id: '4', task: '检查D区锚泊系统', status: 'doing', area: 'D区-牙城湾', assignee: '李海生' },
  { id: '5', task: '撤离E区海上人员', status: 'pending', area: 'E区-三沙港', assignee: '张建国' },
  { id: '6', task: '加固加工厂仓库门窗', status: 'pending', area: '加工厂', assignee: '陈主管' },
  { id: '7', task: '检查排水系统畅通', status: 'pending', area: '加工厂', assignee: '陈主管' },
  { id: '8', task: '固定露天晾晒设备', status: 'doing', area: '晾晒场', assignee: '王明华' }
];
