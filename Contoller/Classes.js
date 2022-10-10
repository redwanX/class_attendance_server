const db = require('../Model/db')
exports.addClass=async(req,res)=>{
    let {email,year,dept,session,code,semester,start,end}=req.body;
    if(email&&year&&dept&&session&&code&&semester&&start&&end ){
        db.query(`insert into classes (email,year,dept,session,code,semester,start,end,total) values ("${email}","${year}","${dept}","${session}","${code}","${semester}","${start}","${end}","${0}")`,async(err,result)=>{
         
            if(!err){
            
            let starting =Math.min(Number(start),Number(end));
            let ending=Math.max(Number(start),Number(end));
            let sql=`Insert into student(roll,classId,attend) values `;
            for(let i=starting;i<=ending;i++){
                sql=sql+ `("${i}","${result.insertId}","${0}")`;
                if(i!=ending)sql+=','
            }
            sql+=';';
            db.query(sql,(err2,result2)=>{
              
                if(!err2)res.send({message:"Class Added"});
                else{
                    res.send(err2);
                }
            });
            
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


exports.classes=async(req,res)=>{
    let {email}=req.query;
    if(email){
        db.query(`SELECT * FROM classes  where email="${email}"`,async(err,result)=>{
            if(!err){
            res.send(JSON.stringify(result));
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


exports.classesId=async(req,res)=>{
    let {id}=req.params;
    if(id){
        db.query(`SELECT * FROM classes  where id="${id}"`,async(err,result)=>{
            if(!err){
            const classes=result[0];
            db.query(`select * from student where classId="${id}"`,async(err2,result2)=>{
                if(!err2){
                    const students=result2;
                    res.send({classes,students});
                }
                else{
                    res.send(err2);
                }
            })
            
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


exports.saveId=async(req,res)=>{
    const list = req.body.list;
    const {id} = req.params;
    db.query(`update classes set total = total+1 where id=${id}`);
    if(list.length==0){
        res.send({message:"SAVED! NO ONE IS ATTENDED TODAY"});
        return
    }
    let sql = `update student SET attend = attend+1 where classId="${id}" and roll in (`;
    for(let i=0;i<list.length;i++){
        sql+=`"${list[i]}"`
        if(i!=list.length-1)sql+=',';
    }
    sql.slice(0,-1);
    sql+=');';
    db.query(sql,(err,result)=>{
        if(err)res.send(err);
        else{
           res.send({message:"SAVED"});
        }
    })
}
