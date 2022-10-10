const mysql = require('mysql');
const database='class_attendance';
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
  });

 db.connect(function(err) {
    if (err) throw err;
    let sql=`create database ${database}`;
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err.sqlMessage)
        }
            else console.log("Database Added");
    })

    db.changeUser({
        database : database
    }, (err) => {
        if (err) {
          console.log('Error in changing database', err);
          return;
        }
    })

    sql = `CREATE TABLE faculty(
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(250) NOT NULL,
    role VARCHAR(50) NOT NULL,
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`;

    db.query(sql,(err,result)=>{
        if(err){
            console.log(err.sqlMessage);
        }
            else console.log("Faculty Tabble Added");
    })


    sql = `CREATE TABLE classes(
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(50) NOT NULL,
        year INT NOT NULL,
        dept VARCHAR(30) NOT NULL,
        session VARCHAR(30) NOT NULL,
        code VARCHAR(50) NOT NULL,
        semester VARCHAR(50) NOT NULL,
        start INT NOT NULL,
        end INT NOT NULL,
        total INT NOT NULL,
        reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`;
    
        db.query(sql,(err,result)=>{
            if(err){
                console.log(err.sqlMessage);
            }
                else console.log("Class Table Added");
        })

        sql = `CREATE TABLE student(
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            roll INT NOT NULL,
            classId INT(6) UNSIGNED NOT NULL,
            attend INT NOT NULL,
            FOREIGN KEY(classId) REFERENCES classes(id) ON DELETE CASCADE
            )`;
        
            db.query(sql,(err,result)=>{
                if(err){
                    console.log(err.sqlMessage);
                }
                    else console.log("Student Table Added");
            })
    
});




module.exports=db;