const { Pool } = require('pg');

const credentials = {
    user: 'postgres',
    host: 'db', 
    database: 'postgres',
    password: 'root',
    port: 5432, 
  };
  
  // Connect using a connection pool
  const pool = new Pool(credentials);
  
  
  module.exports = { pool }; 
  

