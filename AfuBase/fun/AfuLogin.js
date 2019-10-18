let AfuHttp = require('../lib/AfuHttp')
let AfuStore = require('../lib/AfuStore')

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
        this.p.post(true).then(res => {
          this.loginInfo = JSON.parse(res)
          console.log('当前token', this.getCurrentTokenToken())
          this.saveToken(this.getCurrentTokenToken()).catch(err => {
          })
          this.saveUserInfo().catch(err => {
          })
          resolve(res)
        }).catch(() => {
          reject()
        })
      })
  }

  logout () {
    return new Promise((resolve, reject) => {
      let http = new AfuHttp()
      this.getToken().then(res => {
        http.setToken(res)
        http.setPath('zpc/system/passport/logout')
        http.post().then(res => {
          console.log('注销成功')
          resolve()
        }).catch(err => {
          console.log('注销失败')
          reject()
        })
      }).catch(err => {
        console.log('token 获取失败')
        reject()
      })
    })
  }

  saveUserInfo () {
    return new Promise((resolve, reject) => {
      AfuStore.saveValue('auth', this.loginInfo).then(res => {
        console.log('auth 保存成功')
        resolve()
      }).catch(err => {
        console.log('auth 保存失败')
        reject()
      })
    })
  }

  saveToken (token) {
    return new Promise((resolve, reject) => {
      AfuStore.saveValue('token', token).then(res => {
        console.log('token 保存成功')
        resolve()
      }).catch(err => {
        console.log('token 保存失败')
        reject()
      })
    })
  }

  getToken () {
    return new Promise((resolve, reject) => {
      AfuStore.getValue('token').then(res => {
        console.log('token 获取成功')
        resolve(res)
      }).catch(err => {
        console.log('token 获取失败')
        reject()
      })
    })
  }

  getCurrentTokenToken () {
    return 'bearer ' + (this.loginInfo && this.loginInfo.access_token || 'ERROR')
  }
}
