import mongoose  from "mongoose";

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    fname:{type:String,required:true},
    lname:{type:String,required:true},
    gender:{type:String,required:true},
    dob:{type:String,required:true},
    qualification:{type:String,required:true},
    rollno:{type:Number,default:0},
    doc_id:{type:String,required:true,unique:true},
    document:{type:String,required:true},
    student_avatar:{type:String,default:''},
    email:{type:String,required:true,unique:true},
    mobile:{type:String,required:true,unique:true},
    father_title:{type:String,required:true},
    father_name:{type:String,required:true},
    father_occupation:{type:String,required:true},
    father_qualification:{type:String,required:true},
    mother_title:{type:String,required:true},
    mother_name:{type:String,required:true},
    mother_occupation:{type:String,required:true},
    mother_qualification:{type:String,required:true},
    parent_document:{type:String,required:true},
    parent_doc_id:{type:String,required:true},
    state:{type:String,required:true},
    distc:{type:String,required:true},
    post_office:{type:String,required:true},
    pincode:{type:String,required:true},
    address:{type:String,required:true},
    parent_avatar:{type:String,default:''},
    parent_doc_front:{type:String,default:''},
    parent_doc_back:{type:String,default:''},
    student_doc_front:{type:String,default:''},
    student_doc_back:{type:String,default:''},
    classes: { type: mongoose.Schema.Types.ObjectId, ref: 'Classes'},
},{timestamps:true});


export default mongoose.model('Student',StudentSchema)