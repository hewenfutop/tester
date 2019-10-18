let fs = require('fs')
let path = require('path')
let reg = require('../data/reg')
module.exports = class FileController {
  constructor (dir, file) {
    this.dir = dir
    this.file = file
    this.fullpath = path.resolve(this.dir, this.file)
  }

  isFileExist () {
    return new Promise((resolve, reject) => {
      fs.stat(this.fullpath, (err, state) => {
        if (err) {
          resolve(false)
        } else {
          resolve(state.isFile())
        }
      })
    })
  }

  isFolderExist () {
    return new Promise((resolve, reject) => {
      console.log('----', this.dir)
      fs.stat(this.dir, (err, state) => {
        if (err) {
          console.log(err)
          resolve(false)
        } else {
          console.log('====', state.isDirectory())
          resolve(state.isDirectory())
        }
      })
    })
  }

  isFile () {
    return new Promise((resolve, reject) => {
      fs.stat(this.fullpath, (err, state) => {
        if (err) {
          reject(new Error('文件不存在'))
        } else {
          resolve(state.isFile())
        }
      })
    })
  }

  isFolder () {
    return new Promise((resolve, reject) => {
      fs.stat(this.dir, (err, state) => {
        if (err) {
          reject(new Error('文件夹不存在'))
        } else {
          reject(state.isDirectory())
        }
      })
    })
  }

  createDir () {
    let mkd = new Promise((resolve, reject) => {
      fs.mkdir(this.dir, err => {
        err ? reject(new Error('创建文件夹失败')) : resolve()
      })
    })

    return new Promise((resolve, reject) => {
      this.isFolder().then(res => {
        if (res) {
          resolve()
        } else {
          reject(new Error('已经存在的文件状态'))
        }
      }).catch(err => {
        mkd.then(res => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    })
  }

// 创建深路径
  ensureDir () {
    let ensureTemp = () => {
      return new Promise((resolve, reject) => {
        let sp = []
        if (~this.dir.indexOf('/')) {
          sp = this.dir.split('/')
        } else {
          sp = this.dir.split('\\')
        }
        if (sp.length) {
          let currentList = []
          for (let i = 0; i < sp.length; i++) {
            currentList.push(sp[i])
            let currentPath = currentList.join('/')
            try {
              let stat = fs.statSync(currentPath)
              console.log('SSS', currentPath, stat)
              if (!stat.isDirectory()) {
                let res = fs.mkdirSync(currentPath)
                console.log('NP=============', currentPath, res)
                if (res) {
                  reject('创建其中的某个路径失败' + currentPath)
                  return
                }
              }
            } catch (e) {
              let res = fs.mkdirSync(currentPath)
              console.log('NP=============', currentPath, res)
              if (res) {
                reject('创建其中的某个路径失败' + currentPath)
                return
              }

            }
          }
        } else {
          reject('创建文件夹的路径失败')
        }
        this.isFolderExist().then(res => {
          res ? resolve() : reject(new Error('创建保证的文件夹失败'))
        }).catch(err => {
          reject(new Error('创建保证的文件夹失败'))
        })
      })
    }

    return new Promise((resolve, reject) => {
      this.isFolderExist().then(res => {
        if (res) {
          resolve()
        } else {
          ensureTemp().then(res => {
            resolve()
          }).catch(err => {
            reject(err)
          })
        }
      }).catch(err => {
        ensureTemp().then(res => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    })
  }

  createFile () {
    return new Promise((resolve, reject) => {
      this.isFolderExist().then(res => {
        if (res) {
          fs.writeFile(this.fullpath, '', err => {
            if (err) {
              reject(new Error('创建文件失败'))
            } else {
              resolve()
            }
          })
        } else {
          reject(new Error('文件夹不存在，创建文件失败'))
        }
      }).catch(err => {
        reject(new Error('读物文件夹状态失败，创建文件失败'))
      })
    })
  }

// 创建深文件
  ensureFile () {
    return new Promise((resolve, reject) => {
      this.ensureDir().then(res => {
        this.createFile().then(res => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
    })
  }

  deleteDir () {
    let deleteFolder = (path) => {
      let files = []
      if (fs.existsSync(path)) {
        files = fs.readdirSync(path)
        files.forEach(file => {
          let curPath = path + "/" + file
          if (fs.statSync(curPath).isDirectory()) {
            deleteFolder(curPath)
          } else {
            fs.unlinkSync(curPath)
          }
        })
        fs.rmdirSync(path)
        return 0
      } else {
        return 1
      }
    }
    return new Promise((resolve, reject) => {
      let res = deleteFolder(this.dir)
      if (res === 0) {
        resolve()
      } else {
        reject(new Error('删除文件夹成功'))
      }
    })
  }

  deleteFile () {
    return new Promise((resolve, reject) => {
      fs.stat(this.fullpath, (err, state) => {
        if (err) {
          resolve()
        } else {
          if (state.isDirectory()) {
            reject(new Error('是文件夹，不能进行删除文件的操作'))
          } else if (state.isFile()) {
            fs.unlink(this.fullpath, err => {
              if (err) {
                reject(new Error('删除失败'))
              } else {
                resolve()
              }
            })
          } else {
            reject(new Error('不能识别的文件或者文件夹'))
          }
        }
      })
    })
  }

  readDir () {
    return new Promise((resolve, reject) => {
      fs.readdir(this.dir, (err, files) => {
        err ? reject(new Error('获取文件夹内容失败')) : resolve(files)
      })
    })
  }

  getFileState () {
    return new Promise((resolve, reject) => {
      fs.stat(this.fullpath, (err, stats) => {
        err ? reject(new Error('获取文件信息失败')) : resolve(stats)
      })
    })
  }

  getFolderState () {
    return new Promise((resolve, reject) => {
      fs.stat(this.dir, (err, stats) => {
        err ? reject(new Error('获取文件夹信息失败')) : resolve(stats)
      })
    })
  }

  renameFile (newName) {
    return new Promise((resolve, reject) => {
      if (reg.isFileName(newName)) {
        let newFilePath = path.resolve(this.dir, newName)
        fs.rename(this.fullpath, newFilePath, err => {
          if (err) {
            reject(new Error('重命名失败'))
          } else {
            this.file = newName
            this.fullpath = path.resolve(this.dir, this.file)
            resolve()
          }
        })
      } else {
        reject(new Error('重命名失败，不是合法的文件名称'))
      }
    })
  }

  renameDir (newName) {
    return new Promise((resolve, reject) => {
      console.log(reg.isFolderName(newName), newName)
      if (reg.isFolderName(newName)) {
        let sp = []
        if (~this.dir.indexOf('/')) {
          sp = this.dir.split('/')
        } else {
          sp = this.dir.split('\\')
        }
        sp = sp.filter(e => e)
        if (sp.length) {
          sp[sp.length - 1] = newName
          let newPath = sp.join('/')
          console.log('NP', newPath)
          fs.rename(this.dir, newPath, err => {
            if (err) {
              console.log(err)
              reject(new Error('重命名失败'))
            } else {
              this.dir = newPath + '/'
              this.fullpath = path.resolve(this.dir, this.file)
              resolve()
            }
          })
        } else {
          reject('错误的路径拼接')
        }
      } else {
        reject(new Error('重命名失败，不是合法的文件夹名称'))
      }
    })
  }

  moveFile (targetDir) {
    return new Promise((resolve, reject) => {
      let file = new FileController(targetDir, '')
      file.isFolderExist().then(res => {
        if (res) {
          let newPath = path.resolve(targetDir, this.file)
          fs.rename(this.fullpath, newPath, err => {
            if (err) {
              reject(new Error('移动文件失败'))
            } else {
              resolve()
            }
          })
        } else {
          reject(new Error('目标文件夹不存在'))
        }
      }).catch(err => {
        reject(new Error('目标文件夹不存在'))
      })
    })
  }

  moveDir (targetDir) { // 将目录移动到target下面
    return new Promise((resolve, reject) => {
      let file = new FileController(targetDir, '')
      file.isFolderExist().then(res => {
        if (res) {
          let arr = this.dir.split(~this.dir.indexOf('/') ? '/' : '\\').filter(e => e)
          if (arr.length) {
            let dirName = arr.pop()
            let newDir = path.resolve(targetDir, dirName)
            let d = new FileController(newDir, '')
            let moveDirTemp = () => {
              fs.rename(this.dir, newDir, err => {
                if (err) {
                  console.log(err)
                  reject(new Error('移动文件夹失败'))
                } else {
                  resolve()
                }
              })
            }

            d.isFolderExist().then(res => {
              if (res) {
                reject('文件夹已经存在')
              } else {
                moveDirTemp()
              }
            }).catch(err => {
              moveDirTemp()
            })
          } else {
            reject(new Error('解析源文件夹错误'))
          }
        } else {
          reject(new Error('目标文件夹不存在'))
        }
      }).catch(err => {
        reject(new Error('目标文件夹不存在'))
      })
    })
  }

  copyFile (targetPath) {
    return new Promise((resolve, reject) => {
      let task = []
      let f = new FileController(targetPath, this.file)
      let copyFileTemp = () => {
        try {
          let readHandle = fs.createReadStream(this.fullpath)
          let writeHandle = fs.createWriteStream(f.fullpath)
          readHandle.pipe(writeHandle)
        } catch (e) {
          reject(new Error('复制文件失败'))
        }
      }
      this.isFileExist().then(res => {
        if (res) {
          f.isFolderExist().then(res => {
            if (res) {
              copyFileTemp()
            } else {
              reject(new Error('目标文件夹不存在'))
            }
          }).catch(err => {
            reject(new Error('读取目标文件夹状态信息错误'))
          })
        } else {
          reject(new Error('源文件不存在'))
        }
      }).catch(err => {
        reject(new Error('源文件状态读取错误'))
      })
    })
  }

  readFileAsText (isSource = false) {
    return new Promise((resolve, reject) => {
      this.isFileExist().then(res => {
        if (res) {
          fs.readFile(this.fullpath, (err, res) => {
            if (err) {
              reject(new Error('文件读取失败'))
            } else {
              resolve(isSource ? res : res.toString())
            }
          })
        } else {
          reject(new Error('文件不存在'))
        }
      }).catch(err => {
        reject(new Error('读取文件信息错误'))
      })
    })
  }

  readFileAsBase64 (type = 'image/png', isSource = false) {
    return new Promise((resolve, reject) => {
      if (type) {
        this.isFileExist().then(res => {
          if (res) {
            fs.readFile(this.fullpath, (err, res) => {
              if (err) {
                reject(new Error('文件读取失败'))
              } else {
                resolve('data:' + type + ';base64,' + res.toString('base64'))
              }
            })
          } else {
            reject(new Error('文件不存在'))
          }
        }).catch(err => {
          reject(new Error('读取文件信息错误'))
        })
      } else {
        reject(new Error('不是有效的base64类型'))
      }
    })
  }

  saveText (text) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.fullpath, text, err => {
        err ? reject(new Error('保存内容失败')) : resolve()
      })
    })
  }

  getFileList () {
    return new Promise((resolve, reject) => {
      fs.readdir(this.dir, (err, files) => {
        if (err) {
          reject(new Error('获取文件列表失败'))
        }
        let promiseArr = []
        files.forEach(filename => {
          promiseArr.push(new Promise((resolve, reject) => {
            fs.stat(path.join(this.dir, filename), (err, stats) => {
              let type = stats ? (stats.isFile() ? 'file' : (stats.isDirectory() ? 'folder' : 'err')) : 'err'
              resolve({path: this.dir, name: filename, type: type})
            })
          }))
        })
        Promise.all(promiseArr).then(arr => {
          resolve(arr)
        }).catch(err => {
          reject(new Error('获取文件列表信息失败'))
        })
      })
    })
  }

  getAllFileList () {
    let getCurrentFileList = (folder) => {
      return new Promise((resolve, reject) => {
        fs.readdir(folder, function (err, files) {
          if (err) {
            reject(new Error('读取文件列表错误'))
          }
          let promiseArr = []
          files.forEach(filename => {
            promiseArr.push(new Promise((resolve, reject) => {
              let fullPath = path.join(folder, filename)
              fs.stat(fullPath, (err, stats) => {
                if (stats.isDirectory()) {
                  getCurrentFileList(fullPath).then(res => {
                    resolve(res)
                  }).catch(err => {
                    reject(err)
                  })
                } else if (stats.isFile()) {
                  resolve({path: folder, name: filename, type: 'file'})
                } else {
                  reject(new Error('错误的文件状态'))
                }
              })
            }))
          })
          Promise.all(promiseArr).then(arr => {
            resolve(arr)
          }).catch(err => {
            reject(new Error('获取文件列表信息失败'))
          })
        })
      })
    }
    return new Promise((resolve, reject) => {
      getCurrentFileList(this.dir).then(res => {
        resolve(res)
      }).catch(err => {
        reject(new Error('读取文件列表失败'))
      })
    })
  }
}
