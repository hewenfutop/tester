let http = require('http')
let https = require('https')
let AfuStore = require('./AfuStore')
module.exports = class PostData {
  constructor () {
    this.hostName = 'dev.91qpzs.com'
    this.port = 9099
    this.data = ''
    this.token = ''
  }

  setToken (token) {
    this.token = token
    return this
  }

  getTokenFromStore (isNotToken) {
    return new Promise((resolve, reject) => {
      if (isNotToken) {
        resolve('')
      } else {
        AfuStore.getValue('token').then(res => {
          resolve(res)
        }).catch(err => {
          reject()
        })
      }
    })
  }


  setData (data) {
    // this.data = typeof data === 'string' ? data : qs.stringify(data)
    this.data = data
    return this
  }

  setHostName (host) {
    host && (this.hostName = host)
    return this
  }

  setPort (p) {
    this.port = p
    return this
  }

  setPath (p) {
    this.path = p || ''
    return this
  }

  setHeader (header) {
    this.header = header
    return this
  }

  get (isNotToken) {
    return new Promise((resolve, reject) => {
      this.getTokenFromStore(isNotToken).then(res => {
        let queryString = []
        for (let key in this.data) {
          if (this.data.hasOwnProperty(key)) {
            queryString.push(`${key}=${this.data[key]}`)
          }
        }
        queryString = queryString.join('&')
        let options = {
          hostname: this.hostName,
          port: this.port,
          path: (this.path[0] === '/' ? this.path : '/' + this.path) + (queryString ? '?' + queryString : ''),
          method: 'GET',
          'Authorization': this.token || res,
          'From': 'Zpc_Saas'
        }

        for (let key in this.header) {
          if (this.header.hasOwnProperty(key)) {
            options.headers[key] = this.header[key]
          }
        }

        let req = http.request(options, res => {
          res.on('data', chunk => {
            resolve(chunk.toString())
          })
        })
        req.on('error', e => {
          console.log('访问错误 ', e.message)
          reject()
        })
        req.write(this.data)
        req.end()
      })
    }).catch(err => {

    })

  }


  post (isNotToken, isNotJson) {
    return new Promise((resolve, reject) => {
      this.getTokenFromStore(isNotToken).then(res => {
        let options = {
          hostname: this.hostName,
          port: this.port,
          path: this.path[0] === '/' ? this.path : '/' + this.path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.token || res,
            'From': 'Zpc_Saas'
          }
        }
        console.log(options)
        for (let key in this.header) {
          if (this.header.hasOwnProperty(key)) {
            options.headers[key] = this.header[key]
          }
        }

        let req = http.request(options, res => {
          res.on('data', chunk => {
            resolve(chunk.toString())
          })
        })
        req.on('error', e => {
          console.log('访问错误 ', e.message)
          reject()
        })
        req.write(isNotJson ? this.data : JSON.stringify(this.data))
        req.end()
      }).catch(err => {
        console.log('http token 生成错误')
        reject()
      })
    })
  }


  postHttps (isNotToken, isNotJson) {
    return new Promise((resolve, reject) => {
      this.getTokenFromStore(isNotToken).then(res => {
        let options = {
          hostname: this.hostName,
          port: this.port,
          path: this.path[0] === '/' ? this.path : '/' + this.path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.token || res,
            'From': 'Zpc_Saas'
          }
        }

        for (let key in this.header) {
          if (this.header.hasOwnProperty(key)) {
            options.headers[key] = this.header[key]
          }
        }
        console.log(options)
        let req = https.request(options, res => {
          res.on('data', chunk => {
            resolve(chunk.toString())
          })
        })
        req.on('error', e => {
          console.log('访问错误 ', e.message)
          reject()
        })
        req.write(isNotJson ? this.data : JSON.stringify(this.data))
        req.end()
      }).catch(err => {
        console.log('http token 生成错误')
        reject()
      })
    })
  }

}