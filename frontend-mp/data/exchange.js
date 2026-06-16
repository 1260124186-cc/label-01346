/**
 * 积分兑换商品数据
 */
const EXCHANGE_GOODS = [
  {
    id: 1,
    name: '环保购物袋',
    description: '可重复使用的环保购物袋，减少塑料袋使用',
    points: 100,
    originalPoints: 150,
    image: '/images/goods/goods1.jpg',
    stock: 50,
    sales: 128,
    tag: '热门'
  },
  {
    id: 2,
    name: '便携餐具套装',
    description: '不锈钢材质，包含筷子、勺子、叉子',
    points: 200,
    originalPoints: 280,
    image: '/images/goods/goods2.jpg',
    stock: 30,
    sales: 86,
    tag: '推荐'
  },
  {
    id: 3,
    name: '保温杯',
    description: '316不锈钢内胆，保温12小时',
    points: 500,
    originalPoints: 680,
    image: '/images/goods/goods3.jpg',
    stock: 20,
    sales: 45,
    tag: ''
  },
  {
    id: 4,
    name: '竹纤维毛巾',
    description: '天然竹纤维，柔软亲肤，抗菌抑菌',
    points: 150,
    originalPoints: 200,
    image: '/images/goods/goods4.jpg',
    stock: 100,
    sales: 256,
    tag: '热门'
  },
  {
    id: 5,
    name: '可降解垃圾袋',
    description: '玉米淀粉材质，3个月自然降解',
    points: 80,
    originalPoints: 100,
    image: '/images/goods/goods5.jpg',
    stock: 200,
    sales: 512,
    tag: '热门'
  },
  {
    id: 6,
    name: '多肉植物盆栽',
    description: '精选多肉植物，含陶瓷花盆',
    points: 300,
    originalPoints: 400,
    image: '/images/goods/goods6.jpg',
    stock: 15,
    sales: 32,
    tag: '限量'
  }
]

module.exports = {
  EXCHANGE_GOODS
}
