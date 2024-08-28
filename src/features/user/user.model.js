import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserModel{
    constructor(name,email,password,type,id){
        this.name=name;
        this.email=email;
        this.password=password;
        this.type=type;
        this._id=id;
    }

    static getAll(){
        return users;
    }
}

let users=[{
    id:1,
    name:"Seller User",
    email:"seller@ecom.com",
    password:"password1",
    type:"Seller",
},
{
    id:2,
    name:"Customer User",
    email:"Customer@gmail.com",
    password:"password1",
    type:"Customer",
}
];