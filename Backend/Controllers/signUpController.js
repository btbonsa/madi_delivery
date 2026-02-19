const db = require("../.config");

exports.signup = (req, res) => {
  const { FullName, Email, Password, ConfirmPassword, Department, Batch } =
    req.body;

  if (
    !FullName ||
    !Email ||
    !Password ||
    !ConfirmPassword ||
    !Department ||
    !Batch
  ) {
    return res.status(400).send({ msg: "Please fill all fields" });
  }

  if (Password !== ConfirmPassword) {
    return res.status(400).send({ msg: "Passwords do not match" });
  }

  const CheckQuery = "select * from users where Email = ?";
  db.query(CheckQuery, [Email], (err, results) => {
    if(err){
        return res.status(500).send({ msg: "database connection error" });
    }
    if (results.length > 0) {
      return res.status(400).send({ msg: "Account already exists" });
    }
      const sql = "INSERt INTO users set ?";
  const values = {
    FullName: FullName,
    Email: Email,
    Password: Password,
    ConfirmPassword: ConfirmPassword,
    Department: Department,
    Batch: Batch,
  };
  db.query(sql, values, (err, results) => {
    if(err) {
        return res.status(500).send({ msg: "Internal server error" });
    }
    if(results){
        return res.status(201).json({ msg: "created successfully" });
    }
  });
  });

};
