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
        description: 'The house was completely rebuild and decorated by a famous San Francisco architect. A few walking blocks to great restaurants, winery and distillery. World famous hikes are steps away. ',
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
        description: 'Positioned on the oceanfront, this 3,000+ sq. ft home has one of the most spectacular views along the coastline and is situated on one of the most private stretches of beach in Monterey Bay.',
        price: 130
      },
      {
        ownerId: 4,
        address: '555 Cherry Street',
        city: 'San Jose',
        state: 'CA',
        country: 'USA',
        lat: -3489573894.75,
        lng: 82930489083.94,
        name: 'room',
        description: 'Resting on the very edge of the Pacific, this exquisite villa has been designed and constructed from the ground up to unite you with the beauty and peace of the surrounding waters.',
        price: 460
      },
      {
        ownerId: 5,
        address: '222 Meekland Street',
        city: 'Pacifica',
        state: 'CA',
        country: 'USA',
        lat: -3489573894.75,
        lng: 82930489083.94,
        name: 'Oceanfront w/unobstructed views!',
        description: "Our Oceanfront home offers breathtaking views of one of California's most beautiful coastlines. Many travel far for dolphins and whale watching.",
        price: 540
      },
      {
        ownerId: 6,
        address: '434 yolander Street',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: -3489573894.75,
        lng: 82930489083.94,
        name: 'Seamist Beach Cottage, Private Beach & Ocean views',
        description: "Seamist Beach Cottage 2 Bedroom 1 Bathroom with Private Stairs & Secluded Beach. Ideal for a family with 2 Adults/2 Kids Loft w/twins.",
        price: 824
      },
      {
        ownerId: 7,
        address: '772 table Street',
        city: 'Santa Monica',
        state: 'CA',
        country: 'USA',
        lat: -3489573894.75,
        lng: 82930489083.94,
        name: 'The Pacific Dream',
        description: "Resting on the very edge of the Pacific, this exquisite villa has been designed and constructed from the ground up.",
        price: 908
      },
      {
        ownerId: 2,
        address: '6852 water Street',
        city: 'Long Beach',
        state: 'CA',
        country: 'USA',
        lat: -3489573894.75,
        lng: 82930489083.94,
        name: 'Spectacular Private Oceanfront Retreat',
        description: "Spectacular original mid century oceanfront home with panoramic views of the surfers and crashing waves from San Francisco, to Stinson, to Duxbury reef. Designed by famous Bay Area Architect Edward B Page.",
        price: 908
      },


    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['888 Cherry Street', '777 Grove Street', '555 Autumn Wiggins Lane', '26708 Peterman Ave', '555 Cherry Street', '222 Meekland Street', '434 yolander Street', '772 table Street', '6852 water Street'] }
    }, {});
  }
};
