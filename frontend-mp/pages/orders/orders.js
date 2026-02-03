/**
 * 兑换订单页面
 */
Page({
  data: {
    // 订单数据（全部显示为兑换成功）
    orderList: [
      {
        id: 1,
        goodsName: '环保购物袋',
        goodsDesc: '可重复使用的环保购物袋',
        goodsImage: '/images/goods/goods1.jpg',
        points: 100,
        quantity: 1,
        createTime: '2026-02-03 14:30'
      },
      {
        id: 2,
        goodsName: '便携餐具套装',
        goodsDesc: '不锈钢材质，包含筷子、勺子、叉子',
        goodsImage: '/images/goods/goods2.jpg',
        points: 200,
        quantity: 1,
        createTime: '2026-02-02 10:15'
      },
      {
        id: 3,
        goodsName: '竹纤维毛巾',
        goodsDesc: '天然竹纤维，柔软亲肤',
        goodsImage: '/images/goods/goods4.jpg',
        points: 150,
        quantity: 2,
        createTime: '2026-02-01 18:45'
      },
      {
        id: 4,
        goodsName: '保温杯',
        goodsDesc: '316不锈钢内胆，保温12小时',
        goodsImage: '/images/goods/goods3.jpg',
        points: 500,
        quantity: 1,
        createTime: '2026-01-28 09:20'
      }
    ]
  },

  onLoad() {
    console.log('[Orders] 页面加载')
  },

  /**
   * 再次兑换
   */
  onReorder(e) {
    wx.switchTab({
      url: '/pages/exchange/exchange'
    })
  },

  /**
   * 去兑换商品
   */
  goExchange() {
    wx.switchTab({
      url: '/pages/exchange/exchange'
    })
  },

  onPullDownRefresh() {
    console.log('[Orders] 下拉刷新')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
