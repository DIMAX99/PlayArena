const mongoose=require("mongoose");

const bookingSchema=new mongoose.Schema({
    booking_Id:{type:mongoose.Schema.ObjectId,auto:true},
    date:{type:Number,required:true},
    month:{type:Number,required:true},
    year:{type:Number,required:true},
    start:{type:Date,required:true},
    end:{type:Date,required:true},
    price:{type:Number,required:true},
    user_id:{type:mongoose.Schema.ObjectId,ref:'Players',default:null},
    customer_name:{type:String,default:null},
    customer_number:{type:String,default:null},
    owner_booked:{type:Boolean,default:false},
},{_id:false});

const bookSchema=new mongoose.Schema({
    turfid:{type:mongoose.Schema.ObjectId, ref:'Turf'},
    bookings:{
        type:Map,
        of:[bookingSchema]
    }
},{ 
    collection:"Bookings"
});

mongoose.model("Bookings",bookSchema);
