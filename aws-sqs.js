const AWS = require('aws-sdk')
const sqs = new AWS.SQS()
const debug = require('debug')('dcode-serverless:lib:aws-sqs')

function receiveMessages (queueUrl, maxNumberOfMessages = 10) {
  return new Promise((resolve, reject) => {
    var params = {
      'QueueUrl': queueUrl,
      'MaxNumberOfMessages': maxNumberOfMessages
    }

    debug('[BEFORE] sqs.receiveMessage')

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

function deleteMessage (queueUrl, ReceiptHandle) {
  var params = {
    'QueueUrl': queueUrl,
    'ReceiptHandle': ReceiptHandle
  }

  sqs.deleteMessage(params, function (err, data) {
    if (err) console.log(err, err.stack) // an error occurred
    else console.log('DELETED MESSAGE', data)           // successful response
  })
}

module.exports = {
  'receiveMessages': receiveMessages,
  'deleteMessage': deleteMessage
}
