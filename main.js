var db = require('./api/db.js');

const main = (dbRef) => {
  console.log('init');
  var needUpdate = true;

  setInterval(function() {

    let date = new Date();
    if(needUpdate) {
      if(date.getHours()==23) {
        transferTeacherContainers(dbRef)
          .catch(err => console.log(err))
          .then(result => {
            needUpdate = false;
          })
      }
    } else if(date.getHours()<23) {
      needUpdate = true;
    }
  }, 10000);
}

const transferTeacherContainers = async (dbRef) => {

  try {
    let teacherContainerList = await db.getDocumentList(dbRef, 'teacherContainer', {});
    let status = true;
    if(teacherContainerList==null || teacherContainerList==undefined)
      return Promise.resolve(true);

    for(let i=0;i<teacherContainerList && status;i++) {
      let teacherContainer = teacherContainerList[i];
      let updates = {};
      updates.timestamp = teacherContainer.timestamp;
      updates.attendanceList = teacherContainer.attendanceList;

      let teacherDetails = await db.getDocument(dbRef, 'teacher', 
        { teacherID: teacherContainer.teacherID}
      );
      if(teacherDetails[subjectID] == undefined)
        teacherDetails[subjectID] = [];
      teacherDetails[subjectID].push(updates);
      let updateQuery = {};
      updateQuery[subjectID] = teacherDetails[subjectID];

      db.updateDocument(dbRef, 'teacher', 
        {teacherID: teacherDetails.teacherID},
        updateQuery
      ).catch(err => { status=false; console.log(err); })
      .then(updatedTeacher => {
        console.log(`${updatedTeacher.teacherID} updated`);
      })
    }

    if(await status) {
      db.deleteCollection(dbRef, 'teacherCollection');
      return Promise.resolve(status);
    } else {
      return Promise.resolve(status);
    }

  } catch(err) {
    if(err)
      throw err;
  }
}

module.exports = main;