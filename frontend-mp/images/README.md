# 图片资源说明

本目录用于存放小程序所需的图片资源。

## 目录结构

```
images/
├── tabbar/                 # TabBar 图标
│   ├── home.png           # 首页图标（未选中）
│   ├── home-active.png    # 首页图标（选中）
│   ├── gift.png           # 积分兑换图标（未选中）
│   ├── gift-active.png    # 积分兑换图标（选中）
│   ├── user.png           # 我的图标（未选中）
│   └── user-active.png    # 我的图标（选中）
├── trash/                  # 垃圾分类图标
│   ├── recyclable.png     # 可回收物
│   ├── harmful.png        # 有害垃圾
│   ├── kitchen.png        # 厨余垃圾
│   └── other.png          # 其他垃圾
├── icons/                  # 功能图标
│   ├── search.png         # 搜索
│   ├── scan.png           # 扫码
│   ├── guide.png          # 指南
│   ├── quiz.png           # 问答
│   ├── history.png        # 历史记录
│   ├── coin.png           # 积分
│   ├── order.png          # 订单
│   ├── message.png        # 消息
│   ├── info.png           # 信息
│   └── setting.png        # 设置
└── default-avatar.png      # 默认头像
```

## 图标规格

### TabBar 图标
- 尺寸：81px × 81px
- 格式：PNG（支持透明背景）
- 未选中状态：灰色 (#B2BEC3)
- 选中状态：主题绿色 (#5BBD72)

### 垃圾分类图标
- 尺寸：128px × 128px
- 格式：PNG（支持透明背景）
- 建议使用扁平化设计风格

### 功能图标
- 尺寸：64px × 64px
- 格式：PNG（支持透明背景）
- 颜色：主题绿色 (#5BBD72)

## 推荐图标资源

1. **阿里巴巴矢量图标库**: https://www.iconfont.cn/
2. **Flaticon**: https://www.flaticon.com/
3. **Icons8**: https://icons8.com/

## 注意事项

1. 所有图标建议使用 2x 或 3x 分辨率以适配高清屏幕
2. TabBar 图标文件大小建议不超过 40KB
3. 图片命名使用小写字母和连字符
