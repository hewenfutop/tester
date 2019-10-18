let AfuLogin = require('../AfuBase/fun/AfuLogin')
let p = new AfuLogin()
p.login('17891902235', '123456').then(res => {
  console.log('登录成功')
}).catch(err => {
  console.log('获取token失败')
}).catch(() => {
  console.log('登录失败')
})