const iconv = require('iconv-lite/lib/index') // npm i iconv-lite

module.exports = class AfuString {
  constructor (buf) {
    this.buf = Buffer.from(buf)
  }

  fromString (str) {
    this.buf = Buffer.from(str)
  }

  toString (encode) {
    this.buf.toString(encode)
  }

  gbkToString () {
    return iconv.decode(this.buf, 'gbk')
  }
}