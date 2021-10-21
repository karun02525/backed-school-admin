import Joi from "joi";
  
//validation
const studentSchema = Joi.object({
    fname:Joi.string().min(3).max(10).required(),
    lname:Joi.string().min(3).max(10).required(),
    gender: Joi.string().min(4).max(6).required(),
    dob: Joi.string().min(8).max(12).required(),
    qualification: Joi.string().min(2).max(15).required(),
    classes: Joi.string().min(24).max(24).required(),
    doc_id: Joi.string().min(5).max(20).required(),
    document: Joi.string().min(3).max(30).required(),
    email:Joi.string().min(3).max(25).email(),
    mobile:Joi.string().length(10).pattern(/^[0-9]+$/),  
    father_title: Joi.string().min(2).max(10).required(),
    father_name: Joi.string().min(6).max(30).required(),
    father_occupation: Joi.string().min(2).max(20).required(),
    father_qualification: Joi.string().min(2).max(20).required(),
    mother_title: Joi.string().min(2).max(10).required(),
    mother_name: Joi.string().min(6).max(30).required(),
    mother_occupation: Joi.string().min(2).max(20).required(),
    mother_qualification: Joi.string().min(2).max(20).required(),
    parent_document: Joi.string().min(2).max(20).required(),
    parent_doc_id: Joi.string().min(6).max(20).required(),
    address: Joi.string().min(20).max(100).required(),
    state: Joi.string().min(4).max(20).required(),
    distc: Joi.string().min(4).max(20).required(),
    post_office: Joi.string().min(3).max(20).required(),
    pincode: Joi.string().min(6).max(6).required(),

});

export default studentSchema;
