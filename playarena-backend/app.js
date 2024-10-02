
require('./Schema/user');
const express=require("express"); 
const app=express();
const mongoose=require('mongoose');
const port=8003;
const mongourl="mongodb+srv://divitc2004:admin@cluster0.rwratcu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
app.use(express.json());
const jwt = require('jsonwebtoken');
const bcrypt=require("bcryptjs");
const JWT_TOKEN="afa6fijnfnmid4s6bef8nm7yt4svabte65da6dfwytfweq6eqg8q()aihfvbaygfad{}q7etur87qugvdqy";

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


mongoose.connect(mongourl).then(()=>{
    console.log('database connected');
}).catch((e)=>{
    console.log(e);
});
app.listen(port,()=>{
    console.log("hello");
});

const user=mongoose.model("Players");
app.post('/reg', async(req,res)=>{
    const {name,dob,email,phonenumber,username,password}=req.body;
    const encryptedPassword=await bcrypt.hash(password,10);
    try{
        await user.create({
            name:name,
            dob:dob,
            email:email,
            phonenumber:phonenumber,
            username:username,
            password:encryptedPassword,
        });
        res.send({status:1});
    }catch(error){
        res.send({status:0});
    }
});
app.post('/log', async(req,res)=>{
    const {username,password}=req.body;
    console.log(username,password);
    try{
        console.log("in 1");
        const olduser=await user.findOne({username:username});
        // console.log(olduser);
        if(!olduser){
            // console.log(olduser);
            res.send({status:0,message:"Incorrect Details"});
        }
        if(await bcrypt.compare(password,olduser.password)){
            console.log('pass okay');
            const token=jwt.sign({email:olduser.email},JWT_TOKEN); 
            if(res.status(201)){
                console.log('done');
                return res.send({status:1,message:"login successfull",data:token,id:olduser._id});
            }else{
                return res.send({error:"login Failed"});
            }
        }else{
            return res.send({status:0});
        }
    }catch(error){
        console.log(error);
    }
});

app.post('/getusername',async(req,res)=>{
    const {token}=req.body;
    try{
        const solvedtoken=jwt.decode(token,JWT_TOKEN);
        const getuser=await user.findOne({email:solvedtoken.email});
        if(getuser){
            return res.send({status:1,name:getuser.name});
        }else{
            return res.send({status:0});
        }
    }catch(error){
        console.log(error);
        return res.send({status:0});
    }
})



const owneroute=require('./Routes/Owner/register');
app.use('/api/owner',owneroute);
const turfregroute=require('./Routes/Owner/turfadd');
app.use('/api/owner/addturf',turfregroute);
const getturf=require('./Routes/Owner/get_turf');
app.use('/api/owner/turf',getturf);
const getbooking=require('./Routes/Owner/get_bookings');
app.use('/api/owner/turfinfo',getbooking);
const user_get_turfs=require('./Routes/Player/get_turf');
app.use('/api/user/get_turfs',user_get_turfs);
const play_checkout=require('./Routes/Player/book');
app.use('/api/player/checkout',play_checkout);
const player_my_bookings=require('./Routes/Player/get_bookings');
app.use('/api/player/',player_my_bookings);
const get_user_info=require('./Routes/Owner/get_use_info');
app.use('/api/owner/bookings',get_user_info);

