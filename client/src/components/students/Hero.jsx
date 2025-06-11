import React from 'react'
import { assets } from '../../assets/assets'
import Searchbar from './Searchbar'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70 dark:from-gray-900 transition-colors duration-300'>
      <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 dark:text-gray-100 max-w-3xl mx-auto'>
        Advance your career and learning goals with expertly{" "}
        <span className='text-blue-600 dark:text-blue-500'>designed & crafted for success</span>
        <img
          src={assets.sketch}
          alt="sketch"
          className='md:block hidden absolute -bottom-7 right-0 dark:invert'
        />
      </h1>

      {/* Desktop subtitle */}
      <p className='md:block hidden text-gray-500 dark:text-gray-400 max-w-2xl mx-auto'>
        We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.
      </p>

      {/* Mobile subtitle */}
      <p className='md:hidden text-gray-500 dark:text-gray-400 max-w-sm mx-auto'>
        We bring together world-class instructors to help you achieve your professional goals.
      </p>

      <Searchbar />
    </div>
  )
}

export default Hero
