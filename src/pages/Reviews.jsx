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
import { MarkdownComponent } from '../components/MarkdownComponent';

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
    const [activeTab, setActiveTab] = useState('write');

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

        if (Object.keys(isUpdate).length === 0) {
            await axios.post("/reviews", {
                orgName: name,
                title,
                content,
                rating,
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            })
            toast.success("Thanks for the review!");
        } else {
            await axios.patch(`/reviews/${isUpdate._id}`, {
                title,
                content,
                rating,
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            })
        }
        closeModal();
        window.location.reload();
    }

    const handleCheck = (e) => {
        setIsChecked(e.target.checked)
        if (e.target.checked) {
            setFilteredReviews(filteredReviews.filter(review => review.user._id === user._id))
        } else {
            setFilteredReviews(reviews.filter((review) =>
                review.title?.toLowerCase().includes(search.trim().toLowerCase()) ||
                review.content?.toLowerCase().includes(search.trim().toLowerCase())
            ));
        }
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
            setAvgRating(parseFloat(reviews.data.averageRating.toFixed(2)));
            setLoading(false);
        }
        fetchReviews();
    }, [])

    return (
        <>
            {
                loading ? <Loader /> :
                    <div className='w-full min-h-screen flex flex-col items-center p-4'>
                        <div className='flex flex-col items-center md:w-2/3 lg:w-1/2 gap-6'>
                            <h1 className='mt-2 font-bold text-3xl md:text-4xl text-center font-galano'> {name} </h1>
                            <div className='flex flex-col md:flex-row items-center justify-evenly bg-gray-100 p-6 md:p-10 rounded-md w-full gap-3'>
                                <div className='flex flex-col items-center md:items-start pl-0 md:pl-6 w-full'>
                                    <span className='text-2xl md:text-2xl font-semibold'>
                                        {avgRating} / 5
                                    </span>
                                    <span className='text-gray-600 text-md md:text-lg'>
                                        Average Rating
                                    </span>
                                    <div className='mt-2 cursor-pointer'>
                                        <StarRatings
                                            rating={avgRating}
                                            starDimension="25px"
                                            starSpacing="2px"
                                            starRatedColor='orange'
                                        />
                                    </div>
                                    <span className='mt-2 text-gray-600 text-md'>
                                        ({reviews.length} review{pluralized(reviews.length)})
                                    </span>
                                </div>
                                <div className='w-full flex flex-col items-center md:items-start mt-4 md:mt-0'>
                                    <p className='font-semibold text-md md:text-lg text-center md:text-left'>
                                        Contributed to this org before?
                                    </p>
                                    <p className='text-sm text-gray-600 text-center md:text-left'>
                                        Please give your review to help others
                                    </p>
                                    <button
                                        onClick={openModal}
                                        className='text-white bg-blue-500 hover:bg-blue-700 active:bg-blue-600 rounded-md p-2 md:p-3 w-3/4 md:w-1/2 mt-2'>
                                        Post your review
                                    </button>
                                </div>
                            </div>

                            <div className='flex flex-col md:flex-row items-center justify-evenly gap-2'>
                                <Search
                                    search={search}
                                    handleSearch={handleSearch}
                                    placeholder={"Search Reviews by title or content"}
                                />
                                <div className='flex items-center gap-2 md:mt-0 mt-2'>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={handleCheck}
                                        id='yours'
                                    />
                                    <label htmlFor="yours" className='text-sm md:text-base'>
                                        Your Reviews
                                    </label>
                                </div>
                            </div>

                            <div className='w-full mt-4'>
                                {filteredReviews.length > 0 ? (
                                    filteredReviews.map(review => (
                                        <ReviewCard
                                            key={review._id}
                                            review={review}
                                            isChecked={isChecked}
                                            updateHandler={updateHandler}
                                        />
                                    ))
                                ) : (
                                    <div className='text-center text-gray-500'>
                                        No Reviews found
                                    </div>
                                )}
                            </div>
                            <Modal isOpen={isModalOpen} onClose={closeModal}>
                                <div className='flex flex-col items-center'>
                                    <div className='flex items-center justify-evenly'>
                                        <input type="text" placeholder='Title' className='outline-none w-full mr-6 mb-3 font-mono border-2 p-2 rounded-lg' onChange={e => setTitle(e.target.value)} value={title} />
                                        <StarRating rating={rating} setRating={setRating} />
                                    </div>
                                    <div className='flex w-full mb-3'>
                                        <button
                                            className={`w-1/2 p-2 ${activeTab === 'write' ? 'bg-gray-200' : 'bg-gray-100'}`}
                                            onClick={() => setActiveTab('write')}
                                        >
                                            Write
                                        </button>
                                        <button
                                            className={`w-1/2 p-2 ${activeTab === 'preview' ? 'bg-gray-200' : 'bg-gray-100'}`}
                                            onClick={() => setActiveTab('preview')}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                    {activeTab === 'write' ? (
                                        <textarea placeholder='Write your review here...' rows={10} className='w-full outline-none border-2 rounded-md p-2 font-mono' onChange={e => setContent(e.target.value)} value={content} />
                                    ) : (
                                        <div className='w-full border-2 rounded-md p-2 font-mono overflow-y-scroll' style={{ height: '15rem' }}>
                                            <MarkdownComponent>{content}</MarkdownComponent>
                                        </div>
                                    )}
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