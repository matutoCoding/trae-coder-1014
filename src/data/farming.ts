import { HangingRecord, MonitorData } from '@/types';

export const hangingRecordList: HangingRecord[] = [
  {
    id: '1',
    batchNo: 'HD-2025-004',
    seaAreaId: '2',
    seaAreaName: 'B区-西洋岛',
    type: '海带',
    ropeCount: 120,
    ropeLength: 60,
    floatCount: 480,
    hangingDate: '2025-09-20',
    operator: '李海生',
    remark: '苗绳间距1.5米，生长情况良好'
  },
  {
    id: '2',
    batchNo: 'ZM-2025-001',
    seaAreaId: '1',
    seaAreaName: 'A区-东海湾',
    type: '紫菜',
    ropeCount: 80,
    ropeLength: 50,
    floatCount: 320,
    hangingDate: '2025-09-22',
    operator: '张建国',
    remark: '采用支柱式浮筏，网帘平整'
  },
  {
    id: '3',
    batchNo: 'HD-2025-008',
    seaAreaId: '4',
    seaAreaName: 'D区-牙城湾',
    type: '海带',
    ropeCount: 150,
    ropeLength: 55,
    floatCount: 600,
    hangingDate: '2025-09-12',
    operator: '李海生',
    remark: '海区水质肥沃，预计产量可观'
  },
  {
    id: '4',
    batchNo: 'ZM-2025-007',
    seaAreaId: '3',
    seaAreaName: 'C区-东冲口',
    type: '紫菜',
    ropeCount: 100,
    ropeLength: 48,
    floatCount: 400,
    hangingDate: '2025-09-25',
    operator: '张建国',
    remark: '注意水温监测，防止病害'
  },
  {
    id: '5',
    batchNo: 'ZM-2025-001',
    seaAreaId: '5',
    seaAreaName: 'E区-三沙港',
    type: '紫菜',
    ropeCount: 60,
    ropeLength: 45,
    floatCount: 240,
    hangingDate: '2025-09-28',
    operator: '王明华',
    remark: '台风预警中，已加固浮球'
  },
  {
    id: '6',
    batchNo: 'HD-2025-002',
    seaAreaId: '2',
    seaAreaName: 'B区-西洋岛',
    type: '海带',
    ropeCount: 90,
    ropeLength: 58,
    floatCount: 360,
    hangingDate: '2025-10-05',
    operator: '李海生',
    remark: '新增放养区域，延伸筏架'
  }
];

export const monitorDataList: MonitorData[] = [
  {
    id: '1',
    seaAreaId: '1',
    seaAreaName: 'A区-东海湾',
    temperature: 18.5,
    salinity: 28.6,
    ph: 8.1,
    dissolvedOxygen: 7.2,
    recordTime: '2025-10-08 08:00',
    weather: '晴',
    operator: '张建国'
  },
  {
    id: '2',
    seaAreaId: '2',
    seaAreaName: 'B区-西洋岛',
    temperature: 17.2,
    salinity: 29.1,
    ph: 8.2,
    dissolvedOxygen: 7.5,
    recordTime: '2025-10-08 08:30',
    weather: '晴',
    operator: '李海生'
  },
  {
    id: '3',
    seaAreaId: '3',
    seaAreaName: 'C区-东冲口',
    temperature: 22.3,
    salinity: 31.2,
    ph: 7.9,
    dissolvedOxygen: 6.5,
    recordTime: '2025-10-08 09:00',
    weather: '多云',
    operator: '王明华'
  },
  {
    id: '4',
    seaAreaId: '4',
    seaAreaName: 'D区-牙城湾',
    temperature: 16.8,
    salinity: 27.9,
    ph: 8.3,
    dissolvedOxygen: 7.8,
    recordTime: '2025-10-08 09:30',
    weather: '晴',
    operator: '李海生'
  },
  {
    id: '5',
    seaAreaId: '5',
    seaAreaName: 'E区-三沙港',
    temperature: 25.1,
    salinity: 33.5,
    ph: 7.8,
    dissolvedOxygen: 5.8,
    recordTime: '2025-10-08 10:00',
    weather: '阴，有阵风',
    operator: '王明华'
  },
  {
    id: '6',
    seaAreaId: '1',
    seaAreaName: 'A区-东海湾',
    temperature: 19.2,
    salinity: 28.8,
    ph: 8.0,
    dissolvedOxygen: 7.0,
    recordTime: '2025-10-07 08:00',
    weather: '晴',
    operator: '张建国'
  },
  {
    id: '7',
    seaAreaId: '2',
    seaAreaName: 'B区-西洋岛',
    temperature: 17.8,
    salinity: 29.3,
    ph: 8.1,
    dissolvedOxygen: 7.3,
    recordTime: '2025-10-07 08:30',
    weather: '晴',
    operator: '李海生'
  }
];
