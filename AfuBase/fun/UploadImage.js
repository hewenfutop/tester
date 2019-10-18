let AfuHttp = require('../lib/AfuHttp')
let AfuFile = require('../lib/AfuFile')
let AfuString = require('../lib/AfuString')
const FormData = require('form-data')
module.exports = class UploadImage {
  constructor (dir, name) {
    this.file = new AfuFile(dir, name)
  }

  upload () {
    return new Promise((resolve, reject) => {
      this.file.readFileAsText(true).then(res => {
        console.log(res)
        let buf = Buffer.from(res)
        let str = buf.toString('binary')
        console.log(str)
        let form = new FormData()
        form.append('file', str)
        console.log('FORM', form)

        let http = new AfuHttp()
        http.setHostName('service.91autoparts.com')
        http.setPort('')
        http.setPath('pub/file/upload/image?key=176ebdaec845dc55e891fd82fb8895a8&category=stock&cdn=1')
        http.setHeader({
          'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryNyKpY4WFj60fZE4Q'
        })
        http.setData(form)
        http.postHttps(true, true).then(res => {
          console.log('图片回复')
          console.log(res)
          resolve()
        }).catch(err => {
          console.log('图片发布失败')
          console.log(err)
          reject()
        })
        console.log(http)
      }).catch(err => {
        console.log('文件读取失败')
        reject()
      })

      // let http = new AfuHttp()
      // http.postHttps(true).then(res => {
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })
    })

  }
}