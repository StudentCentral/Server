module.exports = {
  dbName: 'AttendancePortal',
  database: {
    // url: `mongodb://localhost:27017/muj/${this.dbName}`,
    url: 'mongodb://svr8:mujdb19@ds155396.mlab.com:55396/muj',
    mongoOptions: { useNewUrlParser: true },
  },
}