module.exports = {
  dbName: 'AttendancePortal',
  database: {
    url: `mongodb://localhost:27017/muj/${this.dbName}`,
    mongoOptions: { useNewUrlParser: true },
  },
}