'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '26708 Peterman Ave',
        city: 'Hayward',
        state: 'CA',
        country: 'USA',
        lat: -3489573894.75,
        lng: 82930489083.94,
        name: 'house in the trenches',
        description: 'Mountain Views. Luxury. Catch up to the quiet you promised yourself. We deliberately curated furniture, stone, wood, and artifacts to bring an experience of beauty that is both modern and warm with heritage.',
        price: 199
      },

      {
        ownerId: 2,
        address: '555 Autumn Wiggins Lane',
        city: 'Oakland',
        state: 'CA',
        country: 'USA',
        lat: -6429093494.90,
        lng: 78985659083.12,
        name: 'one story house',
        description: 'very nice house stay here',
        price: 450
      },

      {
        ownerId: 3,
        address: '777 Grove Street',
        city: 'San Leandro',
        state: 'CA',
        country: 'USA',
        lat: -3489573894.75,
        lng: 82930489083.94,
        name: 'cottage',
        description: 'a nice place to stay',
        price: 130
      },
      {
        ownerId: 4,
        address: '888 Cherry Street',
        city: 'San Jose',
        state: 'CA',
        country: 'USA',
        lat: -3489573894.75,
        lng: 82930489083.94,
        name: 'room',
        description: 'stay in my extra room',
        price: 100
      },


    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['888 Cherry Street', '777 Grove Street', '555 Autumn Wiggins Lane', '26708 Peterman Ave'] }
    }, {});
  }
};
