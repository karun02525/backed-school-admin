import express from "express";

import {teacherController,classController,studentController,adminController} from '../controllers'

const router = express.Router();


router.post('/class',classController.createClass)
router.delete('/class/:id',classController.deleteClass)
router.get('/class',classController.findAllClass)


router.post('/student',studentController.createStudent)
router.put('/student/:id',studentController.updateStudent)
router.delete('/student/:id',studentController.deleteStudent)
router.get('/student/:id',studentController.findOneStudent)
router.get('/student',studentController.findAllStudent)
router.get('/search-students',studentController.searchStudents)


router.post('/upload-student-file',studentController.uploadStudentFiles)
router.delete('/upload-student-file',studentController.deleteStudentUploadedPhoto)


router.post('/upload-teacher-file',teacherController.uploadTeacherFiles)
router.delete('/upload-teacher-file',teacherController.deleteTeacherUploadedPhoto)



router.post('/teacher',teacherController.createTeacher)
router.put('/teacher/:id',teacherController.updateTeacher)
router.delete('/teacher/:id',teacherController.deleteTeacher)
router.get('/teacher',teacherController.findTeacher)
router.get('/teachers',teacherController.findAllTeacher)




router.put('/assign-rollno',adminController.assignRollno)
router.get('/assign-rollno',adminController.findAllAssignRollno)
router.get('/search-students',adminController.findAllStudentsByClassId)


router.put('/assign-teacher/:id',adminController.assignUpdateTeacher)
router.delete('/assign-teacher/:id',adminController.deleteAssignClassTeacher)
router.get('/assign-teacher',adminController.findAssignTeacher)
router.get('/find-assign-teacher',adminController.findAssignTeacherClassId)




export default router;