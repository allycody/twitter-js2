var pg = require('pg');
// var config = {
//   //user: '', //env var: PGUSER
//   database: 'twitterdb', //env var: PGDATABASE
//   //password: '', //env var: PGPASSWORD
//   host: 'localhost', // Server hosting the postgres database
//   port: 1337, //env var: PGPORT
//   max: 10, // max number of clients in the pool
//   idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
// };
var url = "postgres://localhost/twitterdb";
var client = new pg.Client(url);

client.connect(function (err) {
    if (err) throw err;
});


module.exports = client;
