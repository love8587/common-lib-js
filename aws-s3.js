const debug = require('debug')('dcode-serverless:common-lib:aws-s3')
const aws = require('aws-sdk')
const client = new aws.S3({ apiVersion: '2006-03-01' })

function get (bucketName, key) {
  return new Promise((resolve, reject) => {
    client.getObject({ 'Bucket': bucketName, 'Key': key }).promise().then((data) => {
      if ('img-processed' in data.Metadata) {
        return reject(new Error('Object was already processed.'))
      } else if (data.ContentLength <= 0) {
        return reject(new Error('Empty file or directory.'))
      } else {
        return resolve(data)
      }
    }).catch((err) => {
      return reject(new Error(`S3 getObject failed: ${err} : ${bucketName}/${key}`))
    })
  })
}

function upload (buffer, bucketName, key, options) {
  return new Promise((resolve, reject) => {
    const params = {
      'Bucket': bucketName,
      'Key': key,
      'Body': buffer,
      'Metadata': options.metadata,
      'ContentType': options.contentType,
      'ACL': options.acl || 'private' // public-read, private ...
    }

    debug(`Uploading to: ${params.Bucket}/${params.Key} - (${params.Body.length} bytes)`)

    return client.putObject(params).promise()
      .then(data => {
        return resolve(data)
      })
      .catch((err) => {
        return reject(new Error(`S3 getObject failed: ${err}`))
      })
  })
}

module.exports = {
  'get': get,
  'upload': upload
}
