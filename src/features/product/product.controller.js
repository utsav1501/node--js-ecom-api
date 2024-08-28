import { syslog } from "winston/lib/winston/config/index.js";
import { getDB } from "../../config/mongodb.js";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController{

    constructor(){
        this.productRepository=new ProductRepository();
        }

    async getAllProducts(req,res){
        try{
        const products=await this.productRepository.getAll();
        res.status(200).send(products);
        }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
        }
    }
    async addProduct(req,res){
        try{
            const {name,price,sizes,categories,description}=req.body;
            const newProduct=new ProductModel(name,description,parseFloat(price),
            req?.file?.filename,categories,sizes?.split(','))
            const createdRecord=await this.productRepository.add(newProduct);
            res.status(201).send(createdRecord);
            }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
    }
}
    async rateProduct(req,res,next){
        try{
        const userID=req.userID;
        const productID=req.body.productID;
        const rating=req.body.rating;
        await this.productRepository.rate(userID,productID,rating);
        }
        catch(err){
            return res.status(400).send(err.message);
        }
        return res.status(200).send("Rating has been added");
    }
    async getOneProduct(req,res){
        try{
            const id= req.params.id;//all the parameters which you specify on routes is accessed with the help of params
            const products=await this.productRepository.get(id);
            if(!product){
                res.status(404).send("Product not found")
             }else{
                 return res.status(200).send(product);
             }
            }catch(err){
            console.log(err);
            return res.status(201).send("Something went wrong");
            }
       
        const product=ProductModel.get(id);
       
    }

    //queryParameter->for passing data from client to server
    //->localhost:3000/api/products/filter?minPrice=10&maxPrice=20&category=Category1
    async filterProducts(req,res){
        try{
        const minPrice=req.query.minPrice;
        // const maxPrice=req.query.maxPrice;
        const categories=req.query.categories;
        const result=await this.productRepository.filter(minPrice,categories);
        res.status(200).send(result);
        }catch(err){
            console.log(err);
            return res.status(201).send("Something went wrong");
    }
}
    async averagePrice(req,res,next){
        try{
            const result=await this.productRepository.averageProductPriceCategory();
            res.status(200).send(result);
        }catch(err){
            console.log(err);
            return res.status(201).send("Something went wrong");
    }
    }
    
}