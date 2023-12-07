import mongoose from "mongoose";

const collection = "messages"

const MsgSchema = new mongoose.Schema({
    user: {type:String,
        required:[true, 'Username is required']},
    message: {type:String,
        required:[true, 'A message is required']}
})

const MsgModel = mongoose.model(collection, MsgSchema);

export default MsgModel;