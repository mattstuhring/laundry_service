module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/laundry_service_dev'
  },

  production: {
    client: 'pg',
    ssl: true,
    connection: process.env.DATABASE_URL
  }
};
