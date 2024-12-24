import React from 'react'
import { pluralized } from '../utils/utils'

const OrgCard = ({ image_url, name, image_background_color, reviewCount, avgRating }) => {
    return (
        <a href={name} target='_blank'>
            <div className='w-60 h-80 overflow-hidden p-8 border rounded-md hover:shadow-xl flex flex-col justify-evenly items-center hover:bg-gray-50 transition-all relative'>
                <div className='w-40 h-40 relative'>
                    <div className='w-full h-full' style={{ backgroundColor: image_background_color }}>
                        <img src={image_url} alt={name} className='w-full h-full object-contain object-center' />
                    </div>
                </div>
                <h3 className='text-gray-600 text-lg font-galano text-center'>{name}</h3>
                <div className='text-orange-500 font-bold flex items-center gap-1'> {parseFloat(avgRating.toFixed(2))} <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="w-6 h-6 fill-orange-500 inline-block"
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg></div>
                <div className='text-gray-500'>
                    ( {reviewCount} review{pluralized(reviewCount)} )
                </div>
            </div>
        </a>
    )
}

export default OrgCard