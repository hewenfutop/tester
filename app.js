let AfuFile = require('./AfuBase/lib/AfuFile')
let AfuString = require('./AfuBase/lib/AfuString')
let AfuExcel = require('./AfuBase/lib/AfuFileExcel')
let UploadImages = require('./AfuBase/fun/UploadImage')

let up = new UploadImages('C:\\Users\\wicture\\Pictures', '11.jpg')
up.upload().then(res => {
  console.log('OK')
}).catch(err => {
  console.log('ERR')
})

