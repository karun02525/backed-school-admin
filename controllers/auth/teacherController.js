import { Teacher, Student, Attendance, Notification } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import { teacherValidator, attendanceValidator } from "../../validators";
import Joi from "joi";
import multer from "multer";
import path from "path";
import fs from "fs";

var storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

var uploadMultiple = upload.fields([
  { name: "teacher_avatar" },
  { name: "teacher_doc_front" },
  { name: "teacher_doc_back" },
  { name: "certificate_doc_front" },
  { name: "certificate_doc_back" },
]);

const teacherController = {

  async createTeacher(req, res, next) {
    const { error } = teacherValidator.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const exist = await Teacher.exists({ mobile: req.body.mobile });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("this mobile number already taken.")
        );
      }
    } catch (error) {
      return next(error);
    }

    try {
      const exist = await Teacher.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("this email id already taken.")
        );
      }
    } catch (error) {
      return next(error);
    }

    try {
      const exist = await Teacher.exists({ doc_id: req.body.doc_id });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist(
            "this teacher document id already taken."
          )
        );
      }
    } catch (error) {
      return next(error);
    }

    let result;
    try {
      let saveData = new Teacher({ ...req.body });
      result = await saveData.save();
    } catch (error) {
      return next(error);
    }

    res.status(201).json({
      status: true,
      message: "successfully create a teacher and please upload documents.",
      id: result._id,
    });
  },



  //*************************************************** Upload Teacher ********************** */   
  async uploadTeacherFiles(req, res, next) {
    uploadMultiple(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError());
      }

      //validation
      const { id } = req.body;
      const schema = Joi.object({
        id: Joi.string().length(24).required(),
      });
      const { error } = schema.validate({ id });
      if (error) {
        return next(error);
      }

      const file = req.files;
      if (file) {
        const key = Object.keys(file)[0];
        if (key === "teacher_avatar") {
          doOperationTeacherUpdate(
            id,
            { teacher_avatar: file["teacher_avatar"][0].path },
            next
          );
        }  else if (key === "teacher_doc_front") {
          doOperationTeacherUpdate(
            id,
            { teacher_doc_front: file["teacher_doc_front"][0].path },
            next
          );
        } else if (key === "teacher_doc_back") {
          doOperationTeacherUpdate(
            id,
            { teacher_doc_back: file["teacher_doc_back"][0].path },
            next
          );
        } else if (key === "certificate_doc_front") {
          doOperationTeacherUpdate(
            id,
            { certificate_doc_front: file["certificate_doc_front"][0].path },
            next
          );
        } else if (key === "certificate_doc_back") {
          doOperationTeacherUpdate(
            id,
            { certificate_doc_back: file["certificate_doc_back"][0].path },
            next
          );
        } else {
          res.status(400).json({
            status: false,
            message: 'photo upload has failed.',
          });
        }
      }
      res.json({
        status: true,
        message: 'photo updated successfully!!',
      });
    });
  },
 
  //************************************************************* Delete Upload file for teachers********** */
  //delete uploaded file photos,front doc,back doc vai student,teacher,parent
  async deleteTeacherUploadedPhoto(req, res, next) {
    const id = req.query.id;
    const source = req.query.source;

    //validation
    const schema = Joi.object({
      id: Joi.string().length(24).required(),
      source: Joi.string().valid("teacher_avatar", "teacher_doc_front", "teacher_doc_back", "certificate_doc_front", "certificate_doc_back" ).required(),
    });
    const { error } = schema.validate({ id, source });
    if (error) {
      return next(error);
    }
      try {
        const document = await Teacher.findOneAndUpdate(
          { _id: id },
          { [source]: "" }
        );
        doOperationDelete(document, source, next);
      } catch (error) {
        return next(error);
      }
    
    res.json({
      status: true,
      message: `Teacher ${source} deleted successfully!`,
    });
  },





  async updateTeacher(req, res, next) {
    //validation
    const teacherUpdateSchema = Joi.object({
      email: Joi.string().min(3).max(25).email(),
      mobile: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/),
      qualification: Joi.string().min(3).max(15),
    });
    const { error } = teacherUpdateSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { mobile, email, qualification } = req.body;
    try {
      const exist = await Teacher.exists({ mobile });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("this mobile number already taken.")
        );
      }
    } catch (error) {
      return next(error);
    }

    try {
      const exist = await Teacher.exists({ email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("this email id already taken.")
        );
      }
    } catch (error) {
      return next(error);
    }

    // than updates
    let document;
    try {
      document = await Teacher.findOneAndUpdate(
        { _id: req.params.id },
        { mobile, email, qualification },
        { new: true }
      );
    } catch (error) {
      return next(error);
    }

    res
      .status(200)
      .json({ status: true, msg: "successfully updates ", data: document });
  },

  //delete teacher
  async deleteTeacher(req, res, next) {
    try {
      const document = await Teacher.findOneAndRemove({ _id: req.params.id });
      if (!document) {
        return next(new Error("teacher not avaible!"));
      }
    } catch (error) {
      return next(error);
    }
    res
      .status(200)
      .json({ status: true, message: "successfully deleted teacher!" });
  },

  //find one teacher
  async findTeacher(req, res, next) {
    const teacher_id = req.query.teacher_id;
    const class_id = req.query.class_id;

    //validation
    const schema = Joi.object({
      teacher_id: Joi.string().length(24),
      class_id: Joi.string().length(24),
    });
    const { error } = schema.validate({ teacher_id, class_id });
    if (error) {
      return next(error);
    }

    let query = {};
    if (teacher_id != null) {
      query = { _id: teacher_id };
    } else if (class_id != null) {
      query = { classes: class_id };
    } else {
      return res.status(400).json({ message: "Invalid input field" });
    }
    let document;
    try {
      document = await Teacher.findOne(query).populate("classes", "name");
    } catch (error) {
      return next(CustomErrorHandler.serverError);
    }
    res
      .status(200)
      .json({ status: true, message: "show a teacher", data: document });
  },

  //find all teacher
  async findAllTeacher(req, res, next) {
    let document;
    try {
      document = await Teacher.find()
        .select("-updatedAt -__v")
        .sort({ _id: 1 });
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res.status(200).json({
      status: true,
      message: "successfully show all teacher!",
      data: document,
    });
  },

  //find one own teacher or students  ************************************
  async findTeacherOrStudents(req, res, next) {
    const teacher_id = req.params.id;
    //validation
    const schema = Joi.object({
      teacher_id: Joi.string().length(24).required(),
    });
    const { error } = schema.validate({ teacher_id });
    if (error) {
      return next(error);
    }

    let output = {};
    let document;
    try {
      document = await Teacher.findOne({ _id: teacher_id }).populate(
        "classes",
        "name"
      );
    } catch (error) {
      return next(CustomErrorHandler.serverError);
    }

    let documentStudents = [];
    if (document.classes != null && document.classes !== undefined) {
      try {
        documentStudents = await Student.find({
          classes: document.classes._id,
        }).populate("classes", "_id name");
      } catch (error) {
        return next(CustomErrorHandler.serverError());
      }
    }
    output = {
      teacher: document,
      student: documentStudents,
    };
    res.status(200).json({
      status: true,
      message: "show a teacher info and assigned class wise students",
      data: output,
    });
  },

  //find do Attence teacher *******************************
  async doAttenceTeacher(req, res, next) {
    const { error } = attendanceValidator.validate(req.body);
    if (error) {
      return next(error);
    }
    const { teacher_id, class_id, attlist } = req.body;
    try {
      const startOfDay = new Date(
        new Date().setUTCHours(0, 0, 0, 0)
      ).toISOString();
      const endOfDay = new Date(
        new Date().setUTCHours(23, 59, 59, 999)
      ).toISOString();

      const exist = await Attendance.findOne({
        $and: [
          {
            teacher: teacher_id,
            classes: class_id,
            createdAt: { $gte: startOfDay, $lt: endOfDay },
          },
        ],
      }).lean();
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist(
            `${exist.createdAt} today already submited attendance.`
          )
        );
      }
    } catch (error) {
      return next(error);
    }

    let arrayStore = [];
    let arrayNotiStore = [];
    attlist.map(async (val) => {  
    arrayStore.push({
        teacher: teacher_id,
        classes: class_id,
        student: val.student_id,
        type: val.att_type,
      });
   
      arrayNotiStore.push({
        teacher: teacher_id,
        classes: class_id,
        student: val.student_id,
        type: val.att_type,
        title:'attendance',
        message:'attendance submited successfully'
      });
    });

    try {
        await Attendance.insertMany(arrayStore);
        await Notification.insertMany(arrayNotiStore);
    } catch (error) {
      return next(error);
    }
    
    res
      .status(201)
      .json({
        status: true,
        message: "attendance submited successfully!",
      });
  },
};

//************************************************* Common Functions ********************************************/
//for Common methods delete
const doOperationDelete = (document, source, next) => {
  let imagePath;
   if (source === "teacher_avatar") {
    imagePath = document.teacher_avatar;
  }else if (source === "teacher_doc_front") {
    imagePath = document.teacher_doc_front;
  }else if (source === "teacher_doc_back") {
    imagePath = document.teacher_doc_back;
  }else if (source === "certificate_doc_front") {
    imagePath = document.certificate_doc_front;
  }else if (source === "certificate_doc_back") {
    imagePath = document.certificate_doc_back;
  }

  //image delete
  fs.unlink(`${appRoot}/${imagePath}`, (err) => {
    if (err) {
      return next(CustomErrorHandler.serverError("file not avaible!"));
    }
  });
};


//for Teacher Common methods
const doOperationTeacherUpdate = async (_id, data, next) => {
  try {
    await Teacher.findOneAndUpdate({ _id }, data);
  } catch (error) {
    return next(error);
  }
};

export default teacherController;
