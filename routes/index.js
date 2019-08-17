var express = require('express')
var router = express.Router()
var db = require('../api/db.js');

// GET: serve page
router.get('/', function(req, res, next) {
  res.status(200).render('index.html')
});

// POST: create new booking
router.post('/new-entry', async function(req, res, next) {
  console.log('new-entry called')
  let newBooking = req.body

  db.newDocument(req.app.locals.db, 'test_collection', newBooking) 
    .catch(err => console.log(err))
    .then(doc => res.send(doc))
})

// POST: update entry
router.post('/update-entry', async function(req, res, next) {
  console.log('update-entry called')
  let updateDetails = req.body
  let identifier = updateDetails.identifier
  let newProperty = updateDetails.newProperty

  db.updateDocument(req.app.locals.db, 'test_collection', identifier, newProperty) 
    .catch(err => console.log(err))
    .then(doc => res.status(200).send(doc))
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

  db.newDocument(req.app.locals.db, 'teacherContainer', teacherContainer)
    .catch(err => { console.log(err )})
    .then(result => {
      res.status(201).send(teacherContainer.qrCode);
    });
});

// POST: validate attendance
router.post('/validate-attendance', async function(req, res, next) {
  console.log('validate-attendance called')
  let stuff = req.body;

  let qrCode = stuff.qrCode;
  let teacherContainerID = qrCode.substring(0, qrCode.lastIndexOf('_'));
  
  let container = await db.getDocument(req.app.locals.db, 'teacherContainer', { containerID: teacherContainerID});
  if(container == null) {
    res.status(200).send(false);
  } else {

    let studentID = stuff.studentID;
    let subID = container.subjectID;
    let identifier, details, list, updateQuery;
    
    // update student
    identifier = { studentID: studentID };
    details = await db.getDocument(req.app.locals.db, 'student', identifier);
    list = details.subID == undefined ? [] : details.subID;
    list.push(container.timestamp);
    updateQuery = {};
    updateQuery[subID] = list;
    db.updateDocument(req.app.locals.db, 'student', identifier, updateQuery)
      .catch(err => console.log(err))
      .then(studentUpdate => {
        
        // update teacherContainer
        list = container.attendanceList;
        list.push(studentID);
        identifier = { teacherID: container.teacherID };
        updateQuery = {};
        updateQuery.attendanceList = list;
        db.updateDocument(req.app.locals.db, 'teacherContainer', identifier, updateQuery)
          .catch(err => console.log(err))
          .then(teacherContainerUpdate => {
            res.status(200).send(true);
          });
      });
  }
});

// POST: create-student
router.post('/create-student', async function(req, res, next) {
  console.log('create-student called');
  let stuff = req.body;

  // check for preexisting teacher with teacherID
  let oldDoc = await db.getDocument(req.app.locals.db, 'student', { studentID: stuff.studentID })
    .catch(err => {
      console.log(err); 
      res.status(500).send(undefined);
    })
  
  // if doc exists, do not create document
  if(oldDoc !== null) {
    res.status(400).send('Student exists already.')
  }  // else create document
  else {
    db.newDocument(req.app.locals.db, 'student', stuff)
    .catch(err => { 
      console.log(err); 
      res.status(500).send(undefined); 
    })
    .then(newDoc => {
      res.status(201).send(newDoc.studentID);
    });
  }
  
});

// POST: create-teacher
router.post('/create-teacher', async function(req, res, next) {
  console.log('create-teacher called');
  let stuff = req.body;

  // check for preexisting teacher with teacherID
  let oldDoc = await db.getDocument(req.app.locals.db, 'teacher', { teacherID: stuff.teacherID })
    .catch(err => {
      console.log(err); 
      res.status(500).send(undefined);
    })
  
  // if doc exists, do not create document
  if(oldDoc !== null) {
    res.status(400).send('Teacher exists already.')
  }  // else create document
  else {
    db.newDocument(req.app.locals.db, 'teacher', stuff)
    .catch(err => { 
      console.log(err); 
      res.status(500).send(undefined); 
    })
    .then(newDoc => {
      res.status(201).send(newDoc.teacherID);
    });
  }
});

const generateContainerID = (teacherID, subjectID, timestamp) => {
  const dateOb = new Date(timestamp);
  const date = dateOb.getDate();
  const month = dateOb.getMonth();
  const hour = dateOb.getHours();
  return `${teacherID}_${subjectID}_${date}-${month}-${hour}`;
};

module.exports = router