require('../../Schema/owners/turf');
require('../../Schema/bookslots');
require('../../Schema/owners/owner');

const express=require("express");
const router=express.Router();
const mongoose=require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt=require("bcryptjs");
router.use(express.json());
const JWT_TOKEN="afa6fijnfnmid4s6bef8nm7yt4svabte65da6dfwytfweq6eqg8q()aihfvbaygfad{}q7etur87qugvdqy";


const turf=mongoose.model('Turf');
const bookings=mongoose.model('Bookings');

router.post('/getbookings',async(req,res)=>{
    const {turfid}=req.body;
    const alreadyturf=await turf.findOne({_id:turfid});
    try{
        if(alreadyturf){
            const turfbookings=await bookings.findOne({turfid:turfid});
            if(turfbookings){
                return res.send({status:1,data:turfbookings});
            }else{
                return res.send({status:0,message:'No Bookings for the turf yet'});
            }
        }else{
            return res.send({status:0,message:"Invalid Turf"});
        }
    }catch(err){
        console.log(err);
        return res.send({status:0,message:'error'});
    }
});

router.post('/addbookings',async(req,res)=>{
    const {turfid, selected_slots} = req.body;
    const turf_exist = await turf.findById(turfid);
    const session = await mongoose.startSession(); 
    try{
        session.startTransaction();
        if(turf_exist){
            const alreadyhasbookings = await bookings.findOne({ turfid: turfid }).session(session);
            if(alreadyhasbookings){
                // console.log(alreadyhasbookings);
                for (const [id, item] of Object.entries(selected_slots)){
                    // console.log(alreadyhasbookings.bookings.get('1102024'));
                    try{
                        if(Array.from(alreadyhasbookings.bookings.keys()).includes(id.toString())){
                            // console.log('yes it has');
                            for(const item2 of alreadyhasbookings.bookings.get(id.toString())){
                                const found=item.find((slot)=>new Date(slot.start).getTime()===new Date(item2.start).getTime());
                                if(found){
                                            session.abortTransaction();
                                            return res.send({status:0,message:'Already Booked slot Selected'});
                                        }
                            }
                        }
                        await bookings.updateOne({turfid:turfid},{
                            $push:{
                                [`bookings.${id}`]:{$each:item},
                            }, 
                        },{session});
                    }catch(error){
                        console.log(error);
                        session.abortTransaction();
                         return res.send({status:0,message:'Error Booking Turf'});
                    }
                }
            }else{
                await bookings.create([{
                    turfid: turfid, bookings: selected_slots
                }], { session });
            }
            await session.commitTransaction();
            return res.send({ status: 1, message: 'Booking Done'});
        }else{
            session.abortTransaction();
            return res.send({status:0,message:'Turf Not Found'});
        }
    }catch(error){
        console.log(error);
        session.abortTransaction();
        return res.send({status:0,message:'Error Booking Turf'});
    }finally{
        session.endSession();
    }
});





module.exports=router;