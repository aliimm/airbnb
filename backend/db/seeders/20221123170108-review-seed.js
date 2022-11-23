'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 2,
        userId: 1,
        review: 'loved it',
        stars: 4
      },
      {
        spotId: 1,
        userId: 2,
        review: 'super clean',
        stars: 4
      },
      {
        spotId: 4,
        userId: 3,
        review: '10/10 would stay here again',
        stars: 5
      },
      {
        spotId: 3,
        userId: 4,
        review: 'this place is a steal',
        stars: 2
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
