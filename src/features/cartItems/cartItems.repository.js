import { ObjectId, ReturnDocument } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartItemsRepository{
         constructor(){
            this.collection="cartItems";
        }
    async add(productID,userID,quantity){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
            const id=await this.getNextCounter(db);
            //find the document if it is already found increment it by 1
            //either insert or update based on criteria product is found or not
            //Insertion.
            await collection.updateOne({productID:new ObjectId(String(productID)),userID:new ObjectId(String(userID))},
            {
                $setOnInsert:{_id:id},
                $inc:{
                quantity:quantity
            }},
            {upsert:true})
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database",500);
        }
    }
    async get(userID){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
            return await collection.find({userID:new ObjectId(String(userID))}).toArray();

        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database",500);
        }
    }

    async delete(userID,cartItemID){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
            const result=await collection.deleteOne({_id:new ObjectId(String(cartItemID)),userID:new ObjectId(String(userID))});
            return result.deletedCount>0;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database",500);
        }
    }

    async getNextCounter(db){
        const resultDocument=await db.collection("counters").findOneAndUpdate(
            {_id:'cartItemId'},
            {$inc:{value:1}},
            {returnDocument:'after'}
        )
        console.log(resultDocument);
        return resultDocument.value;
    }
}