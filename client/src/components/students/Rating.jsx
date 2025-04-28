import React, { useEffect, useState } from 'react'

const Rating = ({initialRating, onRate}) => {

  const [rating , SetRating] = useState(initialRating || 0)

  const handleRating = (value) =>{
    SetRating(value);
    if (onRate) onRate(value)
  }

  useEffect(()=>{
    if(initialRating){
      SetRating(initialRating)
    }
  },[initialRating])

  return (
    <div>
      {Array.from({length:5}, (_, index)=>{
        const starValue = index + 1;
        return (
          <span key={index} onClick={()=>handleRating(starValue)} className={`text-xl sm:text-2xl cursor-pointer transition-colors ${starValue <= rating ? 'text-yellow-500' : 'text-gray-400'}`}>
            &#9733;
          </span>
        )
      })}
    </div>
  )
}

export default Rating
