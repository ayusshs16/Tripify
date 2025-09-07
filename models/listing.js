const mongoose=require("mongoose");
const schema=mongoose.Schema;

const listingschema=new schema({
    title:String,
    description:String,
    image:{
        filename:String,
        url:String
    },
    price:Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;