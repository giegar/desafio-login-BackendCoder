import mongoose from "mongoose";

const collection = 'users'

const schemaUsers = mongoose.Schema({
    name: String, //{type: String, required: [true, 'name is required']},
    lastname: String, //{type: String, required: [true, 'lastname is required']},
    age: Number, //{type: Number, required: [true, 'age is required']},
    email: String, //{type: String, required: [true, 'email is required']},
    password: String, //{type: String, required: [true, 'password is required']},
    rol: String, //{type: String, default: 'user', enum: ['user', 'admin']},
    date: Date,//{type: Date, default: Date.now},
})

const UserModel = mongoose.model(collection, schemaUsers)

export default UserModel