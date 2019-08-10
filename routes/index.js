var express = require('express')
var router = express.Router()
var db = require('../api/db.js');

// GET: serve page
router.get('/', function(req, res, next) {
  res.status(200).render('index.html')
});

// POST: create new booking
router.post('/new_booking', async function(req, res, next) {
  console.log('newBooking called')
  let newBooking = req.body

  util.newDocument(app.locals.db, 'test_collection', newBooking);
  
})


module.exports = router