const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');

// const app = express();

//Create Connection
const db = mysql.createConnection({
  host: "146.148.71.201",
  user: "root",
  password: "serverless2",
  port: "3306",
  database: "user",
});

//Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
});
console.log('MySQL Connected!');

router.get('/',(req, res) => {
    res.send("Hello");
});


//create user
router.post('/', async (req, res) => {
    // res.send(req.body);
    // const newMember = {
    //     email: req.body.email,
    //     name: req.body.name,
    //     password: req.body.password,
    //     topic: req.body.topic
    // }
    if (
      !req.body.email ||
      !req.body.name ||
      !req.body.password ||
      !req.body.topic
    ) {
      return res
        .status(400)
        .json({ msg: `Please include all- email, name, password & topic` });
    }

    try {
        // const salt = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password, 10);
        console.log(`HashedPAss: ${req.body.password}`);
        
    } catch (error) {
        res.status(500).send();
    }
    
    console.log('In post with id:'+req.body.email);
    let where = ' email = ?';
    let values = [req.body.email];
    let sqlSelect = 'SELECT * FROM userdata WHERE'+where;
    console.log(`sqlSelect: ${sqlSelect}`);
    
    let sql = 'INSERT INTO userdata SET ?';
    let userdata = {name:req.body.name,email:req.body.email,password:req.body.password,topic:req.body.topic};

    console.log(userdata);
    let querySelect = db.query(sqlSelect, values, (err, result) => {
        console.log(`SQL: ${this.sql}`);
        
        if (err) {
            throw err;
        }
        console.log(result);
        if (result == "") {
            console.log("user not registered! Now registering User!");
            let query = db.query(sql, userdata, (err,user) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({msg: `User with email:${userdata.email} is successfully registered!`});
                //res.send(`User with email:${userdata.email} is successfully registered!`);
            });
        } else {
            res.status(404).json({ msg: `User with email: ${userdata.email} already exists!` });
        }
    }); 
});

module.exports = router; 