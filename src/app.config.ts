export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/farming/index',
    'pages/processing/index',
    'pages/sales/index',
    'pages/mine/index',
    'pages/seedling/index',
    'pages/mariculture/index',
    'pages/harvest/index',
    'pages/drying/index',
    'pages/cost/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0077B6',
    navigationBarTitleText: '海养合作社',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#0077B6',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/farming/index',
        text: '养殖'
      },
      {
        pagePath: 'pages/processing/index',
        text: '加工'
      },
      {
        pagePath: 'pages/sales/index',
        text: '销售'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
