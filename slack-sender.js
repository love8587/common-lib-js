const debug = require('debug')('dcode-serverless:common-lib:slack-sender')
const _ = require('lodash')
const ApiRequester = require('./api-requester')

class SlackSender {
  constructor () {
    this._apiRequester = new ApiRequester()
  }

  validate (slackPayload) {
    return Promise.resolve(slackPayload)
  }

  requestSlackApi (url, method, payload) {
    return this._apiRequester.requestApi({
      'url': url,
      'method': method,
      'form': {
        'payload': JSON.stringify(payload)
      }
    })
  }

  sendMessageToChannel (channelPostUrl, slackPayload) {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(slackPayload)) {
        return reject(new Error({
          'message': 'slackPayload is empty',
          'data': slackPayload
        }))
      }

      this.validate(slackPayload)
        .then(validPayload => {
          if (_.includes(process.argv[2], 'FAKE')) {
            return Promise.resolve('NOT send slack message because of this is fake test mode now')
          }

          return this.requestSlackApi(channelPostUrl, 'POST', slackPayload)
        })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}

module.exports = SlackSender
