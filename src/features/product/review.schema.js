
import mongoose from "mongoose";

export const reviewSchema=new mongoose.Schema({
    //Every reviews has one product and user as well
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    rating:Number
})