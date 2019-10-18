let AfuHttp = require('./AfuHttp')
let AfuFile = require('./AfuFile')
let path = require('path')

module.exports = class AfuLogin {
  constructor () {
    this.loginInfo = null
  }

  login (username, password = '123456') {
    this.p = new AfuHttp()
    this.p.setPath('zpc/auth')
    this.p.setData({username, password})
    return this.loginInfo ?
      Promise.resolve(this.loginInfo) :
      new Promise((resolve, reject) => {
        console.log('请求')
        this.p.post().then(res => {
          this.loginInfo = JSON.parse(res)
          resolve(res)
        }).catch(() => {
          reject()
        })
      })
  }

  saveToken (token) {
    return new Promise((resolve, reject) => {
      let file = new AfuFile(__dirname, 'token.afu')
      file.saveText(token).then(res => {
        console.log('token 保存成功')
        resolve()
      }).catch(err => {
        console.log('token 保存失败')
        reject()
      })
    })
  }

  getToken () {
    return 'bearer ' + (this.loginInfo && this.loginInfo.access_token || 'ERROR')
  }

  getHistoryToken () {
    return new Promise((resolve, reject) => {
      let file = new AfuFile(__dirname, 'token.afu')
      file.readFileAsText().then(res => {
        resolve(res)
      }).catch(err => {
        reject()
      })
    })
  }
}

let loginInfo = null
