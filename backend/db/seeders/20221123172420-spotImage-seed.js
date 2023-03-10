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
        url:'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwaG91c2V8ZW58MHx8MHx8&w=1000&q=80',
        preview: true
      },
      {
        spotId: 2,
        url:'https://ap.rdcpix.com/3287500d3ca4d357dbad2b7b5f3efa78l-m454253802od-w480_h360_x2.jpg',
        preview: true
      },
      {
        spotId: 3,
        url:'https://wallpaperaccess.com/full/3571952.jpg',
        preview: true
      },
      {
        spotId: 4,
        url:'https://cdn.homedit.com/wp-content/uploads/2016/06/Cool-blue-villa-from-123-dva-transparent-swimming-pool.jpg',
        preview: true
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
