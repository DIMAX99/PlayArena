require('../../Schema/owners/turf');
require('../../Schema/bookslots');
require('../../Schema/user');
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
router.use(express.json());
const JWT_TOKEN = "afa6fijnfnmid4s6bef8nm7yt4svabte65da6dfwytfweq6eqg8q()aihfvbaygfad{}q7etur87qugvdqy";

const turf = mongoose.model('Turf');
const bookings = mongoose.model('Bookings');
const user = mongoose.model("Players");

router.post('/get_user_info',async(req,res)=>{
    const {userid}=req.body;
    console.log(userid);
    const user_det=await user.findById(userid);
    if(user_det){
        return res.send({status:1,name:user_det.name,dob:user_det.dob,phone:user_det.phonenumber});
    }
    else{
        return res.send({status:0});
    }
})

module.exports=router;