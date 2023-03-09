'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'demoo',
        lastName: "wemmmooo",
        email: 'demo@user.io',
        username: 'Demo-lition',
        profileimg: 'https://urbanislandz.com/wp-content/uploads/2018/10/Drake-The-Shop.jpg',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'fakieee',
        lastName: 'wakkiie',
        email: 'user1@user.io',
        username: 'FakeUser1',
        profileimg: 'https://www.okayplayer.com/wp-content/uploads/2020/09/bryson-tiller-unleashes-somber-visual-for-right-my-wrongs.jpg',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'wammmmm',
        lastName: 'bammmm',
        email: 'user2@user.io',
        username: 'FakeUser2',
        profileimg: 'https://www.billboard.com/wp-content/uploads/media/Sheck-Wes-press-photo-2018-cr_Cian-Moore-billboard-1548.jpg',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'flemy',
        lastName: 'wemmly',
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password4')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser3'] }
    }, {});
  }
};
