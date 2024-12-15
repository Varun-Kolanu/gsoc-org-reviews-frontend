import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReviewCard from '../components/ReviewCard';
import axios from '../utils/axiosInstance';
import Loader from '../components/Loader';
import Search from '../components/Search';
import { useUser } from '../context/context';
import debounce from 'lodash.debounce';

const Admin = () => {
    const { user } = useUser();
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [status, setStatus] = useState("pending");
    const navigate = useNavigate();

    const debouncedHandleSearch = useMemo(() => {
        return debounce((value, st) => {
            const filtered = reviews.filter((review) =>
                review.status === st &&
                (review.title?.toLowerCase().includes(value.trim().toLowerCase()) ||
                    review.content?.toLowerCase().includes(value.trim().toLowerCase()))
            );
            setFilteredReviews(filtered);
        }, 300);
    }, [reviews]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        debouncedHandleSearch(value, status);
    };

    useEffect(() => {
        if (user.role !== 'admin') {
            return navigate("/");
        }
        async function fetchReviews() {
            setLoading(true);
            const reviews = await axios.get(`/reviews`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            })
            setReviews(reviews.data);
            setFilteredReviews(reviews.data.filter(review => review.status === status));
            setLoading(false);
        }
        fetchReviews();
    }, [])

    useEffect(() => {
        if (reviews)
            setFilteredReviews(reviews.filter(review => review.status === status &&
                (review.title?.toLowerCase().includes(search.trim().toLowerCase()) ||
                    review.content?.toLowerCase().includes(search.trim().toLowerCase()))))
    }, [status])

    return (
        <>
            {
                loading ? <Loader /> :
                    <div className='w-full h-[100vh] flex flex-col items-center'>
                        <div className='flex flex-col items-center w-1/2 gap-6'>
                            <h1 className='font-bold text-4xl font-galano'> All Reviews </h1>
                            <div className='flex justify-between'>
                                <Search search={search} handleSearch={handleSearch} placeholder={"Search Reviews by title or content"} />
                                <div className='flex justify-evenly gap-2 items-center'>
                                    <label htmlFor="status">Status: </label>
                                    <select name="status" id="status" onChange={e => setStatus(e.target.value)} value={status} className='p-3'>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div className='w-full mt-4'>
                                {
                                    filteredReviews && filteredReviews.length > 0 ?
                                        filteredReviews.map(review => (
                                            <ReviewCard key={review._id} review={review} isChecked={false} updateHandler={() => { }} status={status} isAdminPage={true} />
                                        )) :
                                        <div>
                                            No Reviews found
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Admin