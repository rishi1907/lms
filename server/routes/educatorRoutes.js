import express from 'express';
import {
  addCourse,
  educatorDashboard,
  getEducatorCourses,
  getEnrolledStudents,
  updateRoleToEducator,
  deleteCourse,
  updateCourse,
  getSingleCourse
} from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router();

educatorRouter.get('/update-role', updateRoleToEducator);
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse);
educatorRouter.get('/courses', protectEducator, getEducatorCourses);
educatorRouter.get('/dashboard', protectEducator, educatorDashboard);
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudents);
educatorRouter.delete('/course/:id', protectEducator, deleteCourse);
educatorRouter.put('/course/:id', upload.single('image'), protectEducator, updateCourse);
educatorRouter.get('/course/:id', protectEducator, getSingleCourse);


export default educatorRouter;
