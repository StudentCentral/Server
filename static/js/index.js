var qrcode = new QRCode("qrcode");

// PROTOTYPE
const test = function() {
  console.log('test')
  axios.get('/get-student', {
    params: {
      studentID: 'j_179301184',
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}

const getTeacher = function() {
  let teacherID = $("#input-teacherID").val()

  axios.get('/get-teacher', {
    params: {
      teacherID: teacherID,
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}

const getStudent = function() {
  let studentID = $("#input-teacherID").val()

  axios.get('/get-student', {
    params: {
      studentID: studentID,
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}

// PROTOTYPE
const newEntry = function() {
  let ob = {
    name: 'svr8',
    lang: 'nodejs'
  }

  axios.post('/new-entry', ob)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

// PROTOTYPE
const updateEntry = function() {
  let identifier = {
    name: 'svr8'
  }
  let newProperty = {
    xyz: 'java'
  }
  let ob = {
    identifier: identifier,
    newProperty: newProperty
  }

  axios.post('/update-entry', ob)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

// PROTOTYPE
const triggerAttendance = function() {
  doStuff('trigger-student');
}

const newTeacher = () => {
  let teacherID = $("#input-teacherID").val()

  let teacher = {
    teacherID: teacherID,
    name: 'testX'
  }

  doStuff('create-teacher', teacher)  
}
const newStudent = () => {
  let studentID = $("#input-teacherID").val()
  let student = {
    studentID: studentID,
    name: 'testX'
  }

  doStuff('create-student', student)  
}

const startAttendance = () => {
  let teacherID = $("#input-teacherID").val()
  let subjectID = $("#input-subjectID").val()
  let d = $("#input-date").val()
  let month = $("#input-month").val()
  let year = $("#input-year").val()
  let hour = $("#input-hour").val()

  let date = new Date();
  date.setSeconds(0)
  date.setMinutes(0)
  date.setHours(hour)
  date.setMonth(month-1)
  date.setFullYear(year)
  date.setDate(d)

  let ob = {
    teacherID: teacherID,
    subjectID: subjectID,
    timestamp: date.toString()
  }

  axios.post(`/start-attendance`, ob)
  .then(function (response) {
    let qrCodeList = response.data
    console.log(qrCodeList)
    processQRCodes(qrCodeList)
  })
  .catch(function (error) {
    console.log(error);
  });
}

const validateAttendance = () => {
  let ob = {
    qrCode: '12345_cs123_5-7-7_1',
    studentID: 't_179301184'
  }

  doStuff('validate-attendance', ob);
}

const doStuff = (url, data) => {
  console.log('####')
  console.log(url)
  console.log(data)
  axios.post(`/${url}`, data)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}


const processQRCodes = list => {

  let code = list[0]
  qrcode.makeCode(code);

  setTimeout(() => {
    qrcode.makeCode(list[0])
  }, 0)

  setTimeout(() => {
    qrcode.makeCode(list[1])
  }, 5000)

  setTimeout( ()=> {
    qrcode.makeCode(list[2])
  }, 10000)

  setTimeout(()=> {
    $("#qrcode").hide()
  }, 15000)

}