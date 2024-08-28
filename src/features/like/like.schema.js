import mongoose from "mongoose";

export const likeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'types'
    },
    types:{
        type:String,
        enum:['Product','Category']
    }
}).pre('save',(next)=>{//next middleware added so that the next pre or function will execute
    console.log("New like coming in");
    next();
}).post('save',(doc)=>{
    console.log("Like is saved");
    console.log(doc); 
})
.pre('find',(next)=>{
    console.log("Retriving Likes");
    next();
}).post('find',(docs)=>{
    console.log("Find is completed");
    console.log(docs);
})