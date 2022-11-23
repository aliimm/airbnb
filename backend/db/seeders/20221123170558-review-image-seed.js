'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8aG91c2V8ZW58MHx8MHx8&w=1000&q=80'
      },
      {
        reviewId: 2,
        url: 'https://i.ytimg.com/vi/qkKZkhgHjgw/maxresdefault.jpg'
      },
      {
        reviewId: 3,
        url: 'https://i.ytimg.com/vi/3gyjobblV-s/maxresdefault.jpg'
      },
      {
        reviewId: 4,
        url: 'https://i.ytimg.com/vi/bumsIF8hbi0/maxresdefault.jpg'
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
