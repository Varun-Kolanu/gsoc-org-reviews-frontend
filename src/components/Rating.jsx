import React, { useState } from 'react';
import Star from './Star';  // Import the Star component

const StarRating = ({ rating, setRating }) => {
    const totalStars = 5;

    const handleMouseEnter = (index) => {
        setRating(index + 1);
    };

    return (
        <div className="flex flex-col">
            <p className="mb-2">Rating: {rating}</p>
            <div className='flex -ml-1 mb-3'>
                {Array.from({ length: totalStars }, (_, index) => (
                    <Star
                        key={index}
                        filled={index < rating}
                        onMouseEnter={() => handleMouseEnter(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default StarRating;
