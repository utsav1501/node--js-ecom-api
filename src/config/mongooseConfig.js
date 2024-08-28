import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.Schema.js";

dotenv.config();
const url=process.env.DB_URL;

export const connectUsingMongoose=async()=>{
    try{
        await mongoose.connect(url);
        console.log("Mongodb using mongoose is connected");
        addCategories();
    }catch(err){
        console.log(err);
    }
}

async function addCategories() {
    const CategoryModel=mongoose.model('Category',categorySchema);
    await CategoryModel.insertMany([{name:'Books'},{name:'Clothing'},{name:'Electronics'}]);
    console.log("Categories are added");
}