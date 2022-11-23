'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 2,
        userId: 1,
        startDate: '12-25-2022',
        endDate: '12-27-2022'
      },
      {
        spotId: 1,
        userId: 2,
        startDate: '12-20-2022',
        endDate: '12-24-2022'
      },
      {
        spotId: 4,
        userId: 3,
        startDate: '12-20-2022',
        endDate: '12-24-2022'
      },
      {
        spotId: 3,
        userId: 4,
        startDate: '12-15-2022',
        endDate: '12-19-2022'
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
