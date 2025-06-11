import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/Appcontext'
import Loading from '../../components/students/Loaading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/students/Footer'
import YouTube from 'react-youtube'
import axios from 'axios'
import { toast } from 'react-toastify'

const Coursedetail = () => {
  const { id } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)

  const { allCourses, calculateRating, calculateChapterTime, calculateCourseDuration,
    calculateNoOfLectures, currency, backendUrl, userData, getToken } = useContext(AppContext)

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData) return toast.warn("Login to Enroll");
      if (isAlreadyEnrolled) return toast.warn("Already enrolled");
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.data?.message === "Already enrolled in this course") {
        setIsAlreadyEnrolled(true);
        return toast.warn("You are already enrolled in this course");
      }
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => { fetchCourseData() }, [])
  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  }, [userData, courseData])

  const toggleSection = (index) => {
    setOpenSections(prev => ({ ...prev, [index]: !prev[index] }))
  };

  return courseData ? (
    <>
      <div className='flex flex-col-reverse lg:flex-row gap-10 relative items-start justify-between lg:px-36 px-4 pt-20 text-left'>
        <div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70'></div>

        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800'>{courseData.courseTitle}</h1>
          <p className='pt-4 text-sm sm:text-base' dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}></p>

          <div className='flex flex-wrap gap-2 items-center text-sm pt-3 pb-1'>
            <p>{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (
                <img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt='' className='w-4 h-4' />
              ))}
            </div>
            <p className='text-blue-600'>({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})</p>
            <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}</p>
          </div>
          <p className='text-sm'>Course by <span className='text-blue-600 underline'>{courseData.educator.name}</span></p>

          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>
            <div className='pt-5'>
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                  <div className='flex justify-between items-center px-4 py-3 cursor-pointer' onClick={() => toggleSection(index)}>
                    <div className='flex gap-2 items-center'>
                      <img className={`transform ${openSections[index] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrow" />
                      <p className='font-medium text-sm sm:text-base'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-xs sm:text-sm'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className='list-disc px-4 py-2 text-sm text-gray-600 border-t'>
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className='flex justify-between gap-2 py-1'>
                          <span className='flex items-center gap-1'>
                            <img src={assets.play_icon} alt="play" className='w-4 h-4' />
                            {lecture.lectureTitle}
                          </span>
                          <span className='flex gap-2 text-xs'>
                            {lecture.isPreviewFree && <p onClick={() => setPlayerData({ videoId: lecture.lectureUrl.split('/').pop() })} className='text-blue-500 cursor-pointer'>Preview</p>}
                            <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}</p>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='py-10 text-sm'>
            <h3 className='text-lg font-semibold text-gray-800'>Course Description</h3>
            <p className='pt-3 rich-text' dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}></p>
          </div>
        </div>

        <div className='w-full sm:max-w-sm md:max-w-md lg:max-w-course-card z-10 shadow-custom-card rounded overflow-hidden bg-white'>
          {playerData ? <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName='w-full aspect-video' /> : <img src={courseData.courseThumbnail} alt="" />}

          <div className='p-5'>
            <div className='flex gap-2 items-center'>
              <img className='w-4' src={assets.time_left_clock_icon} alt="time left" />
              <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price!</p>
            </div>

            <div className='flex gap-3 items-center pt-3'>
              <p className='text-gray-800 text-2xl md:text-3xl font-semibold'>{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
              <p className='line-through text-gray-500'>{currency}{courseData.coursePrice}</p>
              <p className='text-gray-500'>{courseData.discount}% off</p>
            </div>

            <div className='flex flex-wrap gap-3 text-sm pt-2 text-gray-500'>
              <div className='flex gap-1 items-center'>
                <img src={assets.star} alt="star" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className='h-4 w-px bg-gray-400/40'></div>
              <div className='flex gap-1 items-center'>
                <img src={assets.time_clock_icon} alt="time" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className='h-4 w-px bg-gray-400/40'></div>
              <div className='flex gap-1 items-center'>
                <img src={assets.lesson_icon} alt="lessons" />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>

            <button onClick={enrollCourse} className='mt-5 w-full py-3 rounded bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md transition-transform transform hover:scale-105'>
              {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>

            <div className='pt-6'>
              <p className='text-lg font-medium text-gray-800'>What's in the course</p>
              <ul className='list-disc pl-5 pt-2 text-sm text-gray-500'>
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
}

export default Coursedetail;