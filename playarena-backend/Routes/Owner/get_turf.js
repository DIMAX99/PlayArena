require('../../Schema/owners/turf');
require('../../Schema/bookslots');
require('../../Schema/owners/owner');
require('../../Schema/owners/turftiming');
const express=require("express");
const router=express.Router();
const mongoose=require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt=require("bcryptjs");
router.use(express.json());
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: true }));
const JWT_TOKEN="afa6fijnfnmid4s6bef8nm7yt4svabte65da6dfwytfweq6eqg8q()aihfvbaygfad{}q7etur87qugvdqy";

const turf=mongoose.model('Turf');
const bookings=mongoose.model('Bookings');
const owner=mongoose.model('Owners');
const turftiming=mongoose.model('Turftiming');
router.post('/fetchturf', async (req, res) => {
    const {token} = req.body;
    try {
      const existowner = jwt.verify(token, JWT_TOKEN);
      const ownerData = await owner.findOne({ email: existowner.email });
      if (!ownerData) {
        return res.send({ status: 0, message: 'Owner not found' });
      }
      const id = ownerData._id;
      const turfData = await turf.find({owner:id});
      res.send({ status: 1, message: 'list of turfs' ,data:turfData});
    } catch (error) {
      console.error(error);
      res.send({ status: 0, message: 'Error adding turf' });
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
router.post('/delete_turf',async(req,res)=>{
  const {turfid}=req.body;
  try{
    const isbookingthere=await bookings.findOneAndDelete({turfid:turfid});
    const istimingthere=await turftiming.findOneAndDelete({turfid:turfid});
    const isturfdeleted=await turf.findOneAndDelete({_id:turfid});
    return res.send({status:1});
  }catch(error){
    console.log(error);
    return res.send({status:0});
  }
});



module.exports=router;