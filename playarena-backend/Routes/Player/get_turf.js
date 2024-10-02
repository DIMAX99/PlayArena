require('../../Schema/owners/turf');
require('../../Schema/owners/turftiming');
require('../../Schema/bookslots');
require('../../Schema/user');
require('../../Schema/review');

const express=require("express");
const router=express.Router();
const mongoose=require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt=require("bcryptjs");
router.use(express.json());
const JWT_TOKEN="afa6fijnfnmid4s6bef8nm7yt4svabte65da6dfwytfweq6eqg8q()aihfvbaygfad{}q7etur87qugvdqy";

const turf=mongoose.model('Turf');
const turftiming=mongoose.model('Turftiming');
const bookings=mongoose.model('Bookings');
const review=mongoose.model('Review');
const user = mongoose.model("Players");

router.get('/get_turfs_list',async(req,res)=>{
    try{
        const turfs=await turf.find();
        return res.send({status:1,turfs_list:turfs});
    }catch(error){
        console.log(error);
        return res.send({status:0})
    }
});
router.post('/get_turf_details',async(req,res)=>{
    const {turfid}=req.body;
    try{
        const exist_turf=await turf.findById(turfid);
        if(exist_turf){
          return res.send({status:1,data:exist_turf});
        }else{
          return res.send({status:0});
        }
    }catch(error){
      console.log(error);
      return res.send({status:0});
    }
});
router.post('/add_turf_review',async(req,res)=>{
    const {turfid,token,rating,comment,type}=req.body;
    try{
        const exist_turf=await turf.findById(turfid);
        const decoded=jwt.verify(token,JWT_TOKEN);
        const user_exist=await user.findOne({email:decoded.email});
        if(exist_turf && user_exist){
            if(type==='update'){
                await review.updateOne({turfid:turfid,userid:user_exist._id},{
                    $set:{
                        comment:comment,rating:rating,created_at:Date.now(),
                    }
                });
                return res.send({status:1});
            }
          await review.create({
            turfid:turfid,userid:user_exist._id,rating:rating,comment:comment
          });
          return res.send({status:1})
        }else{ 
          return res.send({status:0});
        }
    }catch(error){
      console.log(error);
      return res.send({status:0});
    }
});
router.post('/get_turf_review',async(req,res)=>{
    const {turfid}=req.body;
    try{
        const exist_turf=await turf.findById(turfid); 
        if(exist_turf){
            const reviewlist=await review.find({turfid:turfid});
            if(reviewlist){
                return res.send({status:1,reviewlist:reviewlist});
            }
            else{
                return res.send({status:1,reviewlist:[]});
            }
        }else{
          return res.send({status:0});
        }
    }catch(error){
      console.log(error);
      return res.send({status:0});
    }
});
module.exports=router;