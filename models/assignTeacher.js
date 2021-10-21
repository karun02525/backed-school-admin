import mongoose  from "mongoose";

const Schema = mongoose.Schema;

const assignTeacherSchema = new Schema({
    class_id:{type:String,required:true},
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    name:{type:String,required:true},
    status:{type:Number,default:"0"},
},{timestamps:true});


export default mongoose.model('AssignTeacher',assignTeacherSchema)