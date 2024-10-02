require('../../Schema/user');
require('../../Schema/owners/turf');
require('../../Schema/userbookings');
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
router.use(express.json());
const JWT_TOKEN = "afa6fijnfnmid4s6bef8nm7yt4svabte65da6dfwytfweq6eqg8q()aihfvbaygfad{}q7etur87qugvdqy";

const user = mongoose.model("Players");
const turf = mongoose.model('Turf');
const userbookings=mongoose.model('UserBookings');

router.post('/my_bookings',async(req,res)=>{
    const {token}=req.body;
    const decoded_mail=jwt.verify(token,JWT_TOKEN);
    const exist_user=await user.findOne({email:decoded_mail.email});
    const bookings=await userbookings.find({user_id:exist_user._id});
    return res.send({status:1,bookings:bookings});
});

router.post('/get_turf_name',async(req,res)=>{
    const {turfid}=req.body;
    const turf_det=await turf.findById(turfid);
    return res.send({status:1,turfname:turf_det.name,turfaddress:turf_det.address.address});
})

module.exports=router;
