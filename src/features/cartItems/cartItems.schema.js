
import mongoose, { Schema } from "mongoose";

export const cartSchema = new Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    quantity: Number
})

// By specifying type: mongoose.Schema.Types.ObjectId,
// you're telling Mongoose that this field should hold an ObjectId,
// which is the default data type used by MongoDB for the _id field of documents.


// By specifying ObjectId, you're ensuring that only valid MongoDB ObjectIds can be stored in this field. 
//This helps maintain the integrity of the database, preventing the insertion of invalid data types.