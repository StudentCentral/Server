const express = require('express')
const routes = require('./routes/index.js')
const ejs = require('ejs')
const path = require('path')
const bodyParser = require('body-parser')
const main = require('./main.js');
var PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 8000
}

const mongoClient = require('mongodb').MongoClient
const databaseConfig = require('./config/database.js')

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static(path.join(__dirname, 'static')))
app.set('views', __dirname + '/views')
app.engine('html', ejs.renderFile)

app.use('/', routes)

mongoClient.connect(databaseConfig.database.url, databaseConfig.database.mongoOptions, { promiseLibrary: Promise })
  .catch(err => console.log(err.stack))
  .then(db => {
    app.locals.db = db
    app.listen(PORT, () => {
      console.log(`Website is alive at http://localhost:${PORT}`)
      main(db);
    })
  })