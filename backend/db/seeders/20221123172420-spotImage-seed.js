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
      },
      {
        spotId: 5,
        url:'https://a0.muscache.com/im/pictures/f2f046e7-1aa3-4f04-99b0-8bc2de2c7252.jpg?im_w=1200',
        preview: true
      },
      {
        spotId: 6,
        url:'http://cdn.home-designing.com/wp-content/uploads/2010/08/1-modern-beach-house-with-white-exterior-paint.jpg',
        preview: true
      },
      {
        spotId: 7,
        url:'https://athomeinhollywood.com/wp-content/uploads/2019/01/Mark-Cuban-Laguna-California-room.jpg',
        preview: true
      },
      {
        spotId: 8,
        url:'https://static.mansionglobal.com/production/media/listing_images/84def9e60c6fca18465f9fcdd7f521e6/xlarge_Front_Buckthorn.jpg',
        preview: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
