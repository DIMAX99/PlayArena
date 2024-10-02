require('../../Schema/owners/turf');
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
const owner=mongoose.model('Owners');
const turftiming=mongoose.model('Turftiming');

router.post('/addnewturf', async (req, res) => {
    const { token, name, description, amenities, latitude, longitude, address, images } = req.body;
    try {
      const existowner = jwt.verify(token, JWT_TOKEN);
      const ownerData = await owner.findOne({ email: existowner.email });
      if (!ownerData) {
        return res.send({ status: 0, message: 'Owner not found' });
      }
      const id = ownerData._id;
      const turfData = await turf.create({
        owner: id,
        name: name,
        description: description,
        amenities: amenities,
        latitude: latitude,
        longitude: longitude,
        address: address,
        image: images,
      });
      console.log('added');
      res.send({ status: 1, message: 'Turf Added Successfully',data:turfData._id});
    } catch (error) {
      console.error(error);
      res.send({ status: 0, message: 'Error adding turf' });
    }
  });
router.post('/gettiming',async(req,res)=>{
  const {turfid}=req.body;
  const timings=await turftiming.findOne({turfid:turfid});
  const turfdata=await turf.findOne({_id:turfid});
    if(!timings){
    return res.send({status:0});
  }else{
    return res.send({status:1,data:timings,name:turfdata.name});
  }
})
router.post('/updatetime',async(req,res)=>{
  const {turfid,slot,monday,tuesday,wednesday,thursday,friday,saturday,sunday}=req.body;
  const already=await turftiming.findOne({turfid:turfid});
  if(!already){
      try{
        const d=turftiming.create({
        turfid,slot,monday,tuesday,wednesday,thursday,friday,saturday,sunday,
      });
      return res.send({status:1,data:d});
    }catch(e){
      return res.send({status:0,data:e});
    }
  }
  else{
    try{
      const d=await turftiming.updateOne({turfid:turfid},{
        $set:{
          turfid,slot,monday,tuesday,wednesday,thursday,friday,saturday,sunday,
        },
      });
      return res.send({status:1,data:d});
    }catch(error){
     return res.send({status:0,data:error});
    }
    }
});

router.post('/updatededefaultprice',async(req,res)=>{
  const {turfid,defaultprice}=req.body;
  try{
    const turf= await turftiming.findOne({turfid:turfid});
    if(turf){
      await turftiming.updateOne({turfid:turfid},{$set:{
        defaultprice:defaultprice
      }})
      return res.send({status:1});
    }else{
      return res.send({status:0});
    }
  }catch(error){
    console.log(error);
    return res.send({status:0,message:'Problem occured'});
  }
  
})


module.exports=router;