import { clerkClient } from '@clerk/express';
import Course from '../models/Course.js';
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';

export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: 'educator' },
    });
    res.json({ success: true, message: "You can publish your courses now" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) return res.json({ success: false, message: 'Thumbnail Not Attached' });

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.json({ success: true, message: 'Course Added Successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const educatorDashboard = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map(c => c._id);

    const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' })
      .populate('userId', 'name imageUrl')
      .populate('courseId', 'courseTitle');

    const totalEarnings = Math.round(purchases.reduce((sum, p) => sum + p.amount, 0) * 100) / 100;
    const enrolledStudentsData = purchases.map(p => ({
      student: p.userId,
      courseTitle: p.courseId.courseTitle,
      purchaseDate: p.createdAt,
    }));

    res.json({ success: true, dashboardData: { totalCourses, totalEarnings, enrolledStudentsData } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getEnrolledStudents = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map(c => c._id);

    const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' })
      .populate('userId', 'name imageUrl')
      .populate('courseId', 'courseTitle');

    const enrolledStudents = purchases.map(p => ({
      student: p.userId,
      courseTitle: p.courseId.courseTitle,
      purchaseDate: p.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const educator = req.auth.userId;

    const course = await Course.findById(id);
    if (!course) return res.json({ success: false, message: 'Course not found' });
    if (course.educator.toString() !== educator) return res.json({ success: false, message: 'Unauthorized' });

    await Course.findByIdAndDelete(id);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getSingleCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const educator = req.auth.userId;

    const course = await Course.findById(id);
    if (!course) return res.json({ success: false, message: 'Course not found' });

    if (course.educator.toString() !== educator) {
      return res.json({ success: false, message: 'Unauthorized access' });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const educator = req.auth.userId;
    const { courseData } = req.body;
    const imageFile = req.file;

    const course = await Course.findById(id);
    if (!course) return res.json({ success: false, message: 'Course not found' });
    if (course.educator.toString() !== educator) return res.json({ success: false, message: 'Unauthorized' });

    const parsedData = JSON.parse(courseData);
    if (imageFile) {
      const uploaded = await cloudinary.uploader.upload(imageFile.path);
      parsedData.courseThumbnail = uploaded.secure_url;
    }

    await Course.findByIdAndUpdate(id, parsedData);
    res.json({ success: true, message: 'Course updated successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};