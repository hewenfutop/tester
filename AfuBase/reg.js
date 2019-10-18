let obj = {
    number: /^-?(([0-9]+\.)?[0-9]+)?$/,
    int: /^(0|-?([1-9][0-9]*)?)$/,
    uint: /^(0|([1-9][0-9]*)?)$/,
    en: /^[a-zA-Z0-9 _\-<>,.'":;!@#$%^&*()+?=|\\~/[\]{}\r\n]*$/,
    enWord: /^[a-zA-Z0-9]*$/,
    phone: /^[0-9]+(-?[0-9-]+)?$/,
    currency: /^[0-9]+\.?[0-9]?[0-9]?$/,
    name: /[^&#\'\"\[\]\{\}\?\\]{6,20}/,
    email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    folderName: /^[^\\/:*?"<>|]+$/,
    fileName: /^[^*|\\:\"<>?/]{1,255}\.[^*|\\:\"<>?/\u4E00-\u9FA5]{0,15}$/,
    passWord: /^[A-Za-z0-9@#$%^&*()\-_+=]{6,30}$/
}

let reg = {list: obj}

for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
        let fun = key.substring(0, 1).toUpperCase() + key.substring(1)
        reg[`is${fun}`] = str => {
            console.log('KEY', key, fun)
            console.log('STR', str, obj[key])
            return obj[key].test(str)
        }
    }
}

module.exports = reg

