import { Classes, AssignTeacher } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import Joi from "joi";

const classController = {
  //Create a Class
  async createClass(req, res, next) {
    const classSchema = Joi.object({
      name: Joi.string()
        .valid(
          "LKG",
          "UKG",
          "1st Standard",
          "2nd Standard",
          "3rd Standard",
          "4th Standard",
          "5th Standard",
          "6th Standard",
          "7th Standard",
          "8th Standard",
          "9th Standard",
          "10th Standard"
        )
        .required(),
    });

    const { error } = classSchema.validate(req.body);

    if (error) return next(error);

    try {
      const exist = await Classes.exists({ name: req.body.name });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("this class name already taken.")
        );
      }
    } catch (error) {
      return next(error);
    }

    let result;
    try {
      let saveData = new Classes({ name: req.body.name });
      const data = await saveData.save();
      result = {
        class_id: data._id,
        name: data.name,
      };
      //update manages teacher collections
      await new AssignTeacher(result).save();
    } catch (error) {
      return next(error);
    }

    res
      .status(201)
      .json({
        status: true,
        message: "successfully create a class",
        data: result,
      });
  },

  //Delate a Class
  async deleteClass(req, res, next) {
    //validation
    const id = req.params.id;
    const schema = Joi.object({
      id: Joi.string().length(24).required(),
    });
    const { error } = schema.validate({ id });
    if (error) {
      return next(error);
    }
    try {
      let document;
       document = await Classes.findOneAndRemove({ _id: id });
         await AssignTeacher.findOneAndRemove({ class_id: id });
      if (document==null) {
        return res
          .status(400)
          .json({ status: false, message: "data are empty" });
      }
    } catch (error) {
      return next(error);
    }
    res
      .status(200)
      .json({ status: true, message: "successfully deleted class!" });
  },

  //Find all Class
  async findAllClass(req, res, next) {
    let document;
    try {
      document = await Classes.find()
        .select("-updatedAt -__v -createdAt")
        .sort({ _id: 1 });
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res.json({ status: true, message: "succes", data: document });
  },
};

export default classController;
