import express from 'express';
import { CartItemController } from './cartItems.controller.js';

//2.Initialize express router
const Cartrouter=express.Router();

const cartController=new CartItemController();

Cartrouter.delete('/:id',(req,res,next)=>{
    cartController.delete(req,res,next);
});
Cartrouter.post("/",(req,res,next)=>{
    cartController.add(req,res,next);
});
Cartrouter.get("/",(req,res,next)=>{
    cartController.get(req,res,next);
});


export default Cartrouter;