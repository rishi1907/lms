import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/Appcontext';
import Searchbar from '../../components/students/searchbar';
import { useParams } from 'react-router-dom';
import Coursecard from '../../components/students/coursecard';
import { assets } from '../../assets/assets';
import Footer from '../../components/students/footer';

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (Array.isArray(allCourses) && allCourses.length > 0) {
      const tempCourses = allCourses.slice();

      setFilteredCourses(
        input
          ? tempCourses.filter(course =>
            course.courseTitle.toLowerCase().includes(input.toLowerCase())
          )
          : tempCourses
      );
    }
  }, [allCourses, input]);

  return (
    <>
      <div className='relative md:px-36 px-8 pt-10 text-left'>
        {/* Header Section */}
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
          <div>
            <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
            <p className='text-gray-500'>
              <span className='text-blue-600 cursor-pointer' onClick={() => navigate?.('/')}>
                Home
              </span>{' '}
              / <span>Course List</span>
            </p>
          </div>
          <Searchbar data={input} />
        </div>

        {
          input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 mb-8 text-gray-600'>
            <p>{input}</p>
            <img src={assets.cross_icon} alt="" className='cursor-pointer' onClick={() => navigate('/course-list')} />
          </div>
        }

        {/* Course List */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0'>
          {filteredCourses.map(course => (
            <Coursecard key={course.id || course.courseTitle} course={course} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;
