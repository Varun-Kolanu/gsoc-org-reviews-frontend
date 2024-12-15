import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import StarRatings from 'react-star-ratings';
import ReviewCard from '../components/ReviewCard';
import Modal from '../components/Modal';
import StarRating from '../components/Rating';
import toast from 'react-hot-toast';
import axios from '../utils/axiosInstance';
import Loader from '../components/Loader';
import { pluralized } from '../utils/utils';
import Search from '../components/Search';
import { useUser } from '../context/context';
import debounce from 'lodash.debounce';

const Reviews = () => {
    const { user } = useUser();
    const { name } = useParams();
    const [isModalOpen, setModalOpen] = useState(false);
    const [rating, setRating] = useState(1);
    const [reviews, setReviews] = useState([]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [avgRating, setAvgRating] = useState(0);

    const [search, setSearch] = useState("");
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [isUpdate, setIsUpdate] = useState({});

    const debouncedHandleSearch = useMemo(() => {
        return debounce((value) => {
            const filtered = reviews.filter((review) =>
                review.title?.toLowerCase().includes(value.trim().toLowerCase()) ||
                review.content?.toLowerCase().includes(value.trim().toLowerCase())
            );
            setFilteredReviews(filtered);
        }, 300);
    }, [reviews]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        debouncedHandleSearch(value);
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setIsUpdate({});
        setTitle("")
        setContent("")
        setRating(1)
        setModalOpen(false);
    }

    const handlePostReview = async () => {
        if (!title || !content) {
            return toast.error("Please fill all the fields");
        }

        let res;
        if (Object.keys(isUpdate).length === 0) {
            res = await axios.post("/reviews", {
                orgName: name,
                title,
                review: content,
                rating,
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            })
            toast.success("Your post is under review and will be approved soon. Thank you!", {
                duration: 3000,
                style: {
                    fontWeight: '600',
                },
            });
        } else {
            res = await axios.patch(`/reviews/${isUpdate._id}`, {
                title,
                content,
                rating,
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            })
            const updatedReviews = reviews.map(review => review._id === isUpdate._id ? res.data : review);
            setReviews(updatedReviews);
            setFilteredReviews(updatedReviews);
        }
        closeModal();
    }

    const handleCheck = (e) => {
        setIsChecked(e.target.checked)
        setFilteredReviews(filteredReviews.filter(review => review.user._id === user._id))
    }

    const updateHandler = (review) => {
        setIsUpdate(review);
        setTitle(review.title)
        setContent(review.content)
        setRating(review.rating)
        openModal();
    }

    useEffect(() => {
        async function fetchReviews() {
            setLoading(true);
            const reviews = await axios.get(`/reviews/${name}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            })
            setReviews(reviews.data.reviews);
            setFilteredReviews(reviews.data.reviews);
            setAvgRating(reviews.data.averageRating);
            setLoading(false);
        }
        fetchReviews();
    }, [])

    return (
        <>
            {
                loading ? <Loader /> :
                    <div className='w-full h-[100vh] flex flex-col items-center'>
                        <div className='flex flex-col items-center w-1/2 gap-6'>
                            <h1 className='font-bold text-4xl font-galano'> {name} </h1>
                            <div className='flex items-center justify-evenly bg-gray-100 p-6 rounded-md w-full'>
                                <div className='flex flex-col pl-12 justify-evenly w-full h-full'>
                                    <span className='text-2xl font-semibold'> {avgRating} / 5 </span>
                                    <span className='text-gray-600 text-lg'>Average Rating</span>
                                    <StarRatings
                                        rating={avgRating}
                                        starDimension="25px"
                                        starSpacing="2px"
                                        starRatedColor='orange'
                                    />
                                    <span className='mt-2 text-gray-600'>
                                        ({reviews.length} review{pluralized(reviews.length)})
                                    </span>
                                </div>
                                <div className='w-full h-full flex flex-col justify-center'>
                                    <p className='font-semibold text-lg'>Contributed to this org before?</p>
                                    <p>Please give your review to help others</p>
                                    <button onClick={openModal} className='text-white bg-blue-500 rounded-md p-3 w-1/2 mt-2'>Post your review</button>
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <Search search={search} handleSearch={handleSearch} placeholder={"Search Reviews by title or content"} />
                                <div className='flex items-center gap-2'>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={handleCheck}
                                        id='yours'
                                    />
                                    <label htmlFor="yours">Your Reviews</label>
                                </div>
                            </div>
                            <div className='w-full mt-4'>
                                {
                                    filteredReviews.length > 0 ?
                                        filteredReviews.map(review => (
                                            <ReviewCard key={review._id} review={review} isChecked={isChecked} updateHandler={updateHandler} status="approved" />
                                        )) :
                                        <div>
                                            No Reviews found
                                        </div>
                                }
                            </div>
                            <Modal isOpen={isModalOpen} onClose={closeModal}>
                                <div className='flex flex-col items-center'>
                                    <div className='flex items-center justify-evenly'>
                                        <input type="text" placeholder='Title' className='outline-none w-full mr-6 mb-3 font-mono border-2 p-2 rounded-lg' onChange={e => setTitle(e.target.value)} value={title} />
                                        <StarRating rating={rating} setRating={setRating} />
                                    </div>
                                    <textarea placeholder='Write your review here...' rows={10} className='w-full outline-none border-2 rounded-md p-2 font-mono' onChange={e => setContent(e.target.value)} value={content} />
                                    <button onClick={handlePostReview} className='text-white bg-blue-500 rounded-md p-3 w-1/2 mt-2'>Submit</button>
                                </div>
                            </Modal>
                        </div>
                    </div>
            }
        </>
    )
}

export default Reviews