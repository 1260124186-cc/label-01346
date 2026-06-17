const app = getApp()
const { showToast, navigateBack } = require('../../utils/util')

const PROVINCE_LIST = ['北京市', '上海市', '广东省', '江苏省', '浙江省', '山东省', '四川省', '湖北省', '湖南省', '河南省', '福建省', '安徽省', '河北省', '陕西省', '辽宁省', '黑龙江省', '吉林省', '江西省', '山西省', '云南省', '贵州省', '广西省', '甘肃省', '内蒙古', '新疆', '海南省', '宁夏', '青海省', '西藏']

Page({
  data: {
    addressId: '',
    isEdit: false,
    form: {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false
    },
    regionIndex: [0, 0, 0],
    provinceList: PROVINCE_LIST,
    cityList: [],
    districtList: [],
    regionText: '请选择省市区'
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ 
        addressId: options.id,
        isEdit: true
      })
      wx.setNavigationBarTitle({ title: '编辑地址' })
      this.loadAddress(options.id)
    } else {
      wx.setNavigationBarTitle({ title: '新增地址' })
    }
    
    this.initCityData()
  },

  initCityData() {
    const cityMap = {
      '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '通州区', '顺义区', '昌平区', '大兴区', '房山区', '门头沟区', '怀柔区', '平谷区', '密云区', '延庆区'],
      '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
      '广东省': ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '湛江市', '肇庆市', '江门市', '茂名市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
      '江苏省': ['南京市', '苏州市', '无锡市', '常州市', '镇江市', '南通市', '泰州市', '扬州市', '盐城市', '连云港市', '徐州市', '淮安市', '宿迁市'],
      '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
      '山东省': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'],
      '四川省': ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市'],
      '湖北省': ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市'],
      '湖南省': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市'],
      '河南省': ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市'],
      '福建省': ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'],
      '安徽省': ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市'],
      '河北省': ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'],
      '陕西省': ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
      '辽宁省': ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'],
      '黑龙江省': ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市'],
      '吉林省': ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市'],
      '江西省': ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'],
      '山西省': ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'],
      '云南省': ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市'],
      '贵州省': ['贵阳市', '六盘水市', '遵义市', '安顺市', '毕节市', '铜仁市'],
      '广西省': ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'],
      '甘肃省': ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市'],
      '内蒙古': ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市'],
      '新疆': ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市'],
      '海南省': ['海口市', '三亚市', '三沙市', '儋州市'],
      '宁夏': ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
      '青海省': ['西宁市', '海东市'],
      '西藏': ['拉萨市', '日喀则市', '昌都市', '林芝市', '山南市', '那曲市', '阿里地区']
    }
    
    this.cityMap = cityMap
    
    const defaultProvince = PROVINCE_LIST[0]
    const defaultCities = Object.keys(cityMap[defaultProvince] || {})
    const cityName = defaultCities[0] || ''
    const districts = cityMap[defaultProvince] && cityMap[defaultProvince].length > 0 ? cityMap[defaultProvince] : []
    
    const districtList = []
    for (let i = 1; i <= 10; i++) {
      districtList.push('区县' + i)
    }
    
    this.setData({
      cityList: cityMap[defaultProvince] || [],
      districtList: districtList
    })
  },

  loadAddress(id) {
    const address = app.getAddressById(id)
    if (address) {
      this.setData({
        form: {
          name: address.name || '',
          phone: address.phone || '',
          province: address.province || '',
          city: address.city || '',
          district: address.district || '',
          detail: address.detail || '',
          isDefault: address.isDefault || false
        },
        regionText: (address.province || '') + (address.city || '') + (address.district || '') || '请选择省市区'
      })
    }
  },

  onNameInput(e) {
    this.setData({
      'form.name': e.detail.value
    })
  },

  onPhoneInput(e) {
    this.setData({
      'form.phone': e.detail.value
    })
  },

  onDetailInput(e) {
    this.setData({
      'form.detail': e.detail.value
    })
  },

  onRegionChange(e) {
    const value = e.detail.value
    const province = this.data.provinceList[value[0]]
    const cityArr = this.cityMap[province] || []
    const cityIndex = Math.min(value[1], cityArr.length - 1)
    const city = cityArr[cityIndex] || ''
    const districtIndex = Math.min(value[2], 9)
    const district = city ? city + '区' + (districtIndex + 1) : ''
    
    this.setData({
      regionIndex: [value[0], cityIndex, districtIndex],
      cityList: cityArr,
      'form.province': province,
      'form.city': city,
      'form.district': district,
      regionText: province + city + district
    })
  },

  onDefaultChange(e) {
    this.setData({
      'form.isDefault': e.detail.value
    })
  },

  validateForm() {
    const { name, phone, province, detail } = this.data.form
    
    if (!name.trim()) {
      showToast('请输入收货人姓名')
      return false
    }
    
    if (!phone.trim()) {
      showToast('请输入手机号码')
      return false
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
      showToast('请输入正确的手机号码')
      return false
    }
    
    if (!province) {
      showToast('请选择省市区')
      return false
    }
    
    if (!detail.trim()) {
      showToast('请输入详细地址')
      return false
    }
    
    return true
  },

  onSave() {
    if (!this.validateForm()) return
    
    const { form, isEdit, addressId } = this.data
    
    if (isEdit) {
      app.updateAddress(addressId, form)
      showToast('修改成功')
    } else {
      app.addAddress(form)
      showToast('添加成功')
    }
    
    setTimeout(() => {
      navigateBack()
    }, 1000)
  }
})
