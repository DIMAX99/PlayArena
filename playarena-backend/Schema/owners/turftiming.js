const mongoose=require("mongoose");

const Turftiming=new mongoose.Schema({
        turfid:{type:mongoose.Schema.ObjectId, ref:'Turf'},
        slot:Boolean,
        defaultprice:{type:Number,default:null},
        monday:{openingTime:Date,closingTime:Date,customprice:{type:[{
            start:Date,end:Date,price:Number
        }],default:null}},
        tuesday:{openingTime:Date,closingTime:Date,customprice:{type:[{
            start:Date,end:Date,price:Number
        }],default:null}},
        wednesday:{openingTime:Date,closingTime:Date,customprice:{type:[{
            start:Date,end:Date,price:Number
        }],default:null}},
        thursday:{openingTime:Date,closingTime:Date,customprice:{type:[{
            start:Date,end:Date,price:Number
        }],default:null}},
        friday:{openingTime:Date,closingTime:Date,customprice:{type:[{
            start:Date,end:Date,price:Number
        }],default:null}},
        saturday:{openingTime:Date,closingTime:Date,customprice:{type:[{
            start:Date,end:Date,price:Number
        }],default:null}},
        sunday:{openingTime:Date,closingTime:Date,customprice:{type:[{
            start:Date,end:Date,price:Number
        }],default:null}},

},{
    collection:"Turftiming"
});

mongoose.model("Turftiming",Turftiming);
