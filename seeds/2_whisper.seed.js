const F = require('ng-faker');
const R = require('ramda');
const logger = require('winston');

const database = require('../db');
const { WHISPER_TABLE_NAME } = require('../utils/constants');
const shuffler = require('../utils/shuffle');


exports.seed = async knex => {
  try {
    const userIds = await database.knex('users').select('id');
    const flattenedUserIds = R.flatten(R.pluck('id', userIds));

    const createWhisper = () => ({
      text: F.lorem.phrase(),
      whisperer: R.take(1, shuffler(flattenedUserIds))[0],
      createdat: new Date()
    });
    const whispers = R.times(createWhisper, 100);

    await knex(WHISPER_TABLE_NAME).del();
    await knex(WHISPER_TABLE_NAME).insert(whispers);
  } catch (error) {
    logger.error(error);
  }
}
