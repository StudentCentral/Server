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

  db.newDocument(app.locals.db, 'test_collection', newBooking)  
})

// POST: start attendance
router.post('/start-attendance', async function(req, res, next) {
  console.log('start-attendance called');
  let stuff = req.body;

  let containerID = generateContainerID(stuff.teacherID, stuff.subjectID, stuff.timestamp);

  // teacherID, subID, timestamp
  let teacherContainer = {
    containerID: containerID,
    teacherID: stuff.teacherID,
    subjectID: stuff.subjectID,
    timestamp: stuff.timestamp,
    qrCode: [
      `${containerID}_1`,
      `${containerID}_2`,
      `${containerID}_3`,
    ],
    attendanceList: []
  };

  db.newDocument(app.locals.db, 'teacherContainer', teacherContainer)
    .catch(err => { console.log(err )})
    .then(result => {
      res.status(200).send(teacherContainer.qrCode);
    });
});

// POST: validate attendance
router.post('/validate_attendance', async function(req, res, next) {
  console.log('validate-attendance called')
  let stuff = req.body;

  let qrCode = stuff.qrCode;
  let teacherContainerID = qrCode.substring(0, qrCode.lastIndexOf('_'));
  
  let container = await db.getDocument(app.locals.db, 'teacherContainer', { containerID: teacherContainerID});
  if(container == null) {
    res.status(200).send(false);
  } else {

    let studentID = stuff.studentID;
    let subID = container.subjectID;
    // update student
    // update teacher
    // update teacherContainer
    container.attendanceList.push(studentID);

    res.status(200).send(true);
  }

})

const generateContainerID = (teacherID, subjectID, timestamp) => {
  const dateOb = new Date(timestamp);
  const date = dateOb.getDate();
  const month = dateOb.getMonth();
  const hour = dateOb.getHours();
  return `${teacherID}_${subjectID}_${date}-${month}-${hour}`;
};

module.exports = router