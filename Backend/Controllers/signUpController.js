


const db = require('../.config');


exports.signup = (req, res) => {

    

const {FullName, Email, Password} = req.body;

const sql = 'INSERt INTO users set ?';
const values = {FullName:FullName , Email:Email, Password:Password}

db.query( sql , values, (err , results) =>{
    if(err){
        return res.status(500).send({msg: "Error creating user"});
    }
    res.status(201).send({msg: "User created successfully"});
})

};


