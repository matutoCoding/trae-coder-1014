import { Order } from '@/types';

export const orderList: Order[] = [
  {
    id: '1',
    orderNo: 'DD-202510001',
    customerName: '福建海之味食品有限公司',
    customerType: '加工厂',
    products: [
      { productName: '特级头水紫菜', type: '紫菜', grade: '特级', quantity: 100, unit: '公斤', unitPrice: 320 },
      { productName: '一级紫菜', type: '紫菜', grade: '一级', quantity: 150, unit: '公斤', unitPrice: 200 }
    ],
    totalAmount: 62000,
    status: '已完成',
    orderDate: '2025-10-28',
    deliveryDate: '2025-10-30',
    address: '福建省福州市仓山区金山工业区',
    contact: '郑经理',
    phone: '138****5678',
    remark: '长期合作客户，优先发货'
  },
  {
    id: '2',
    orderNo: 'DD-202511001',
    customerName: '天猫海洋鲜生旗舰店',
    customerType: '电商',
    products: [
      { productName: '特级头水紫菜', type: '紫菜', grade: '特级', quantity: 50, unit: '公斤', unitPrice: 380 },
      { productName: '特级海带', type: '海带', grade: '特级', quantity: 500, unit: '公斤', unitPrice: 45 }
    ],
    totalAmount: 41500,
    status: '待发货',
    orderDate: '2025-11-05',
    deliveryDate: '2025-11-08',
    address: '浙江省杭州市西湖区文三路电商产业园',
    contact: '陈店长',
    phone: '139****1234',
    remark: '电商订单，需快递配送'
  },
  {
    id: '3',
    orderNo: 'DD-202504001',
    customerName: '青岛海鲜批发中心',
    customerType: '批发',
    products: [
      { productName: '一级海带', type: '海带', grade: '一级', quantity: 3000, unit: '公斤', unitPrice: 28 }
    ],
    totalAmount: 84000,
    status: '已完成',
    orderDate: '2025-04-20',
    deliveryDate: '2025-04-22',
    address: '山东省青岛市市南区水产品批发市场',
    contact: '王总',
    phone: '137****8899',
    remark: '批发大客户'
  },
  {
    id: '4',
    orderNo: 'DD-202511002',
    customerName: '厦门绿源食品加工厂',
    customerType: '加工厂',
    products: [
      { productName: '一级海带', type: '海带', grade: '一级', quantity: 2000, unit: '公斤', unitPrice: 30 },
      { productName: '二级海带', type: '海带', grade: '二级', quantity: 3000, unit: '公斤', unitPrice: 18 }
    ],
    totalAmount: 114000,
    status: '已发货',
    orderDate: '2025-11-03',
    deliveryDate: '2025-11-06',
    address: '福建省厦门市同安区食品工业园',
    contact: '李厂长',
    phone: '136****4567',
    remark: '合同订单，物流配送'
  },
  {
    id: '5',
    orderNo: 'DD-202511003',
    customerName: '京东自营·海味馆',
    customerType: '电商',
    products: [
      { productName: '特级头水紫菜', type: '紫菜', grade: '特级', quantity: 80, unit: '公斤', unitPrice: 360 },
      { productName: '特级海带', type: '海带', grade: '特级', quantity: 300, unit: '公斤', unitPrice: 48 }
    ],
    totalAmount: 43200,
    status: '待发货',
    orderDate: '2025-11-06',
    deliveryDate: '2025-11-09',
    address: '北京市大兴区亦庄经济开发区',
    contact: '刘运营',
    phone: '135****2233',
    remark: '京东入仓，注意包装'
  },
  {
    id: '6',
    orderNo: 'DD-202511004',
    customerName: '上海水产批发市场',
    customerType: '批发',
    products: [
      { productName: '特级紫菜', type: '紫菜', grade: '特级', quantity: 120, unit: '公斤', unitPrice: 280 }
    ],
    totalAmount: 33600,
    status: '已取消',
    orderDate: '2025-11-02',
    deliveryDate: '2025-11-05',
    address: '上海市杨浦区军工路水产品市场',
    contact: '赵老板',
    phone: '133****7788',
    remark: '客户临时取消订单'
  }
];

export const salesStats = {
  totalOrders: 32,
  totalAmount: 586500,
  pendingOrders: 2,
  shippedOrders: 1,
  monthSales: 198700,
  ecommerceCount: 12,
  factoryCount: 8,
  wholesaleCount: 12
};
