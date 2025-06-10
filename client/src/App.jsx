import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/students/Home';
import CourseList from './pages/students/CoursesList';
import Coursedetail from './pages/students/Coursedetail';
import Myenrollments from './pages/students/Myenrollments';
import Player from './pages/students/Player';
import Loading from './components/students/Loaading';
import Educator from './pages/educator/Educator';
import Dashboard from './pages/educator/Dashboard';
import Addcourse from './pages/educator/Addcourse';
import Mycourses from './pages/educator/Mycourses';
import Studentsenrolled from './pages/educator/Studentsenrolled';
import Navbar from './components/students/Navbar';
import "quill/dist/quill.snow.css";
import { ToastContainer } from 'react-toastify';
import Editcourse from './pages/educator/Editcourse';

const App = () => {
  const iseducatorRoute = useMatch('/educator/*')

  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer />
      {!iseducatorRoute && <Navbar />}
      <Routes>
        {/* Student routes */}
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CourseList />} />
        <Route path='/course-list/:input' element={<CourseList />} />
        <Route path='/course/:id' element={<Coursedetail />} />
        <Route path='/my-enrollments' element={<Myenrollments />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/loading/:path' element={<Loading />} />

        {/* Educator nested routes */}
        <Route path='/educator' element={<Educator />}>
          <Route index element={<Dashboard />} />
          <Route path='add-course' element={<Addcourse />} />
          <Route path='edit-course/:courseId' element={<Editcourse />} />
          <Route path='my-courses' element={<Mycourses />} />
          <Route path='students-enrolled' element={<Studentsenrolled />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;
