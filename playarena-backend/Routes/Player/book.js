require('../../Schema/owners/turf');
require('../../Schema/bookslots');
require('../../Schema/user');
require('../../Schema/owners/turftiming');
require('../../Schema/userbookings');
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
const turftiming = mongoose.model('Turftiming');
const userbookings=mongoose.model('UserBookings');

router.post('/bookturf', async (req, res) => {
    const { userid, turfid, selected_slots ,Total_Cost} = req.body;
    const email = jwt.verify(userid, JWT_TOKEN);
    const user_exist = await user.findOne({ email: email.email });
    const turf_exist = await turf.findById(turfid);
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        if (user_exist && turf_exist) {
            const modifiedslots = Object.fromEntries(
                Object.entries(selected_slots).map(([key, item]) => {
                    return [
                        key, // keep the same key
                        item.map((slot) => ({
                            ...slot,
                            start: new Date(slot.start),
                            end: new Date(slot.end),
                            user_id: user_exist._id
                        }))
                    ];
                })
            );            
            const alreadyhasbookings = await bookings.findOne({ turfid: turfid }).session(session);
            if (alreadyhasbookings) {
                for (const [id, item] of Object.entries(modifiedslots)) {
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
                        session.abortTransaction();
                         return res.send({status:0,message:'Error Booking Turf'});
                    }
                }
            } else {
                await bookings.create([{
                    turfid: turfid, bookings: modifiedslots
                }], { session })
            }
            const booked=await userbookings.create([{
                user_id:user_exist._id,bookings:modifiedslots,turf_id:turfid,total_price:Total_Cost
            }],{session})
            await session.commitTransaction();
            return res.send({ status: 1, message: 'Booking Done',bookingid:booked[0]._id});
        }else{
            session.abortTransaction();
            return res.send({status:0,message:'User Not Found'});
        }
    } catch (error) {
        console.log(error);
        session.abortTransaction();
        return res.send({status:0,message:'Error Booking Turf'});
    } finally {
        session.endSession();
    }
})

module.exports = router;