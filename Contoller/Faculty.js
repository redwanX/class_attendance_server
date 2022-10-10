const jwt = require("jsonwebtoken");
const db = require('../Model/db')
const bcrypt = require("bcrypt");

//register
exports.register=async(req,res)=>{
    let {name,email,password}=req.body;
    if(name&&email&&password && password.length>=8){
      db.query(`select * from faculty where email="${email}"`,async(err,result)=>{
        if(!err){
            if(result.length){
                res.send({message:"User Already Exist"})
                return;
            }
            else{
                const salt=await bcrypt.genSalt(10);
                password=await bcrypt.hash(password,salt);
                db.query(`insert into faculty(name,email,password,role) values('${name}','${email}','${password}','pending')`,async(err2,result2)=>{
                    if(!err2){
                        res.send({message:"Registration Complete"});
                    }
                    else{
                        res.send(err2);
                    }
                })
            }
        }
        else{
            res.send(err);
        }
      });
        
    }
    else{
        res.send(401).send({message:"someting Went Wrong"}); 
    }
    
 
}


//login
exports.login=async(req,res)=>{
let {email,password}=req.body;
if(email&&password ){
    db.query(`select * from faculty where email="${email}"`,async(err,result)=>{
        if(err)res.send(err);
        if(result.length===0){
            res.send({message:"user Not Found"});
        }
        else{
            let oldPass=result[0].password;
            password=String(password);
            const valid =await bcrypt.compare(password,oldPass);   
            if(valid){
            if(result[0].role==="pending"){
                res.send({message:"Waiting For Admin Varification"});
            }
            else{
                const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1d' })
                res.send({message:"Logged In succesfully",valid,token,role:result[0].role});
            
            }
            }
            else res.send({message:"Wrong Password"});
        }
    });
  } 
else{
    res.send(401).send({message:"someting Went Wrong"});
}
}

