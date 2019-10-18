let AfuFile = require('../lib/AfuFile')
let path = require('path')
let storePath = path.resolve(__dirname, '../store/value')

module.exports = {
  saveValue (key, value) {
    return new Promise((resolve, reject) => {
      let file = new AfuFile(storePath, key)
      let json = JSON.stringify(value)
      console.log(file.fullpath)
      console.log(key, json)
      file.saveText(json).then(res => {
        resolve()
      }).catch(err => {
        reject()
      })
    })
  },
  getValue (key, isSoure) {
    return new Promise((resolve, reject) => {
      let file = new AfuFile(storePath, key)
      file.readFileAsText(isSoure).then(res => {
        resolve(JSON.parse(res))
      }).catch(err => {
        reject()
      })
    })
  }
}