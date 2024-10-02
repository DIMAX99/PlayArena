const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    name:String,
    dob:{type:Object},
    email:String,
    phonenumber:Number,
    username:String,
    password:String,
},{
    collection:"Players"
});

mongoose.model("Players",userschema);