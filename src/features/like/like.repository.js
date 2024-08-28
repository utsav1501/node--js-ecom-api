import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import {ObjectId} from "mongodb";


const LikeModel=mongoose.model('Like',likeSchema)
export class LikeRepository{

    async getLikes(type,id){
        const result=await LikeModel.find();
        // console.log(result)
        // console.log("id:"+id);
        // console.log("type:"+type);
        const likes=await LikeModel.find({
            likeable:new ObjectId(String(id)),
            types:type
        }).populate('user').populate({path:'likeable',model:type})
        // const likes=await LikeModel.findById(new ObjectId(String(id)));
        // console.log("after fetching:"+likes);
        return likes;
    }

   //have two function one for like the product and another for like the category 
    async likeProduct(userId,productId){
        try{
            const newLike=new LikeModel({
                user:new ObjectId(String(userId)),
                likeable:new ObjectId(String(productId)),
                types:'Product'
            });
            await newLike.save();
        }catch(err){
            console.log(err);
            return res.status(200).send("Something went wrong");
    }
}
    async likeCategory(userId,categoryId){
        try{
            const newLike=new LikeModel({
                user:new ObjectId(String(userId)),
                likeable:new ObjectId(String(categoryId)),
                types:'Category'
            });
            await newLike.save();
        }catch(err){
            console.log(err);
            return res.status(200).send("Something went wrong");
    }
    }  
}