let AfuFile = require('./AfuBase/AfuFile')
let AfuString = require('./AfuBase/AfuString')
let AfuExcel = require('./AfuBase/AfuFileExcel')

let excel = new AfuExcel('', 'score.csv')
excel.readCSVFile().then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
excel.parseTableToObjectArray(3).then(res => {

}).catch(err => {

})


let obj = {
  company: '红弯路汽配商',
  code: '45',
  addr: {
    province: '上海',
    city: '虹口区'
  },
  parts: [
    {
      oe: '452275',
      quantity: 4,
      addr: [
        {
          province: 'bt',
          city: 'mnaskj'
        }, {
          province: 'bt',
          city: 'mnaskj'
        }
      ]
    }
  ]
}