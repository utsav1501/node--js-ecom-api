import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.Schema.js";

const ProductModel=mongoose.model('Product',productSchema);
const ReviewModel=mongoose.model('Review',reviewSchema);
const CategoryModel=mongoose.model('Category',categorySchema);
class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  // Add a new product
  async add(productData) {
    try {
      productData.categories=productData.category.split(',').map(e=>e.trim());
      console.log(productData);
      //1.Add the product
      const newProduct=new ProductModel(productData);
      const savedProduct=await newProduct.save();

      //2.Update categories
     const result=await CategoryModel.updateMany(
        {_id:{$in:productData.categories}},//id is inside the productData categories 
        {
          $push:{products:new ObjectId(String(savedProduct._id))}
        }
      )
      console.log(result);
    } catch (err) {
      console.log(err); // Using console.error for logging errors
      throw new ApplicationError("Unable to add new product", 500);
    }
  }

  // Get all products
  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const products=await collection.find().toArray();
      console.log(products);
      return products;
    } catch (err) {
      console.error(err); // Using console.error for logging errors
      throw new ApplicationError("Unable to retrieve products", 500);
    }
  }

  // Get a product by its ID
  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.findOne({ _id: new ObjectId(String(id)) });
    } catch (err) {
      console.log(err); // Using console.error for logging errors
      throw new ApplicationError(`Unable to retrieve product with ID ${id}`, 500);
    }
  }

  // Filter products based on price range and category
  async filter(minPrice,categories) {
    try{
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression={};
      if(minPrice){
          filterExpression.price = {$gte: parseFloat(minPrice)}
      }
      // if(maxPrice){
      //     filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)}
      // }
      console.log(categories);
      categories=JSON.parse(categories.replace(/'/g,'"'));
      if(categories){
          filterExpression={$or:[{categories:{$in:categories}},filterExpression]};
          // filterExpression={$or:[{category:category},filterExpression]};
      }
      return await collection.find(filterExpression).project({name:1,price:1,_id:0,ratings:{$slice:1}}).toArray();
      
  }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
  }
  }

//   async rate(userID, productID, rating){
//     try{
//         //1.Check if Product exists
//         const productToUpdate=await ProductModel.findById(productID);
//         if(!productToUpdate){
//           throw new Error('Product not found');
//         }

//         //2.Get the existing review for user
//       const userReview=await ReviewModel.findOne({product:new ObjectId(String(productID)),user:new ObjectId(String(userID))});
//       if(userReview){
//         //means user has already provided the review means update the review with new review
//         userReview.rating=rating;
//         await userReview.save();
//       }
//       else{
//         //means userReview for specified product not exist so we have to add new review
//         const newReview=new ReviewModel({
//           product:new ObjectId(String(productID)),
//           user:new ObjectId(String(userID)),
//           rating:rating
//         })
//         newReview.save();
//       }
//     }catch(err){
//         console.log(err);
//         throw new ApplicationError("Something went wrong with database", 500);
//     }
// }

async rate(userID, productID, rating){
  try{
      // 1. Check if product exists
      const productToUpdate = await ProductModel.findById(productID);
      if(!productToUpdate){
          throw new Error("Product not found")
      }

      // Find the existing review
      const userReview = await ReviewModel.findOne({product: new ObjectId(String(productID)), user: new ObjectId(String(userID))});
      if(userReview){
          userReview.rating = rating;
          await userReview.save();
      }else{
          const newReview = new ReviewModel({
              product: new ObjectId(String(productID)),
              user: new ObjectId(String(userID)),
              rating: rating
          });
          newReview.save();
      }
  }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);    
  }
}

async averageProductPriceCategory(){
  try{
  const db=getDB();
  return await db.collection(this.collection)
  .aggregate([
     {
          //stage1:Get average price per category
          $group:{
              _id:"$category",//grouped the product by using id:category
              averagePrice:{$avg:"$price"}
          }
     } 
  ]).toArray();
  }catch(err){
      console.log(err);
      return res.status(201).send("Something went wrong");
}
}
}

export default ProductRepository;
