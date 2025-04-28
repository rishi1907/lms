import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/Appcontext";
import Coursecard from "./coursecard";

const CoursesSection = () => {
    const { allCourses } = useContext(AppContext);

    return (
        <div className="py-16 md:px-40 px-8">
            <h2 className="text-3xl font-medium text-gray-800">Learn from the best</h2>
            <p className="text-sm md:text-base text-gray-500 mt-3">
                Discover our top-rated courses across various categories. From coding and design <br/>to business and wellness, our courses are crafted to deliver results.
            </p>

            <div className='grid grid-cols-auto px-4 md:px-0 md:my-3 my-4 gap-4'>
                {allCourses.slice(0, 4).map((course, index) => (
                    <Coursecard key={index} course={course} />
                ))}
            </div>

            <Link 
                to={"./course-list"} 
                onClick={() => window.scrollTo(0, 0)}
                className="text-gray-500 border border-gray-500/30 px-6 py-3 rounded mt-5 inline-block"
            >
                Show all courses
            </Link>
        </div>
    );
};

export default CoursesSection;
