import express from 'express'
import { addCourse, educatorDashboard, getEducatorCourses, getEnrolledStudents, updateRoleToEducator } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router()

// Add educator role
educatorRouter.get('/update-role', updateRoleToEducator)
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse)
educatorRouter.get('/courses', protectEducator, getEducatorCourses) 
educatorRouter.get('/dashboard', protectEducator, educatorDashboard) 
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudents)


export default educatorRouter;
