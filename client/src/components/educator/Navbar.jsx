import React from 'react';
import { assets, dummyEducatorData } from '../../assets/assets';
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useUser();

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <div className='flex items-center gap-4'>
        {/* Hamburger */}
        <button className="md:hidden" onClick={toggleSidebar}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <Link to='/'>
          <img src={assets.logo} alt="Logo" className='w-28 lg:w-32' />
        </Link>
      </div>
      <div className='flex items-center gap-5 text-gray-500'>
        <p className='hidden md:block'>Hi! {user ? user.fullName : 'Developer'}</p>
        {user ? <UserButton /> : <img className='w-8 h-8' src={assets.profile_img} alt="Profile" />}
      </div>
    </div>
  );
};

export default Navbar;
