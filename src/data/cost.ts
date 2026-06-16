import { CostItem } from '@/types';

export const costItemList: CostItem[] = [
  {
    id: '1',
    category: '苗种',
    name: '紫菜苗种采购',
    amount: 28000,
    date: '2025-08-15',
    operator: '张建国',
    remark: 'ZM-2025-001批次，1950万株'
  },
  {
    id: '2',
    category: '苗种',
    name: '海带苗种采购',
    amount: 45000,
    date: '2025-08-20',
    operator: '李海生',
    remark: 'HD-2025-002批次，1180万株'
  },
  {
    id: '3',
    category: '物资',
    name: '养殖浮球采购',
    amount: 32000,
    date: '2025-09-01',
    operator: '王明华',
    remark: '高密度聚乙烯浮球2400个'
  },
  {
    id: '4',
    category: '物资',
    name: '苗绳网帘采购',
    amount: 18500,
    date: '2025-09-05',
    operator: '王明华',
    remark: '尼龙苗绳6000米，紫菜网帘180张'
  },
  {
    id: '5',
    category: '人工',
    name: '挂养人工费',
    amount: 24000,
    date: '2025-09-20',
    operator: '张建国',
    remark: '苗绳挂养施工，30人/5天'
  },
  {
    id: '6',
    category: '设备',
    name: '水质监测仪维护',
    amount: 3500,
    date: '2025-09-10',
    operator: '李海生',
    remark: '5台监测仪校准维护'
  },
  {
    id: '7',
    category: '加工',
    name: '烘干车间耗材',
    amount: 12000,
    date: '2025-10-15',
    operator: '陈志强',
    remark: '烘干设备配件及能源消耗'
  },
  {
    id: '8',
    category: '运输',
    name: '产品运输费',
    amount: 8600,
    date: '2025-10-30',
    operator: '林美玲',
    remark: '成品出厂物流配送'
  },
  {
    id: '9',
    category: '人工',
    name: '采收人工费',
    amount: 36000,
    date: '2025-04-20',
    operator: '李海生',
    remark: '海带采收，40人/8天'
  },
  {
    id: '10',
    category: '加工',
    name: '包装材料采购',
    amount: 15800,
    date: '2025-10-20',
    operator: '林美玲',
    remark: '食品级包装袋/罐12000套'
  },
  {
    id: '11',
    category: '设备',
    name: '筏架设施维护',
    amount: 9600,
    date: '2025-08-30',
    operator: '王明华',
    remark: '锚绳更换、桩体加固'
  },
  {
    id: '12',
    category: '其他',
    name: '台风防灾物资',
    amount: 6500,
    date: '2025-10-05',
    operator: '张建国',
    remark: '加固绳索、应急照明等'
  }
];

export const costStats = {
  totalCost: 239500,
  categoryBreakdown: [
    { category: '苗种', amount: 73000, percentage: 30.5 },
    { category: '物资', amount: 50500, percentage: 21.1 },
    { category: '人工', amount: 60000, percentage: 25.1 },
    { category: '设备', amount: 13100, percentage: 5.5 },
    { category: '加工', amount: 27800, percentage: 11.6 },
    { category: '运输', amount: 8600, percentage: 3.6 },
    { category: '其他', amount: 6500, percentage: 2.7 }
  ],
  totalRevenue: 586500,
  netProfit: 347000,
  profitMargin: 59.2
};
