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
        lastName: "user",
        email: 'demo@user.io',
        username: 'Demo-lition',
        profileimg: 'https://urbanislandz.com/wp-content/uploads/2018/10/Drake-The-Shop.jpg',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'bryson',
        lastName: 'tiller',
        email: 'brysontiller@aa.io',
        username: 'bryson1',
        profileimg: 'https://www.okayplayer.com/wp-content/uploads/2020/09/bryson-tiller-unleashes-somber-visual-for-right-my-wrongs.jpg',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'mauro',
        lastName: 'alv',
        email: 'mauro@aa.io',
        username: 'mauro',
        profileimg: 'https://www.billboard.com/wp-content/uploads/media/Sheck-Wes-press-photo-2018-cr_Cian-Moore-billboard-1548.jpg',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'flemster',
        lastName: 'wemmly',
        email: 'flemster@aa.io',
        username: 'FakeUser3',
        profileimg: 'https://imageio.forbes.com/specials-images/imageserve/6195833648d5d89e35cbeb8f/2021-MTV-Video-Music-Awards---Arrivals/960x0.jpg?format=jpg&width=960',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'yeat',
        lastName: 'tonka',
        email: 'yeat@aa.io',
        username: 'yeat',
        profileimg: 'https://images.complex.com/complex/images/c_fill,dpr_auto,f_auto,q_auto,w_1400/fl_lossy,pg_1/eys5ntxw6zjcxijbdznf/yeat-what-you-need-to-know?fimg-ssr-default',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'selena',
        lastName: 'gomez',
        email: 'selena@aa.io',
        username: 'selena',
        profileimg: 'https://people.com/thmb/ZfqwkIR6h6IymZydnKO7Rk_1lNk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x105:1001x107)/Selena-Gomez-011023-72c20b1178394def9675fbaa7cdbffce.jpg',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'kalan',
        lastName: 'frfr',
        email: 'kalana@aa.io',
        username: 'kalanfrfr',
        profileimg: 'https://i0.wp.com/theperfectplay.co/wp-content/uploads/2021/08/IMG_6040.jpg?fit=1079%2C1079&ssl=1',
        hashedPassword: bcrypt.hashSync('password')
      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'CiaraFumar1', 'mauro', 'FakeUser3', 'yeat@aa.io', 'selena@aa.io', 'kalanfrfr'] }
    }, {});
  }
};
