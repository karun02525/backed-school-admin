import Joi from "joi";
  
//validation
const parentSchema = Joi.object({
    fullname:Joi.string().min(6).max(30).required(),
    email:Joi.string().min(3).max(25).email(),
    mobile:Joi.string().length(10).pattern(/^[0-9]+$/),  
    gender: Joi.string().min(4).max(6).required(),
    dob: Joi.string().min(8).max(12).required(),
    occupation: Joi.string().min(3).max(15).required(),
    address: Joi.string().min(20).max(100).required(),
    doc_id: Joi.string().min(5).max(20).required(),
    document: Joi.string().min(3).max(30).required(),
    state: Joi.string().min(4).max(20).required(),
    distc: Joi.string().min(4).max(20).required(),
    post_office: Joi.string().min(3).max(20).required(),
    pincode: Joi.string().min(6).max(6).required(),

});

export default parentSchema;
