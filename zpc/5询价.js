let AfuHttp = require('../AfuBase/lib/AfuHttp')
let http = new AfuHttp()

let postInquiryData = {
  publishType: 2,
  basketPartIds: [],
  days: 3,
  inquiry: {
    vin: "CHEJAHA",
    brandCode: 'honda',
    brandName: "本田",
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

http.setPath('zpc/market/inquiry/publish')
http.setData(postInquiryData)
http.post().then(res => {
  console.log(res)
}).catch(err => {
  console.log('询价失败')
})