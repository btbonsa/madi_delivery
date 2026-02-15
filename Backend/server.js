const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const mysql = require('mysql2');

const PORT = 7000;
app.use(cors())
app.use(express.json())

app.get("/", (req, res)=>{
    res.status(201).send({msg: "server is started"});
})

app.use('/api/auth', require('./Routes/signup'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});






 
