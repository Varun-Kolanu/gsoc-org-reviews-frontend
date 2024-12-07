// import React from 'react';

// const Star = ({ starIndex, hoverIndex, setHoverIndex }) => {
//     return (
//         <span onMouseEnter={() => setHoverIndex(starIndex)} onMouseLeave={setHoverIndex(0)}>
//             {
//                 starIndex <= hoverIndex ?
//                     <img src={`/star_orange.svg`} alt="*" className='w-6' /> :
//                     <img src={`/star_gray.svg`} alt="*" className='w-6' />
//             }
//         </span>
//     );
// };

// export default Star;





import React from 'react';

const Star = ({ filled, onMouseEnter }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className={`w-6 h-6 cursor-pointer ${filled ? 'fill-orange-500' : 'fill-gray-300'}`}
            onMouseEnter={onMouseEnter}
        >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    );
};

export default Star;

