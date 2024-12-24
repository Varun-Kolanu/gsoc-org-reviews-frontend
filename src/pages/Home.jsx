import React, { useEffect, useMemo, useState } from 'react'
import axios from '../utils/axiosInstance';
import OrgCard from '../components/OrgCard';
import Loader from '../components/Loader';
import Search from '../components/Search';
import debounce from 'lodash.debounce';
import { pluralized } from '../utils/utils';
import up_arrow from "../assets/up_arrow.svg"
import down_arrow from "../assets/down_arrow.svg"

const Home = () => {
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredOrgs, setFilteredOrgs] = useState([]);
    const [sortByRating, setSortByRating] = useState("");
    const [sortByReviews, setSortByReviews] = useState("");

    const handleReviewSort = () => {
        if (sortByReviews === "desc") {
            setSortByReviews("asc");
        } else if (sortByReviews === "asc") {
            setSortByReviews("");
        } else {
            setSortByReviews("desc");
        }
    }

    const handleRatingSort = () => {
        if (sortByRating === "desc") {
            setSortByRating("asc");
        } else if (sortByRating === "asc") {
            setSortByRating("");
        } else {
            setSortByRating("desc");
        }
    }

    const cmpRating = (a, b) => {
        if (sortByRating === "desc") return b.avgRating - a.avgRating;
        if (sortByRating === "asc") return a.avgRating - b.avgRating;
        return 0;
    }

    const cmpReviews = (a, b) => {
        if (sortByReviews === "desc") return b.reviewCount - a.reviewCount;
        if (sortByReviews === "asc") return a.reviewCount - b.reviewCount;
        return 0;
    }

    const debouncedHandleSearch = useMemo(() => {
        return debounce((value) => {
            const filtered = orgs.filter((org) =>
                org.name?.toLowerCase().includes(value.trim().toLowerCase())
            );
            setFilteredOrgs(filtered);
        }, 300);
    }, [orgs]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        debouncedHandleSearch(value);
    };

    useEffect(() => {
        async function fetchOrgs() {
            setLoading(true);
            const res = await axios.get("/orgs");
            setOrgs(res.data);
            setFilteredOrgs(res.data);
            setLoading(false);
        }
        fetchOrgs();
    }, [])

    return (
        !loading ?
            <main className='w-full h-[100vh] flex flex-col gap-10 items-center'>
                <Search search={search} handleSearch={handleSearch} placeholder="Search Organizations..." />
                <button className='text-white rounded-md bg-orange-500 p-2 font-semibold cursor-default'>
                    {filteredOrgs.length} result{pluralized(filteredOrgs.length)}
                </button>
                <div className='flex gap-4 items-center'>
                    <span className='font-bold'>Sort by:</span>
                    <button className='flex items-center text-sm font-semibold px-3 py-2 bg-blue-500 text-white rounded-lg gap-2' onClick={handleRatingSort}> {sortByRating === "asc" && <img src={up_arrow} alt="(Asc)" />} {sortByRating === "desc" && <img src={down_arrow} alt="(Desc)" />} Rating</button>
                    <button className='flex items-center text-sm font-semibold px-3 py-2 bg-gray-500 text-white rounded-lg gap-2' onClick={handleReviewSort}> {sortByReviews === "asc" && <img src={up_arrow} alt="(Asc)" />} {sortByReviews === "desc" && <img src={down_arrow} alt="(Desc)" />} Reviews</button>
                </div>
                <div className='flex gap-10 flex-wrap justify-center'>
                    {
                        filteredOrgs.sort(cmpRating).sort(cmpReviews).map((org) => (
                            <div key={org.name} >
                                <OrgCard {...org} />
                            </div>
                        ))
                    }
                </div>
            </main> :
            <Loader />
    )
}

export default Home