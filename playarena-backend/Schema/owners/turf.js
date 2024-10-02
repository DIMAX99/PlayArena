const mongoose=require("mongoose");

const turfschema=new mongoose.Schema({
        owner:{type:mongoose.Schema.ObjectId, ref:'Owners'},
        name:String,
        description:String,
        amenities:[{
            id:String,
            name:String,
            icon:String,
        }],
        latitude:String,
        longitude:String,
        address:{state:String,city:String,address:String},
        image:[{uri:String}],
},{
    collection:"Turf"
});

mongoose.model("Turf",turfschema);
