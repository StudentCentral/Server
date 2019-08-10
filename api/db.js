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