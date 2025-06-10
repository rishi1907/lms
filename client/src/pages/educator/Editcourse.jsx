import React, { useEffect, useRef, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/Appcontext';
import uniqid from 'uniqid';
import Quill from 'quill';
import axios from 'axios';
import { toast } from 'react-toastify';

const Editcourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  const fetchCourse = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        const course = data.course;
        setCourseTitle(course.courseTitle);
        setCoursePrice(course.coursePrice);
        setDiscount(course.discount);
        setChapters(course.courseContent || []);
        if (quillRef.current) {
          quillRef.current.root.innerHTML = course.courseDescription;
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load course.");
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      fetchCourse();
    }
  }, [quillRef.current]);

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters(prev => [...prev, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(prev => prev.filter(c => c.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(prev =>
        prev.map(c =>
          c.chapterId === chapterId ? { ...c, collapsed: !c.collapsed } : c
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(prev =>
        prev.map(c =>
          c.chapterId === chapterId
            ? { ...c, chapterContent: c.chapterContent.filter((_, i) => i !== lectureIndex) }
            : c
        )
      );
    }
  };

  const addLecture = () => {
    setChapters(prev =>
      prev.map(c => {
        if (c.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: c.chapterContent.length > 0
              ? c.chapterContent.slice(-1)[0].lectureOrder + 1
              : 1,
            lectureId: uniqid(),
          };
          return {
            ...c,
            chapterContent: [...c.chapterContent, newLecture]
          };
        }
        return c;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append('courseData', JSON.stringify(updatedData));
      if (image) formData.append('image', image);

      const token = await getToken();
      const { data } = await axios.put(`${backendUrl}/api/educator/course/${courseId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Course updated!");
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Course</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">

        <input
          type="text"
          placeholder="Course Title"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={coursePrice}
          onChange={(e) => setCoursePrice(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="p-2"
        />

        <div ref={editorRef} className="h-40 border rounded p-2" />

        <div className="my-4">
          <h3 className="font-semibold text-lg mb-2">Chapters</h3>
          <button type="button" onClick={() => handleChapter('add')} className="bg-green-500 text-white px-4 py-1 rounded mb-2">+ Add Chapter</button>
          {chapters.map((chapter, cIndex) => (
            <div key={chapter.chapterId} className="border p-2 mb-2 rounded">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">{chapter.chapterTitle}</h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full text-sm"
                  >
                    Toggle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChapter('remove', chapter.chapterId)}
                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-full text-sm"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLecture('add', chapter.chapterId)}
                    className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-full text-sm"
                  >
                    + Lecture
                  </button>
                </div>
              </div>
              {!chapter.collapsed && (
                <ul className="ml-4 mt-2">
                  {chapter.chapterContent.map((lecture, lIndex) => (
                    <li key={lecture.lectureId} className="flex justify-between items-center py-1">
                      <span>{lecture.lectureTitle} ({lecture.lectureDuration})</span>
                      <button type="button" onClick={() => handleLecture('remove', chapter.chapterId, lIndex)}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="bg-black text-white px-6 py-2 rounded">Update</button>
      </form>

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-4">Add Lecture</h3>
            <input
              type="text"
              placeholder="Lecture Title"
              value={lectureDetails.lectureTitle}
              onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
              className="p-2 border rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Duration"
              value={lectureDetails.lectureDuration}
              onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
              className="p-2 border rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Video URL"
              value={lectureDetails.lectureUrl}
              onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
              className="p-2 border rounded mb-2 w-full"
            />
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={lectureDetails.isPreviewFree}
                onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
              />
              Free Preview
            </label>
            <div className="flex justify-between">
              <button type="button" onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button type="button" onClick={addLecture} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editcourse;
