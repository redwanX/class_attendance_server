const db = require('../Model/db')

exports.faculty=async(req,res)=>{
    db.query(`select * from faculty`,async(err,result)=>{
        if(err){
               res.send({message:"Something Went Wrong"})
           } 
            else{
               res.send(result);
            }
      });
        
}


exports.approveFaculty=async(req,res)=>{
    const {email}=req.query;
    console.log(email)
    db.query(`update faculty set role="faculty" where email="${email}"`,async(err,result)=>{
        if(err){
               res.send({message:"Something Went Wrong"})
           } 
            else{
               res.send({message:"Approved"});
            }
      });
}


exports.deleteFaculty=async(req,res)=>{
    const {email}=req.query;
    console.log(email)
    db.query(`delete from faculty where email="${email}"`,async(err,result)=>{
        if(err){
               res.send({message:"Something Went Wrong"})
           } 
            else{
               res.send({message:"Cancled"});
            }
      });
}
