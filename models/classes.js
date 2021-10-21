import mongoose  from "mongoose";

const Schema = mongoose.Schema;

const classSchema = new Schema({
    name:{type:String,required:true}
},{timestamps:true});


export default mongoose.model('Classes',classSchema)