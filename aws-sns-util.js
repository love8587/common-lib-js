const debug = require('debug')('dcode-serverless:lib:event-writer-rdb')
const _ = require('lodash')

function extractTopicName (topicArn) {
  let topicNameArr = _.split(topicArn, ':')
  return topicNameArr[topicNameArr.length - 1]
}

function initSns (Sns) {
  try {
    Sns.Message = JSON.parse(Sns.Message)
  } catch (e) { throw e }

  Sns.topicName = extractTopicName(Sns.TopicArn)
}

function isStageEqual (Sns, processStage) {
  debug(' isStageEqual() -- Sns.Message.envStage --> ', Sns.Message.envStage)
  debug(' processStage() -- processStage --> ', processStage)

  if (!Sns || !Sns.Message || !Sns.Message.envStage || !processStage) {
    return new Error('Not passed Required Param')
  }

  return Sns.Message.envStage.toUpperCase() === processStage.toUpperCase()
}

function hasRequester (Sns) {
  if (!Sns || !Sns.Message) {
    return new Error('Sns.Message Not found')
  }

  debug(' Sns.Message.requester ', Sns.Message.requester)
  return !!(Sns.Message.requester)
}

function isStandard (Sns, envStage) {
  initSns(Sns)
  return hasRequester(Sns) && isStageEqual(Sns, envStage)
}

module.exports.extractTopicName = extractTopicName
module.exports.initSns = initSns
module.exports.isStageEqual = isStageEqual
module.exports.hasRequester = hasRequester
module.exports.isStandard = isStandard
