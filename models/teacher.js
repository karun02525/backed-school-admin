import mongoose  from "mongoose";

const Schema = mongoose.Schema;

const TeacherSchema = new Schema({

    fname:{type:String,required:true},
    lname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    mobile:{type:String,required:true,unique:true},
    gender:{type:String,required:true},
    dob:{type:String,required:true},
    qualification:{type:String,required:true},
    address:{type:String,required:true},
    parent_name:{type:String,required:true},
    doc_id:{type:String,required:true,unique:true},
    document:{type:String,required:true},
    teacher_avatar:{type:String,default:''},
    state:{type:String,required:true},
    distc:{type:String,required:true},
    post_office:{type:String,required:true},
    pincode:{type:String,required:true},
    teacher_doc_front:{type:String,default:''},
    teacher_doc_back:{type:String,default:''},
    certificate_doc_front:{type:String,default:''},
    certificate_doc_back:{type:String,default:''},
    classes: { type: mongoose.Schema.Types.ObjectId, ref: 'Classes'}
},{timestamps:true});


export default mongoose.model('Teacher',TeacherSchema)