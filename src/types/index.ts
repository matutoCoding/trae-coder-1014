export interface SeaArea {
  id: string;
  name: string;
  location: string;
  area: number;
  type: string;
  status: 'normal' | 'warning' | 'danger';
  temperature: number;
  salinity: number;
  seedCount: number;
  description: string;
  createTime: string;
}

export interface SeedlingBatch {
  id: string;
  batchNo: string;
  type: '紫菜' | '海带';
  variety: string;
  quantity: number;
  unit: string;
  quality: '优' | '良' | '中';
  nurseryDate: string;
  expectedDate: string;
  status: '培育中' | '可放养' | '已放养';
  operator: string;
  remark: string;
}

export interface HangingRecord {
  id: string;
  batchNo: string;
  seaAreaId: string;
  seaAreaName: string;
  type: '紫菜' | '海带';
  ropeCount: number;
  ropeLength: number;
  floatCount: number;
  hangingDate: string;
  operator: string;
  remark: string;
}

export interface MonitorData {
  id: string;
  seaAreaId: string;
  seaAreaName: string;
  temperature: number;
  salinity: number;
  ph: number;
  dissolvedOxygen: number;
  recordTime: string;
  weather: string;
  operator: string;
}

export interface HarvestRecord {
  id: string;
  seaAreaId: string;
  seaAreaName: string;
  type: '紫菜' | '海带';
  quantity: number;
  unit: string;
  quality: '优' | '良' | '中';
  harvestDate: string;
  operator: string;
  remark: string;
}

export interface DryingRecord {
  id: string;
  batchNo: string;
  type: '紫菜' | '海带';
  processType: '晾晒' | '烘干';
  inputQuantity: number;
  outputQuantity: number;
  inputUnit: string;
  outputUnit: string;
  startTime: string;
  endTime: string;
  operator: string;
  remark: string;
}

export interface FinishedProduct {
  id: string;
  batchNo: string;
  type: '紫菜' | '海带';
  grade: '特级' | '一级' | '二级';
  packageCount: number;
  packageSpec: string;
  totalWeight: number;
  unit: string;
  packageDate: string;
  operator: string;
  storageLocation: string;
}

export interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  customerType: '加工厂' | '电商' | '批发';
  products: OrderProduct[];
  totalAmount: number;
  status: '待发货' | '已发货' | '已完成' | '已取消';
  orderDate: string;
  deliveryDate: string;
  address: string;
  contact: string;
  phone: string;
  remark: string;
}

export interface OrderProduct {
  productName: string;
  type: '紫菜' | '海带';
  grade: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface CostItem {
  id: string;
  category: '苗种' | '物资' | '人工' | '设备' | '运输' | '加工' | '其他';
  name: string;
  amount: number;
  date: string;
  operator: string;
  remark: string;
}

export interface StatItem {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  trend?: 'up' | 'down' | 'flat';
}

export interface FunctionItem {
  key: string;
  name: string;
  path: string;
  bgColor: string;
  textColor: string;
}
