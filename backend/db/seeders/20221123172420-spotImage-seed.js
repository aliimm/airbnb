'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url:'https://assets.reedpopcdn.com/coconut-mall.jpg/BROK/thumbnail/1600x900/quality/100/coconut-mall.jpg',
        preview: true
      },
      {
        spotId: 2,
        url:'https://ap.rdcpix.com/3287500d3ca4d357dbad2b7b5f3efa78l-m454253802od-w480_h360_x2.jpg',
        preview: true
      },
      {
        spotId: 3,
        url:'https://images.familyhomeplans.com/cdn-cgi/image/fit=scale-down,quality=85/plans/44207/44207-b580.jpg',
        preview: true
      },
      {
        spotId: 4,
        url:'https://media.houseandgarden.co.uk/photos/635aa9008e602477bacd63a9/2:3/w_656,h_984,c_limit/Screenshot%202022-10-27%20at%2017.51.22.png',
        preview: false
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
