import { syslog } from "winston/lib/winston/config/index.js";
import CartItemModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";
export class CartItemController{
    constructor(){
        this.CartItemsRepository=new CartItemsRepository();
    }
    async add(req,res){
        try{
            const {productID,quantity}=req.body;
            const userID=req.userID;
            await this.CartItemsRepository.add(productID,userID,quantity);
            res.status(201).send('cart is updated'); 
        }catch(err){
            console.log(err);
            return res.status(200).send("Something went wrong");
            }    
    }
    async get(req,res){
        try{
        const userID=req.userID;
        const items=await this.CartItemsRepository.get(userID);
        console.log(items);
        return res.status(200).send(items);
    }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
        }
    }
    async delete(req,res){
        const userID=req.userID;
        const cartItemID=req.params.id;
        const isDeleted=await this.CartItemsRepository.delete(userID,cartItemID);
        if(!isDeleted){
            return res.status(404).send("Item not found");
        }
        return res.status(200).send("Cart item is removed");
    }
    
}