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