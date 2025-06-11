import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/educator/Navbar';
import Sidebar from '../../components/educator/Sidebar';
import Footer from '../../components/educator/Footer';

const Educator = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      <div className='flex relative'>
        {/* Sidebar */}
        <div className={`fixed md:relative z-30 transition-transform duration-300 
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <Sidebar closeSidebar={() => setSidebarOpen(false)} />
        </div>

        {/* Overlay on small screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-30 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className='flex-1 md:ml-0 ml-0 z-10'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Educator;
