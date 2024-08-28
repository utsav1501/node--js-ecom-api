//Manage routes/paths to productController
//1)Import express
import express from 'express';
import ProductController from './product.controller.js';
import {upload} from "../../middlewares/fileUpload.middleware.js";
//2.Initialize express router
const Productrouter=express.Router();

const productController=new ProductController();

//All the paths to controller method
//localhost/api/products;
//queryParameter->for passing data from client to server
//->localhost:3000/api/products/filter?minPrice=10&maxPrice=20&category=Category1

Productrouter.post("/rate",(req,res,next)=>{
    productController.rateProduct(req,res,next)
})
Productrouter.get("/filter",(req,res)=>{
    productController.filterProducts(req,res)
});


Productrouter.get("/",(req,res)=>{
    productController.getAllProducts(req,res);
});
Productrouter.post("/",upload.single('imageUrl'),(req,res)=>{
    productController.addProduct(req,res)
});
Productrouter.get("/averagePrice",(req,res,next)=>{
    productController.averagePrice(req,res);
})

Productrouter.get("/:id",(req,res)=>{productController.getOneProduct(req,res)})


export default Productrouter;

