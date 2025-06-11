import React from 'react';
import { assets } from '../../assets/assets';

const Calltoaction = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
      <h1 className='text-xl md:text-4xl text-gray-800 font-semibold text-center'>
        Learn anything, anytime, anywhere
      </h1>
      <p className='text-gray-500 text-center max-w-xl text-sm sm:text-base'>
        Incidents are felt, bringing desire. Dedicated to the mind, life moves forward, allowing excellence, except comfort is given.
      </p>

      <div className='flex items-center font-medium gap-6 mt-4 flex-wrap justify-center'>
        <button
          onClick={scrollToTop}
          className='
            px-8 py-3 rounded-full text-white 
            bg-gradient-to-r from-blue-500 to-cyan-500 
            shadow-lg shadow-cyan-200/40
            hover:scale-105 transition-all duration-300
          '
        >
          Get Started
        </button>

        <button
          className='
            flex items-center gap-2 text-blue-600 hover:text-blue-800 
            hover:translate-x-1 transition-all duration-300
          '
        >
          Learn more
          <img src={assets.arrow_icon} alt='arrow-icon' className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
};

export default Calltoaction;
