import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { AppContext } from '../../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const location = useLocation();

  const isCourseListPage = location.pathname.includes('/course-list');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const becomeEducator = async () => {
  try {
    if (isEducator) {
      navigate('/educator');
      setDrawerOpen(false);
      return;
    }

    const confirmed = window.confirm('Do you want to become an Educator? You will be able to publish courses.');
    if (!confirmed) return;

    const token = await getToken();
    const { data } = await axios.get(`${backendUrl}/api/educator/update-role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data.success) {
      setIsEducator(true);
      toast.success('Congratulations! You are now an educator. You can publish courses now.');
    } else {
      toast.error(data.message);
    }

    setDrawerOpen(false);
  } catch (error) {
    toast.error(error.message);
  }
};


  // Close drawer on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      {/* Top Navbar */}
      <div
        className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-4 border-b ${
          isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'
        }`}
      >
        {/* Logo */}
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="Logo"
          className="w-28 lg:w-32 cursor-pointer transition-transform duration-300 hover:scale-105"
        />

        {/* Desktop Menu */}
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

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-2 text-gray-700">
          {user && (
            <button onClick={() => setDrawerOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
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

      {/* Drawer Overlay & Panel */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Blurred dark overlay */}
          <div
            className="w-1/2 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          ></div>

          {/* Drawer panel */}
          <div className="w-1/2 bg-white p-5 flex flex-col gap-4 shadow-lg">
            <button
              onClick={becomeEducator}
              className="text-left px-4 py-2 bg-blue-50 rounded-md hover:bg-blue-100 transition"
            >
              {isEducator ? 'Educator Dashboard' : 'Become Educator'}
            </button>
            <Link
              to="/my-enrollments"
              onClick={() => setDrawerOpen(false)}
              className="text-left px-4 py-2 bg-blue-50 rounded-md hover:bg-blue-100 transition"
            >
              My Enrollments
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
