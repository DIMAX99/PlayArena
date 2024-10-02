const mongoose=require("mongoose");

const userbookinghistoryschema=new mongoose.Schema({
    user_id:{type:mongoose.Schema.ObjectId,ref:'Players',required:true},
    turf_id:{type:mongoose.Schema.ObjectId,ref:'Turf',required:true},
    bookings:{type:Object,required:true},
    total_price:{type:Number,require:true},
    created_at:{type:Date,default:Date.now}

},{ 
    collection:"UserBookings"
});

mongoose.model("UserBookings",userbookinghistoryschema);
