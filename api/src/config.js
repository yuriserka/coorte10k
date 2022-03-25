require("dotenv-safe").config();

module.exports = {
  PORT: process.env.PORT || 3333,
  DATABASE_URL: process.env.DATABASE_URL,
};
