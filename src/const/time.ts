import utils from '~/utils'

const { minutesToMilliseconds } = utils

const WORKING_TIME_MIN = 25
const RESTING_TIME_MIN = 5

const WORKING_TIME_MS = minutesToMilliseconds(WORKING_TIME_MIN)
const RESTING_TIME_MS = minutesToMilliseconds(RESTING_TIME_MIN)

export default {
  WORKING_TIME_MIN,
  RESTING_TIME_MIN,
  WORKING_TIME_MS,
  RESTING_TIME_MS,
}
