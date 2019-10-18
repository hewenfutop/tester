let AfuFile = require('./AfuFile')
let AfuString = require('./AfuString')
module.exports = class AfuFileExcel {
  constructor (dir, name) {
    this.file = new AfuFile(dir, name)
  }

  parseTableToObjectArray (keyRowIndexEnd = 1) { // 用于读取CSV文件后的解析
    return new Promise((resolve, reject) => {
        this.readCSVFile().then(res => {
          let rows = res.split('\r\n').filter(e => e)
          let header = rows.slice(0, keyRowIndexEnd)
          // 头部解析
          let arr = header.map(e => e.split(','))
          let transArr = []
          // 填补
          for (let i = 0; i < arr.length; i++) {
            for (let k = 1; k < arr[i].length; k++) {
              if (arr[i][k] === '') {
                arr[i][k] = arr[i][k - 1]
              }
            }
          }
          // 转置
          for (let i = 0; i < arr.length; i++) {
            for (let k = 0; k < arr[i].length; k++) {
              if (!transArr[k]) {
                transArr[k] = []
              }
              arr[i][k] !== '' && (transArr[k][i] = arr[i][k])
            }
          }
          // 解析数据
          // 如果是数组，那么需要回溯找到共同祖先的非数组属性，才能知道当前数组有哪些
          console.log(arr)
          console.log(transArr)
          resolve()
        }).catch(err => {
          console.log('打开CSV失败')
        })
      }
    )
  }

  readCSVFile () {
    return new Promise((resolve, reject) => {
      this.file.readFileAsText(true).then(res => {
        let str = new AfuString(res)
        str = str.gbkToString()
        resolve(str)
      }).catch(err => {
        console.log('读取CSV失败')
        reject(err)
      })
    })
  }
}