const Jimp = require('jimp')
const debug = require('debug')('dcode-serverless:common-lib:image-resizer')
const _ = require('lodash')

class ImageResizer {
  download (url) {
    return new Promise((resolve, reject) => {
      debug(` Download Start: `, url)

      Jimp.read(url)
        .then(function (image) {
          image.getBuffer(image.getMIME(), function (err, buffer) {
            if (err) {
              return reject(err)
            }

            return resolve({
              'mime': image.getMIME(),
              'extension': image.getExtension(),
              'width': image.bitmap.width,
              'height': image.bitmap.height,
              'buffer': buffer
            })
          })
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  resize (image, options) {
    return new Promise((resolve, reject) => {
      debug(` Resize Start: `, options)

      Jimp.read(image.buffer)
        .then(lenna => {
          let width = _.toNumber(options.width) > 0 ? _.toNumber(options.width) : Jimp.AUTO
          let height = _.toNumber(options.height) > 0 ? _.toNumber(options.height) : Jimp.AUTO
          var resizedImg = lenna.resize(width, height).quality(100)

          resizedImg.getBuffer(resizedImg.getMIME(), function (err, buffer) {
            if (err) {
              return reject(err)
            }

            return resolve({
              'mime': resizedImg.getMIME(),
              'extension': resizedImg.getExtension(),
              'width': resizedImg.bitmap.width,
              'height': resizedImg.bitmap.height,
              'buffer': buffer
            })
          })
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
}

module.exports = ImageResizer
