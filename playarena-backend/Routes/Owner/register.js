require('../../Schema/owners/owner');
const express=require("express");
const router=express.Router();
const mongoose=require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt=require("bcryptjs");
const JWT_TOKEN="afa6fijnfnmid4s6bef8nm7yt4svabte65da6dfwytfweq6eqg8q()aihfvbaygfad{}q7etur87qugvdqy";

const owner=mongoose.model('Owners');

router.post('/register',async (req,res)=>{
    const {Companyname,email,phonenumber,password}=req.body;
    const encryptedPassword=await bcrypt.hash(password,10);
    try{
        await owner.create({
            Companyname:Companyname,
            email:email,
            phonenumber:phonenumber,
            password:encryptedPassword,
        });
        res.send({status:1});
    }catch(error){
        res.send({status:error});
    } 
});


router.post('/login', async(req,res)=>{
    const {email,password}=req.body;
    try{
        // console.log("in 1");
        const olduser=await owner.findOne({email:email});
        // console.log(olduser);
        if(!olduser){
            // console.log(olduser);
            res.send({status:0,message:"Account Not Found"});
        }
        if(await bcrypt.compare(password,olduser.password)){
            const token=jwt.sign({email:olduser.email},JWT_TOKEN); 
            if(res.status(201)){
                return res.send({status:1,message:"login successfull",data:token});
            }else{
                return res.send({status:0,message:"Invalid Credentials"});
            }
        }
    }catch(error){
        console.log(error);
    }
});

module.exports=router;