import Joi from "joi";
import { Student, AssignTeacher, Attendance, Teacher } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const adminController = {

  // Assign Roll No
  async assignRollno(req, res, next) {
    //validation
    const student_id = req.query.student_id;
    const rollno = parseInt(req.query.rollno);
    const class_id = req.query.class_id;

    const rollnoSchema = Joi.object({
      student_id: Joi.string().length(24).required(),
      class_id: Joi.string().length(24).required(),
      rollno: Joi.number().min(1).max(99).required(),
    });
    const { error } = rollnoSchema.validate({student_id, rollno,class_id });
    if (error) {
      return next(error);
    }

    try {
      const exist = await Student.exists({_id:student_id,classes:class_id});
      if (!exist) {
        return next(
          CustomErrorHandler.alreadyExist("the class id not exist please try again.")
        );
      }
    } catch (error) {
      return next(error);
    }

    try {
     // const data = await Student.exists({classes:class_id ,rollno:rollno});
      const data = await Student.findOne({ $and:[{classes:class_id ,rollno:rollno}]}).populate('classes');
      if (data) {
        return next(
         // CustomErrorHandler.alreadyExist(` already assigned by class roll no.`)
          CustomErrorHandler.alreadyExist(`${data.fname} ${data.lname} already assigned by class ${data.classes.name} roll no ${data.rollno}.`)
        );
      }
    } catch (error) {
      return next(error);
    }
    // than updates
    let document;
    try {
      document = await Student.findOneAndUpdate(
        { _id: student_id },
        { rollno},
        { new: true }
      ).populate('classes');
    } catch (error) {
      return next(error);
    }
    res.status(200).json({
      status: true,
      message:`${document.fname} ${document.lname} roll no assigned by class ${document.classes.name} roll no ${document.rollno} successfully!!.`,
      data: document,
    });
  },

  //Find All Assign Rollno
  async findAllAssignRollno(req, res, next) {
    let document;
    try {
      document = await Student.find();
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: true, data: document });
  },

  //Find all Students by class id
  async findAllStudentsByClassId(req, res, next) {
    const class_id = req.query.class_id;
    const schema = Joi.object({
      class_id: Joi.string().length(24).required(),
    });
    const { error } = schema.validate({ class_id });
    if (error) {
      return next(error);
    }

    let document;
    try {
      document = await Student.find({ classes:class_id }).populate("classes", "_id name")
      
      if (document.length === 0) {
        return res
          .status(400)
          .json({ status: false, message: "data are empty" });
      }
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: true, message: "success", data: document });
  },

  //Find By  To All Students
  async findAllStudents(req, res, next) {
    let document;
    try {
      document = await Student.find()
        .select("-updatedAt -__v")
        .sort({ _id: 1 });
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res.json(document);
  },

  //Assign Teacher with class
  async assignUpdateTeacher(req, res, next) {
    //validation
    const schema = Joi.object({
      teacher_id: Joi.string().length(24).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { teacher_id } = req.body;

    try {
      const exist = await AssignTeacher.exists({ teacher: teacher_id });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("this the teacher already taken.")
        );
      }
    } catch (error) {
      return next(error);
    }

    let document;
    try {
      document = await AssignTeacher.findOneAndUpdate(
        { class_id: req.params.id },
        { teacher: teacher_id, status: 1 },
        { new: true }
      );

      await Teacher.findOneAndUpdate({ _id: teacher_id },{ classes: req.params.id});

    } catch (error) {
      return next(error);
    }
    res
      .status(200)
      .json({ status: true, message: "updates successfully", data: document });
  },

  //Find assign teacher
  async findAssignTeacher(req, res, next) {
    let document;
    try {
      document = await AssignTeacher.find()
        .populate("teacher", "fname lname mobile teacher_avatar")
        .select("-createdAt -__v -_id");
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res.json({ status: true, data: document });
  },


  //delete assign class teacher**************
  async deleteAssignClassTeacher(req, res, next) {
    const class_id=req.params.id;
    let document;
    try {
      document = await AssignTeacher.findOneAndUpdate(
        { class_id},
        { teacher: null, status: 0 },
        { new: true }
      );
      try{
        await Teacher.findOneAndUpdate({class_id},{ classes:null},{ new: true });
      } catch (error) {
        return next(error);
      }
      } catch (error) {
        return next(error);
      }
      res.status(200)
      .json({ status: true, message: "successfully deleted assign teacher!" });
  },



    //find all Attendance Student
    async findAttendance(req, res, next) {
      let document;
      try {
        document = await Attendance.find();
      } catch (error) {
        return next(CustomErrorHandler.serverError());
      }
      res
        .status(200)
        .json({ status: true, message: "showing all notification", data: document });
    },



  //find Assign Teacher Class Id
  async findAssignTeacherClassId(req, res, next) {
    const class_id = req.query.class_id;
    //validation
    const schema = Joi.object({
      class_id: Joi.string().length(24).required(),
    });
    const { error } = schema.validate({class_id });
    if (error) {
      return next(error);
    }
    let document;
    try {
      document = await AssignTeacher.findOne({class_id})
        .populate("teacher",'-__v')
        .select("-createdAt -__v -_id");
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res.json({ status: true, data: document });
  },



};



export default adminController;
