const db = require("../.config");

exports.login = (req ,res) => {
const { Email, Password } = req.body;

const Sql = "select * from users where Email = ? and Password = ?";

db.query(Sql, [Email, Password], (err, results) => {
    
    if(err){
        return res.status(500).send({ msg: "database connection error" });
    }
    if (results.length > 0) {
        return res.status(200).send({ msg: "Login successful" });
    }
    return res.status(400).send({ msg: "Invalid credentials" });
});

}
