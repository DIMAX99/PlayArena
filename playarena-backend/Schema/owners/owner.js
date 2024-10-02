const mongoose=require("mongoose");

const ownerschema=new mongoose.Schema({
    CompanyName:String,
    email:String,
    phonenumber:Number,
    password:String,
},{
    collection:"Owners"
});

mongoose.model("Owners",ownerschema);