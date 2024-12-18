import React from 'react'

const OrgCard = ({ image_url, name, image_background_color }) => {
    return (
        <a href={name} target='_blank'>
            <div className='w-60 h-72 overflow-hidden p-8 border rounded-md hover:shadow-xl flex flex-col justify-evenly items-center hover:bg-gray-50 transition-all relative'>
                <div className='w-40 h-40 relative'>
                    <div className='w-full h-full' style={{ backgroundColor: image_background_color }}>
                        <img src={image_url} alt={name} className='w-full h-full object-contain object-center' />
                    </div>
                </div>
                <h3 className='text-gray-600 text-lg font-galano text-center'>{name}</h3>
            </div>
        </a>
    )
}

export default OrgCard