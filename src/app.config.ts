export default defineAppConfig({
  pages: [
    'pages/carbon/index',
    'pages/record/index',
    'pages/carbon-detail/index',
    'pages/honors/index',
    'pages/carbon-certificate/index',
    'pages/index/index'
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#22c55e',
    navigationBarTitleText: '碳账本',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f0fdf4',
    enablePullDownRefresh: true
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#22c55e',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/carbon/index',
        text: '碳账本'
      },
      {
        pagePath: 'pages/index/index',
        text: '发现'
      },
      {
        pagePath: 'pages/honors/index',
        text: '荣誉'
      }
    ]
  }
})
