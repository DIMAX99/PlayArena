const mongoose=require('mongoose');

const reviewschema=new mongoose.Schema({
    turfid:{type:mongoose.Schema.ObjectId,ref:'Turf',required:true},
    userid:{type:mongoose.Schema.ObjectId,ref:'Players',required:true},
    rating:{type:Number,require:true},
    comment:{type:String,require:false,default:'comment'},
    created_at:{type:Date,default:Date.now}
},{
    collection:"Review"
});
mongoose.model("Review",reviewschema);

