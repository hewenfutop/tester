let AfuLogin = require('../AfuBase/AfuLogin')
let p = new AfuLogin()
p.login('15307153187', 123456).then(res => {
  console.log('登录成功')
  console.log(p.getToken())
  p.saveToken(p.getToken()).then(res => {
    console.log('保存token成功')
  }).catch(err => {
    console.log('保存token失败')
  })
}).catch(err => {
  console.log('获取token失败')
}).catch(() => {
  console.log('登录失败')
})