const db = require('../.config');

exports.requests = (req, res) => {
    const sql = "SELECT * FROM requests";
    db.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({msg: "Internal Server Error"});
        }
        res.status(200).send(result);
    });
}

exports.createRequests = (req , res) => {
    const sql = "insert into requests set ?";
    db.query(sql , req.body , (err , result) =>{
        if(err){
            return res.status(500).send({msg:"Internal Server Error"});
        }
        res.status(200).send({msg:"Request created successfully"});
    })
}