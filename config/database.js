module.exports = {
  dbName: 'XRides',
  database: {
    url: `mongodb://localhost:27017/Dhiyo/${this.dbName}`,
    mongoOptions: { useNewUrlParser: true },
  },
}