import mongoose from "mongoose";

const productsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
   

})

export const productsModal=mongoose.model("products",productsSchema);

