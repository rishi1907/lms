import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/Appcontext';
import Loading from '../../components/students/Loaading';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Mycourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const navigate = useNavigate();

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const token = await getToken();
      const { data } = await axios.delete(`${backendUrl}/api/educator/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success("Course deleted successfully");
        fetchEducatorCourses(); // Refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, []);

  return courses ? (
    <div className='min-h-screen flex flex-col md:p-8 p-4 pt-8'>
      <h2 className='pb-4 text-lg font-medium'>My Courses</h2>

      {/* Mobile View */}
      <div className="flex flex-col gap-4 md:hidden">
        {courses.map(course => (
          <div key={course._id} className="border rounded-md p-4 bg-white shadow-sm">
            <div className="flex gap-4 items-start">
              <img src={course.courseThumbnail} alt="Course" className="w-20 h-16 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold text-base text-gray-900">{course.courseTitle}</h3>
                <p className="text-sm text-gray-600 mt-1">Published: {new Date(course.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Students: {course.enrolledStudents?.length || 0}</p>
                <p className="text-sm text-gray-600">
                  Earnings: {currency}
                  {Math.floor((course.enrolledStudents?.length || 0) * (course.coursePrice - (course.discount * course.coursePrice / 100)))}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => navigate(`/educator/edit-course/${course._id}`)}
                className="bg-blue-100 text-blue-700 border border-blue-500 px-3 py-1 rounded-md text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(course._id)}
                className="bg-red-100 text-red-700 border border-red-500 px-3 py-1 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className='flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
          <table className='w-full'>
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">All Courses</th>
                <th className="px-4 py-3 font-semibold">Earnings</th>
                <th className="px-4 py-3 font-semibold">Students</th>
                <th className="px-4 py-3 font-semibold">Published On</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-500/20">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={course.courseThumbnail}
                      alt="Course"
                      className="w-16 h-12 object-cover rounded"
                    />
                    <span>{course.courseTitle}</span>
                  </td>
                  <td className="px-4 py-3">
                    {currency}
                    {Math.floor(
                      (course.enrolledStudents?.length || 0) *
                      (course.coursePrice - (course.discount * course.coursePrice / 100))
                    )}
                  </td>
                  <td className="px-4 py-3">{course.enrolledStudents?.length || 0}</td>
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/educator/edit-course/${course._id}`)}
                      className="bg-blue-100 text-blue-700 border border-blue-500 px-3 py-1 rounded-md hover:bg-blue-200 transition duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="bg-red-100 text-red-700 border border-red-500 px-3 py-1 rounded-md hover:bg-red-200 transition duration-150"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />;
};

export default Mycourses;
