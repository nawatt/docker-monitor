const lowdb = require('lowdb')
const fileAsync = require('lowdb/lib/file-async')

// Start database using file-async storage
const db = lowdb(`data/${global.node_env}.json`, {
  storage: fileAsync,
  writeOnChange: true
})

// Init
db.defaults({ listeners: [] })
  .value()

module.exports = db;
