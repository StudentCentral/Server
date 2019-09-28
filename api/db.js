const config = require('../config/database.js');

module.exports = {
  newDocument: async function(db, collectionName, doc) {
    return new Promise(resolve => {
      try {
        const collection = db.db(config.dbName).collection(collectionName)
        collection.insertOne(doc, (err, docInserted) => {
          if(err) 
            throw err
          resolve(docInserted.insertedId)
        })
      } catch(err) {
        if(err)
          throw err
      }
    })
  },
  
  deleteCollection: async function(db, collectionName) {
    return new Promise(resolve => {
      try {
        const collection = db.db(config.dbName).collection(collectionName);
        collection.drop((err, delOK) => {
          if(err)
            throw err
          if(delOK)
            console.log(`${collectionName} deleted`);
          resolve(true)
        })
      } catch(err) {
        if(err)
          throw err
      }
    })
  },

  getDocument: async function(db, collectionName, uniqueProperty) {
    return new Promise(resolve => {
      try {
        const collection = db.db(config.dbName).collection(collectionName)
        collection.findOne(uniqueProperty, (err, doc) => {
          if(err)
            throw err
          resolve(doc)
        })
      } catch(err) {
        if(err)
          throw err
      }
    })
  },

  getPartialDocumentList: async function(db, collectionName, uniqueProperty, requiredFields) {
    return new Promise(resolve => {
      try {
        const collection = db.db(config.dbName).collection(collectionName)
        let projectionQuery = {}
        for(let field in requiredFields)
          projectionQuery[field] = 1;

        collection.find( uniqueProperty, { projection: projectionQuery }
          ).toArray(function(err, result) {
          if (err) throw err;
          resolve(result);
      });

        // const collection = db.db(config.dbName).collection(collectionName)
        // collection.findOne(uniqueProperty, requiredFields, (err, doc) => {
        //   if(err)
        //     throw err
        //   resolve(doc)
        // })
      } catch(err) {
        if(err)
          throw err
      }
    })
  },

  updateDocument: async function(db, collectionName, uniqueProperty, newProperty) {
    return new Promise(resolve => {
      try {
        const collection = db.db(config.dbName).collection(collectionName)
        const updateQuery = { $set: newProperty }

        collection.updateOne(uniqueProperty, updateQuery, (err, res) => {
          if(err)
            throw err
          resolve(res)
        })
      } catch(err) {
        if(err)
          throw err
      }
    })
  },
  
  getDocumentList: async function(db, collectionName, properties) {
    return new Promise(resolve => {
      try {
        const collection = db.db(config.dbName).collection(collectionName)
        collection.find(properties).toArray((err, list) => {
          if(err)
            throw err
          resolve(list)
        })
      } catch(err) {
        if(err)
          throw err
      }
    })
  },

  documentCount: async function(db, collectionName, properties) {
    return new Promise(resolve => {
      try {
        const collection = db.db(config.dbName).collection(collectionName)
        collection.count(properties, (err, count) => {
          if(err)
            throw err
          resolve(count)
        })
      } catch(err) {
        if(err)
          throw err
      }
    })
  }
}