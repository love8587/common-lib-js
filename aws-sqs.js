const AWS = require('aws-sdk')
const sqs = new AWS.SQS()
const debug = require('debug')('dcode-serverless:lib:aws-sqs')

async function receiveMessages (queueUrl, maxNumberOfMessages = 10, region = null) {
  return new Promise((resolve, reject) => {
    if (region) {
      sqs.config.update({'region': region})
    }

    var params = {
      'QueueUrl': queueUrl,
      'MaxNumberOfMessages': maxNumberOfMessages
    }

    sqs.receiveMessage(params, function (err, data) {
      if (err) {
        debug('[ERROR] sqs.receiveMessage', {'err': err, 'stack': err.stack})
        return reject(err)
      } else {
        debug(`[COMPLETE] sqs.receiveMessage`)
        return resolve(data)
      }
    })
  })
}

async function deleteMessage (queueUrl, ReceiptHandle, region = null) {
  return Promise((resolve, reject) => {
    if (region) {
      sqs.config.update({'region': region})
    }

    var params = {
      'QueueUrl': queueUrl,
      'ReceiptHandle': ReceiptHandle
    }

    sqs.deleteMessage(params, function (err, data) {
      if (err) {
        console.error(err, err.stack)
        return reject(err)
      }

      console.log('DELETED MESSAGE', data)           // successful response
      return resolve(data)
    })
  })
}

async function sendMessage (queueUrl, message, region) {
  return new Promise((resolve, reject) => {
    if (region) {
      sqs.config.update({'region': region})
    }

    var params = {
      'QueueUrl': queueUrl,
      'MessageBody': message
    }

    sqs.sendMessage(params, function (err, data) {
      if (err) {
        console.error(err, err.stack)
        return reject(err)
      }

      return resolve(data)
    })
  })
}

module.exports = {
  'receiveMessages': receiveMessages,
  'deleteMessage': deleteMessage,
  'sendMessage': sendMessage
}
