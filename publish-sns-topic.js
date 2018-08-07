const AWS = require('aws-sdk')
const sns = new AWS.SNS()

function publish (topicName, subject, message) {
  return new Promise((resolve, reject) => {
    var params = {
      'Message': message,
      'Subject': subject,
      'TopicArn': `arn:aws:sns:ap-northeast-2:992575464873:${topicName}`
    }

    sns.publish(params, function (err, data) {
      if (err) {
        console.log('SNS Topic publish ERROR ----------->', params, err, err.stack)
        return reject(err)
      }

      console.log('SNS Topic publish SUCCESS---------->', params, data)
      return resolve(data)
    })
  })
}

module.exports = publish
