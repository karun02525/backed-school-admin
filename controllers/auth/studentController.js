import { Student, Attendance, Notification } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import { studentValidator } from "../../validators";
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
  { name: "student_avatar" },
  { name: "parent_avatar" },
  { name: "student_doc_front" },
  { name: "student_doc_back" },
  { name: "parent_doc_front" },
  { name: "parent_doc_back" }
]);

const studentController = {
  //Student register
  async createStudent(req, res, next) {
    const { error } = studentValidator.validate(req.body);
    if (error) {
      return next(error);
    }
    const { mobile, email, parent_doc_id } = req.body;
    try {
      const exist = await Student.exists({ mobile, email, parent_doc_id });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("this student already register.")
        );
      }
    } catch (error) {
      return next(error);
    }

    let result;
    try {
      let saveData = new Student({ ...req.body });
      result = await saveData.save();
    } catch (error) {
      return next(error);
    }
    res.status(201).json({
      status: true,
      message: "successfully create a student and please upload documents.",
      id: result._id,
    });
  },


  //*************************************************** Upload Students & Parents ********************** */   
  async uploadStudentFiles(req, res, next) {
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

        if (key === "student_avatar") {
          doOperationStudentUpdate(
            id,
            { student_avatar: file["student_avatar"][0].path },
            next
          );
        } else if (key === "parent_avatar") {
          doOperationStudentUpdate(
            id,
            { parent_avatar: file["parent_avatar"][0].path },
            next
          );
        } else if (key === "student_doc_front") {
          doOperationStudentUpdate(
            id,
            { student_doc_front: file["student_doc_front"][0].path },
            next
          );
        } else if (key === "student_doc_back") {
          doOperationStudentUpdate(
            id,
            { student_doc_back: file["student_doc_back"][0].path },
            next
          );
        } else if (key === "parent_doc_front") {
          doOperationStudentUpdate(
            id,
            { parent_doc_front: file["parent_doc_front"][0].path },
            next
          );
        } else if (key === "parent_doc_back") {
          doOperationStudentUpdate(
            id,
            { parent_doc_back: file["parent_doc_back"][0].path },
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
  //******************************** Delete Photos ***************************** */
  //deleted uploaded file photos,front doc,back doc vai student,parent
  async deleteStudentUploadedPhoto(req, res, next) {
    const id = req.query.id;
    const source = req.query.source;

    //validation
    const schema = Joi.object({
      id: Joi.string().length(24).required(),
      source: Joi.string().valid("student_avatar", "parent_avatar", "student_doc_front", "student_doc_back", "parent_doc_front", "parent_doc_back").required(),
    });
    const { error } = schema.validate({ id, source });
    if (error) {
      return next(error);
    }

      try {
        const document = await Student.findOneAndUpdate(
          { _id: id },
          { [source]: "" }
        );
        doOperationDelete(document, source, next);
      } catch (error) {
        return next(error);
      }
  
    res.json({
      status: true,
      message: `Student ${source} deleted successfully!`,
    });
  },










  //Student update data
  async updateStudent(req, res, next) {
    //validation
    const teacherUpdateSchema = Joi.object({
      mobile: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/),
    });
    const { error } = teacherUpdateSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { mobile } = req.body;
    try {
      const exist = await Student.exists({ mobile });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("this mobile number already taken.")
        );
      }
    } catch (error) {
      return next(error);
    }

    // than updates
    let document;
    try {
      document = await Student.findOneAndUpdate(
        { _id: req.params.id },
        { mobile },
        { new: true }
      );
    } catch (error) {
      return next(error);
    }

    res.status(200).json({
      status: true,
      message: "successfully update a student",
      data: result,
    });
  },

  //delete Student
  async deleteStudent(req, res, next) {
    try {
      const document = await Student.findOneAndRemove({ _id: req.params.id });
      if (!document) {
        return next(new Error("student not avaible!"));
      }
    } catch (error) {
      return next(error);
    }
    res
      .status(200)
      .json({ status: true, message: "successfully deleted student!" });
  },

  //search  Students
  async searchStudents(req, res, next) {
    const keyword = req.query.keyword;
    const rollno = req.query.rollno;
    let query = {};
    if (rollno) {
      query = { rollno };
    }
    if (keyword) {
      query.$or = [
        { fname: { $regex: keyword, $options: "$i" } },
        { lname: { $regex: keyword, $options: "$i" } },
        { mobile: { $regex: keyword } },
        { email: { $regex: keyword, $options: "$i" } },
        { father_name: { $regex: keyword, $options: "$i" } },
      ];
    }

    let document;
    try {
      document = await Student.find(query)
        .populate("classes", "_id name")
        .limit(10);
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res
      .status(200)
      .json({ status: true, message: "finds success", data: document });
  },

  //find one Student
  async findOneStudent(req, res, next) {
    const id = req.params.id.trim();
    let query = {};
    if (id.length === 24) {
      query = { _id: id };
    } else if (id.length === 10) {
      query = { mobile: id };
    } else {
      return res.status(400).json({ message: "Invalid input field" });
    }

    let document;
    try {
      document = await Student.findOne(query).populate("classes", "name");
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }

    res
      .status(200)
      .json({ status: true, message: "show a student", data: document });
  },

  //find find Students Parent with parent id
  async findStudentsParent(req, res, next) {
    const parent_doc_id = req.query.parent_doc_id;
    const mobile = req.query.mobile;

    let query = {};
    if (parent_doc_id != null && parent_doc_id.length >= 5) {
      query = { parent_doc_id };
    } else if (mobile != null && mobile.length === 10) {
      query = { mobile };
    } else {
      return res.status(400).json({ message: "Invalid input field" });
    }
    let document;
    try {
      document = await Student.find(query).populate("classes", "name");
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }

    res
      .status(200)
      .json({
        status: true,
        message: "show a parent list of students",
        data: document,
      });
  },

  //find all Student
  async findAllStudent(req, res, next) {
    let document;
    try {
      document = await Student.find()
        .populate("classes", "_id name")
        .select("-updatedAt -__v")
        .sort({ _id: 1 });
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res
      .status(200)
      .json({ status: true, message: "showing all student", data: document });
  },

  //find all Attendance Student
  async findAttendance(req, res, next) {
    const teacher_id = req.query.teacher_id;
    const class_id = req.query.class_id;
    const student_id = req.query.student_id;

    //validation
    const schema = Joi.object({
      teacher_id: Joi.string().length(24),
      class_id: Joi.string().length(24),
      student_id: Joi.string().length(24),
    });
    const { error } = schema.validate({ teacher_id, class_id });
    if (error) {
      return next(error);
    }

    let query = {};
    if (teacher_id != null) {
       query = { teacher: teacher_id };
    } else if (class_id != null) {
      query = { classes: class_id };
    }else if (student_id != null) {
      query = { student: student_id };
    }else {
      return res.status(400).json({ message: "Invalid input field" });
    }

    let document;
    try {
      document = await Attendance.find(query)
        .populate("teacher",'fname lname mobile')
        .populate("classes",'name')
        .populate("student",'fname lname rollno father_name')
        .select("-updatedAt -__v");
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res
      .status(200)
      .json({
        status: true,
        message: "showing all attendance",
        data: document,
      });
  },

  //find all Notification by id
  async findNotification(req, res, next) {
    let document;
    try {
      document = await Notification.find({ student:req.params.id })
      .populate("teacher",'fname lname mobile')
      .populate("classes",'name')
      .populate("student",'fname lname rollno father_name')
      .select("-updatedAt -__v");

    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    res
      .status(200)
      .json({
        status: true,
        message: "showing all notification",
        data: document,
      });
  },
};


//for Student  Common methods
const doOperationStudentUpdate = async (_id, data, next) => {
  try {
    await Student.findOneAndUpdate({ _id }, data);
  } catch (error) {
    return next(error);
  }
};

//for Common methods delete
const doOperationDelete = (document, source, next) => {
  let imagePath;
  if (source === "student_avatar") {
    imagePath = document.student_avatar;
  }else if (source === "parent_avatar") {
    imagePath = document.parent_avatar;
  }else if (source === "student_doc_front") {
    imagePath = document.student_doc_front;
  }else if (source === "student_doc_back") {
    imagePath = document.student_doc_back;
  }else if (source === "parent_doc_front") {
    imagePath = document.parent_doc_front;
  }else if (source === "parent_doc_back") {
    imagePath = document.parent_doc_back;
  }
  //image delete
  fs.unlink(`${appRoot}/${imagePath}`, (err) => {
    if (err) {
      return next(CustomErrorHandler.serverError("file not avaible!"));
    }
  });
};

export default studentController;
