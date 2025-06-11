import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/Appcontext';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Footer from '../../components/students/Footer';
import Rating from '../../components/students/Rating';
import { toast } from 'react-toastify';
import Loading from '../../components/students/Loaading';
import axios from 'axios';

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    getToken,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        course.courseRatings.forEach((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating);
          }
        });
      }
    });
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) getCourseData();
  }, [enrolledCourses]);

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + '/api/user/update-course-progress',
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + '/api/user/get-course-progress',
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) setProgressData(data.progressData);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + '/api/user/add-ratings',
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getCourseProgress();
  }, []);

  return courseData ? (
    <>
      <div className='p-4 sm:p-6 md:px-36 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-6'>
        {/* Left column */}
        <div className='text-gray-800'>
          <h2 className='text-lg sm:text-xl font-semibold'>Course Structure</h2>

          <div className='pt-4 space-y-2'>
            {courseData?.courseContent?.map((chapter, index) => (
              <div key={index} className='border border-gray-300 bg-white rounded shadow-sm'>
                <div
                  className='flex items-center justify-between px-4 py-3 cursor-pointer'
                  onClick={() => toggleSection(index)}
                >
                  <div className='flex items-center gap-2'>
                    <img
                      src={assets.down_arrow_icon}
                      className={`w-4 transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                      alt='arrow'
                    />
                    <p className='font-medium text-sm sm:text-base'>
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className='text-xs sm:text-sm'>
                    {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                  </p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                  <ul className='border-t border-gray-300 text-sm text-gray-700 p-2 space-y-1 max-h-96 overflow-y-auto'>
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className='flex justify-between items-center gap-3'>
                        <div className='flex items-start gap-2'>
                          <img
                            src={progressData?.lectureCompleted?.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon}
                            alt='icon'
                            className='w-4 mt-1'
                          />
                          <p>{lecture.lectureTitle}</p>
                        </div>
                        <div className='flex gap-3 text-xs sm:text-sm'>
                          {lecture.lectureUrl && (
                            <button
                              onClick={() =>
                                setPlayerData({
                                  ...lecture,
                                  chapter: index + 1,
                                  lecture: i + 1,
                                })
                              }
                              className='text-blue-600 hover:underline'
                            >
                              Watch
                            </button>
                          )}
                          <p>
                            {humanizeDuration(lecture.lectureDuration * 60000, { units: ['h', 'm'], round: true })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className='flex items-center gap-2 mt-6'>
            <h1 className='text-lg font-semibold'>Rate this Course:</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        {/* Right column */}
        <div>
          {playerData?.lectureUrl ? (
            <div>
              <YouTube
                videoId={playerData.lectureUrl.split('/').pop()}
                iframeClassName='w-full aspect-video rounded-lg'
              />
              <div className='flex justify-between items-center mt-2 text-sm sm:text-base'>
                <p className='font-medium'>
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>
                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  disabled={progressData?.lectureCompleted?.includes(playerData.lectureId)}
                  className={`
                    px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300
                    ${
                      progressData?.lectureCompleted?.includes(playerData.lectureId)
                        ? 'bg-green-100 text-green-700 cursor-not-allowed shadow-sm shadow-green-200'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:brightness-105 shadow-md shadow-cyan-300/40'
                    }
                  `}
                >
                  {progressData?.lectureCompleted?.includes(playerData.lectureId)
                    ? 'Completed'
                    : 'Mark Complete'}
                </button>
              </div>
            </div>
          ) : (
            <img
              src={courseData.courseThumbnail || assets.placeholder}
              alt='Course'
              className='w-full rounded-lg'
            />
          )}
        </div>
      </div>

      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Player;
