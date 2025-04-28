import React from 'react'
import Hero from '../../components/students/hero'
import Companies from '../../components/students/companies'
import CoursesSection from '../../components/students/coursesSection'
import TestimonialsSection from '../../components/students/TestimonialsSections'
import Calltoaction from '../../components/students/calltoaction'
import Footer from '../../components/students/footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero/>
      <Companies/>
      <CoursesSection/>
      <TestimonialsSection/>
      <Calltoaction/>
      <Footer/>
    </div>
  )
}

export default Home
