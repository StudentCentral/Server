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
  console.log('transferTeacherContainers called')
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
    
      // get all teacher details
      let teacherDetails = await db.getDocument(dbRef, 'teacher', 
        { teacherID: teacherContainer.teacherID}
      );

      // if this is first class, create empty array
      if(teacherDetails[subjectID] == undefined)
        teacherDetails[subjectID] = [];
      
      // if class already exists, update attendancelist
      let curTime = new Date(updates.timestamp);
      let classList = teacherDetails[subjectID];
      for(let i = 0; i<classList.length; i++) {
        let classDetail = classList[i];
        let d1 = new Date(classDetail.timestamp);
        if(d1.getTime() == curTime.getTime()) {
          flag = true;
          updates.attendanceList = updates.attendanceList.concat(classDetail.attendanceList);
        }
      }

      // if class didnt't exist already, create new class
      if(!flag) {
        classList.push(updates);
      }

      // generate mongodb update query
      let updateQuery = {};
      updateQuery[subjectID] = classList;
      
      // update teacher classList
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