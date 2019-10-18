let AfuHttp = require('../lib/AfuHttp')
let AfuFile = require('../lib/AfuFile')
let AfuString = require('../lib/AfuString')
let fs = require('fs')
const FormData = require('form-data')
module.exports = class UploadImage {
  constructor (dir, name) {
    this.file = new AfuFile(dir, name)
  }

  upload () {
    // LINK  https://stackoverflow.com/questions/5744990/how-to-upload-a-file-from-node-js?tdsourcetag=s_pcqq_aiomsg
    return new Promise((resolve, reject) => {
      this.file.readFileAsText().then(res => {
        console.log(res)
        console.log(res.toString())
        let buf = Buffer.from(res)
        let str = buf.toString('binary')
        console.log(str)
        let http = new AfuHttp()
        http.setHostName('service.91autoparts.com')
        http.setPort('')
        http.setPath('pub/file/upload/image?key=176ebdaec845dc55e891fd82fb8895a8&category=stock&cdn=1')
        http.setHeader({'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryPNradrqKIB65AiqB'})
        http.setData('------WebKitFormBoundaryPNradrqKIB65AiqB\n' +
          'Content-Disposition: form-data; name="file"; filename="u=414732175,1016188752&fm=26&gp=0.jpg"\n' +
          'Content-Type: image/jpeg\n\n' + str + '\n------WebKitFormBoundaryPNradrqKIB65AiqB--')
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

    })
  }
}