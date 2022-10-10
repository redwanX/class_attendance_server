const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require('./Model/db')
const app = express();

require("dotenv").config();
//middleware
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(express.json());



const faculty=require('./Contoller/Faculty');
const classes=require('./Contoller/Classes');
const admin=require('./Contoller/Admin');
app.post('/register',faculty.register);
app.post('/login',faculty.login);


app.get('/faculty',admin.faculty);
app.get('/approveFaculty',admin.approveFaculty);
app.get('/deleteFaculty',admin.deleteFaculty);

app.post('/addClass',classes.addClass)
app.get('/classes',classes.classes)
app.get('/classes/:id',classes.classesId)
app.post('/save/:id',classes.saveId)


//JWT VERIFICATION MIDDLEWARE
function JWTverify(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden" });
    }
    req.decoded = decoded;
    next();
  });
}

//Check Token Valid
app.post("/tokenValidate", JWTverify, async (req, res) => {
  const data = req.body;
  if (data.user === req.decoded.email) {
    res.send(true);
  } else res.send(false);
});

//Check if admin
app.post("/admin", JWTverify, async (req, res) => {
  const data = req.body;
  if (data.user === req.decoded.email) {
    db.query(
      `select * from faculty where email="${data.user}"`,
      async (err, result) => {
        if (err) {
          res.send({ valid: false });
        } else {
          if (result[0].role === "admin") res.send({ valid: true });
          else res.send({ valid: false });
        }
      }
    );
  } else res.send({ valid: false });
});

app.listen("5000", () => {
  console.log("server is running ");
});
