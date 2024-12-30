let { Datatypes, sequelize } = require("../lib");

let user = sequelize.define("user", {
  username: {
    type: Datatypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: Datatypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Datatypes.STRING,
    allowNull: false,
  },
});

module.exports = { user };
