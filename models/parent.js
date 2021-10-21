import mongoose  from "mongoose";

const Schema = mongoose.Schema;

const ParentSchema = new Schema({

    fullname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    mobile:{type:String,required:true,unique:true},
    gender:{type:String,required:true},
    dob:{type:String,required:true},
    occupation:{type:String,required:true},
    address:{type:String,required:true},
    doc_id:{type:String,required:true,unique:true},
    document:{type:String,required:true},
    avatar:{type:String,default:''},
    doc_front_avatar:{type:String,default:''},
    doc_back_avatar:{type:String,default:''},
    state:{type:String,required:true},
    distc:{type:String,required:true},
    post_office:{type:String,required:true},
    pincode:{type:String,required:true},
    students: [{ type: Schema.ObjectId, ref: 'Student' }],

},{timestamps:true});


export default mongoose.model('Parent',ParentSchema)