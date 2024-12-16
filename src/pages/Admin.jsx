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
    const navigate = useNavigate();

    const debouncedHandleSearch = useMemo(() => {
        return debounce((value) => {
            const filtered = reviews.filter((review) =>
            (review.title?.toLowerCase().includes(value.trim().toLowerCase()) ||
                review.content?.toLowerCase().includes(value.trim().toLowerCase()))
            );
            setFilteredReviews(filtered);
        }, 300);
    }, [reviews]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        debouncedHandleSearch(value);
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
            setFilteredReviews(reviews.data);
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
                            <h1 className='font-bold text-4xl font-galano'> All Reviews </h1>
                            <div className='flex justify-between'>
                                <Search search={search} handleSearch={handleSearch} placeholder={"Search Reviews by title or content"} />
                            </div>

                            <div className='w-full mt-4'>
                                {
                                    filteredReviews && filteredReviews.length > 0 ?
                                        filteredReviews.map(review => (
                                            <ReviewCard key={review._id} review={review} isChecked={false} updateHandler={() => { }} isAdminPage={true} />
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