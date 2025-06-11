import React, { useContext } from 'react';
import { AppContext } from '../../context/Appcontext';
import { NavLink } from 'react-router-dom';
import { assets } from "../../assets/assets";

const Sidebar = ({ closeSidebar }) => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/students-enrolled', icon: assets.person_tick_icon },
  ];

  return isEducator && (
    <div className='w-64 bg-white shadow-lg min-h-screen text-base border-r border-gray-300 flex flex-col'>
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          onClick={closeSidebar}
          end={item.path === '/educator'}
          className={({ isActive }) => `
            flex items-center px-6 py-3 gap-3
            ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90' : 'hover:bg-gray-100 border-r-[6px] border-white'}
          `}
        >
          <img src={item.icon} alt={item.name} className='w-6 h-6' />
          <p className='block'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
