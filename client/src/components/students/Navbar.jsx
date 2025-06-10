import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { AppContext } from '../../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext);

  const isCourseListPage = location.pathname.includes('/course-list');
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator');
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div
        className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-4 border-b ${
          isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'
        }`}
      >
        {/* Logo (Home button) */}
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="Logo"
          className="w-28 lg:w-32 cursor-pointer transition-transform duration-300 hover:scale-105"
        />

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center gap-5 text-gray-700">
          {user && (
            <div className="flex items-center gap-3">
              <button
                onClick={becomeEducator}
                className="px-3 py-1.5 rounded-lg hover:bg-blue-100 transition duration-200"
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>

              <span>|</span>

              <Link
                to="/my-enrollments"
                className="px-3 py-1.5 rounded-lg hover:bg-blue-100 transition duration-200"
              >
                My Enrollments
              </Link>
            </div>
          )}

          {user ? (
            <UserButton />
          ) : (
            <button
              onClick={() => openSignIn()}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition duration-300"
            >
              Log In | Sign Up
            </button>
          )}
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center gap-2 text-gray-700">
          {user && (
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={becomeEducator}
                className="px-2 py-1 rounded-md hover:bg-blue-100 transition duration-200"
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>

              <span>|</span>

              <Link
                to="/my-enrollments"
                className="px-2 py-1 rounded-md hover:bg-blue-100 transition duration-200"
              >
                My Enrollments
              </Link>
            </div>
          )}

          {user ? (
            <UserButton />
          ) : (
            <button
              onClick={() => openSignIn()}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-1.5 rounded-full shadow-md hover:shadow-lg transition duration-300"
            >
              <img src={assets.user_icon} alt="user" className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
