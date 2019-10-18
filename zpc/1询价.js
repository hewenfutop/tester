let AfuHttp = require('../AfuBase/AfuHttp')
let AfuLogin = require('../AfuBase/AfuLogin')
let brandInfo = require('./com/brands')
let http = new AfuHttp()
let login = new AfuLogin()

let postInquiryData = {
  publishType: 2,
  basketPartIds: [],
  days: 3,
  inquiry: {
    vin: "CHEJAHA",
    brandCode: brandInfo.getCodeByName('江铃'),
    brandName: "江铃",
    carModel: "chexing",
    memo: "memobeihu ",
    invoiceId: 2,
    invoice: "专用发票",
    categories: "拆车件,配套件",
    inquiryer: "虹口区虹湾路汽配商",
    phone: "17891902235",
    province: "广西壮族自治区",
    city: "崇左市"
  },
  images: [],
  parts: [
    {
      oeNo: "391397S1005",
      quantity: 1,
      name: "空调O型圈"
    }
  ]
}


login.getHistoryToken().then(res => {
  http.setToken(res)
  http.setPath('zpc/market/inquiry/publish')
  http.setData(postInquiryData)
  http.post().then(res => {
    console.log(res)
  }).catch(err => {
    console.log('询价失败')
  })
  console.log(http)
}).catch(err => {
  console.log('登录Token获取失败或者需要更新')
})