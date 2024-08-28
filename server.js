import "./env.js";
import express from 'express';
import swagger from 'swagger-ui-express';


import Productrouter from './src/features/product/product.routes.js';
// import bodyParser from 'body-parser';
import userRouter from './src/features/user/user.routes.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import Cartrouter from './src/features/cartItems/cartItems.routes.js';

import apiDocs from "./swagger.json" assert{type:'json'};
import loggerMiddleware from './src/middlewares/logger.middlerware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import likeRouter from "./src/features/like/like.router.js";



const server=express();



//middleware for parsing data which is received in post request
// server.use(bodyParser.json());
server.use(express.json());

//for all requests related to product,redirect to product routes...
server.use('/api-docs',swagger.serve,swagger.setup(apiDocs));

server.use(loggerMiddleware)
server.use('/api/orders', jwtAuth, orderRouter);

server.use("/api/products",loggerMiddleware,jwtAuth,Productrouter)

server.use("/api/cartItems",jwtAuth,Cartrouter);
server.use("/api/users",userRouter);
server.use('/api/likes',jwtAuth,likeRouter);

server.get('/',(req,res)=>{
    res.send("Welcome to Ecommerce API's")
})

//Error Handler middleware(this will called only when there exist an error in our application )
server.use((err, req, res, next) => {
    console.log(err);

    if(err instanceof mongoose.Error.ValidationError){
        return res.status(400).send(err.message);
    }

    if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
    }
    // server errors.
    res.status(500).send('Something went wrong, please try later'
    );
});

//if no path matches(Middleware to handle 404 request)->if non of the path matches then this will execute
server.use((req,res)=>{
    res.status(404).send("API not found");
})


server.listen(3000,()=>{
    console.log("server is running at 3000");
    connectUsingMongoose();
});



