import React, { useEffect, useState } from 'react'
import StarRatings from 'react-star-ratings'
import Modal from './Modal';
import { useUser } from '../context/context';
import axios from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const ReviewCard = ({ review, isChecked, updateHandler, status, isAdminPage = false }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const { user } = useUser();
    const handleDelete = async () => {
        const res = await axios.delete(`/reviews/${review._id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
        })
        toast.success(res.data.message);
        window.location.reload();
    }

    const statusHandler = async (reviewId, status) => {
        await axios.patch(`/reviews/${reviewId}`, { status }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        })
        toast.success(status.toUpperCase());
        window.location.reload();
    }


    return (
        <div className='w-full bg-gray-50 border rounded-md p-6 flex flex-col gap-2 mb-5'>
            <div className='justify-between flex'>
                <span className='font-bold text-xl'>{review.title}</span>
                {
                    user.role === 'admin' ?
                        <div>
                            {
                                !isChecked && <span className='font-medium'>By {review.user.name}</span>
                            }
                            <span className='cursor-pointer' onClick={handleDelete}> <i className="fa fa-trash ml-3 text-[20px] text-red-500" aria-hidden="true"></i>
                            </span>
                        </div> :
                        (
                            isChecked &&
                            <div>
                                <button className='cursor-pointer p-2 rounded-md mr-3 bg-orange-400 text-white' onClick={() => updateHandler(review)}>Update</button>
                                <span className='cursor-pointer' onClick={handleDelete}> <i className="fa fa-trash ml-3 text-[20px] text-red-500" aria-hidden="true"></i>
                                </span>
                            </div>
                        )
                }
            </div>
            <div>
                <StarRatings
                    rating={review.rating}
                    starDimension="25px"
                    starSpacing="2px"
                    starRatedColor='orange'
                />
            </div>
            <p className='font-mono break-all'>
                {review.content.slice(0, 200)} {review.content.length >= 200 && <span onClick={openModal} className='text-blue-600 cursor-pointer'>...Read More</span>}
            </p>
            {
                user.role === 'admin' &&
                <div className='pr-4 flex justify-end gap-2 items-center'>
                    {
                        isAdminPage &&
                        <span className='mr-3 text-blue-500 font-semibold'>
                            {review.orgName}
                        </span>
                    }
                    {
                        status !== "approved" &&
                        <button className='cursor-pointer p-2 rounded-md mr-3 bg-green-500 text-white' onClick={() => statusHandler(review._id, "approved")}>Approve</button>
                    }
                    {
                        status !== "rejected" &&
                        <button className='cursor-pointer p-2 rounded-md mr-3 bg-red-400 text-white' onClick={() => statusHandler(review._id, "rejected")}>Reject</button>
                    }
                </div>
            }
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className='flex flex-col gap-2 p-2'>
                    <div>
                        <span className='font-bold text-xl'>{review.title}</span>
                    </div>
                    <div>
                        <StarRatings
                            rating={review.rating}
                            starDimension="25px"
                            starSpacing="2px"
                            starRatedColor='orange'
                        />
                    </div>
                    <div className='font-mono max-h-[70vh] overflow-scroll overflow-y-scroll'>
                        {review.content}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ReviewCard