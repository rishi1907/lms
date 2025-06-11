import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [path, navigate]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-800 dark:text-white'>
      {/* Spinner */}
      <div className='relative w-16 h-16 sm:w-20 sm:h-20 mb-6'>
        <div className='absolute inset-0 rounded-full border-4 border-gray-300 dark:border-gray-600'></div>
        <div className='absolute inset-0 rounded-full border-t-4 border-t-blue-500 animate-spin'></div>
      </div>

      {/* Loading Text */}
      <p className='text-lg font-medium flex items-center gap-1'>
        Gearing up the magic 🪄 Hang on...
        <span className='animate-bounce delay-100'>.</span>
        <span className='animate-bounce delay-300'>.</span>
        <span className='animate-bounce delay-500'>.</span>
      </p>
    </div>
  );
};

export default Loading;
