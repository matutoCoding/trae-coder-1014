import { SeaArea } from '@/types';

export const seaAreaList: SeaArea[] = [
  {
    id: '1',
    name: 'A区-东海湾',
    location: '福建省宁德市三都澳',
    area: 120,
    type: '紫菜养殖区',
    status: 'normal',
    temperature: 18.5,
    salinity: 28.6,
    seedCount: 560,
    description: '主要紫菜养殖区，水深适宜，水质优良',
    createTime: '2025-03-15'
  },
  {
    id: '2',
    name: 'B区-西洋岛',
    location: '福建省宁德市霞浦县',
    area: 200,
    type: '海带养殖区',
    status: 'normal',
    temperature: 17.2,
    salinity: 29.1,
    seedCount: 800,
    description: '海带主产区，海流稳定，光照充足',
    createTime: '2025-02-20'
  },
  {
    id: '3',
    name: 'C区-东冲口',
    location: '福建省宁德市蕉城区',
    area: 150,
    type: '紫菜养殖区',
    status: 'warning',
    temperature: 22.3,
    salinity: 31.2,
    seedCount: 420,
    description: '水温偏高，需加强监测',
    createTime: '2025-04-01'
  },
  {
    id: '4',
    name: 'D区-牙城湾',
    location: '福建省宁德市霞浦县',
    area: 180,
    type: '海带养殖区',
    status: 'normal',
    temperature: 16.8,
    salinity: 27.9,
    seedCount: 720,
    description: '水质肥沃，海带生长良好',
    createTime: '2025-03-10'
  },
  {
    id: '5',
    name: 'E区-三沙港',
    location: '福建省宁德市霞浦县',
    area: 90,
    type: '混合养殖区',
    status: 'danger',
    temperature: 25.1,
    salinity: 33.5,
    seedCount: 280,
    description: '台风预警区域，需做好防灾准备',
    createTime: '2025-05-20'
  }
];

export const overviewStats = {
  totalArea: 740,
  seaAreaCount: 5,
  totalSeedlings: 2780,
  normalAreaCount: 3,
  warningAreaCount: 1,
  dangerAreaCount: 1
};

export const typhoonWarning = {
  active: true,
  name: '第12号台风"海燕"',
  level: '橙色预警',
  distance: '约380公里',
  direction: '西北方向移动',
  expectedTime: '预计24小时后影响',
  advice: [
    '加固筏架和浮球设施',
    '减少海上作业人员',
    '准备应急物资',
    '随时关注气象预报'
  ]
};
