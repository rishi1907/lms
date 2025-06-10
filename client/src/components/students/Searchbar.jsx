import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Searchbar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : '');

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate('/course-list/' + input);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-xl w-full md:h-full h-12 flex items-center bg-white border border-gray-500/20 rounded"
    >
      <img src={assets.search_icon} alt="search icon" className="md:w-auto w-10 px-3" />
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search for courses"
        className="w-full h-full outline-none text-gray-500/80"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-blue-700 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1 shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
      >
        Search
      </button>
    </form>
  );
};

export default Searchbar;
