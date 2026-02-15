const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();


const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

con.connect((err) => {
    if(err){
        console.log("not configured correctly");
    }
    console.log("Connected to database");
});

module.exports = con;