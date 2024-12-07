import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import OrgCard from '../components/OrgCard';
import Loader from '../components/Loader';
import Search from '../components/Search';
import debounce from 'lodash.debounce';
import { pluralized } from '../utils/utils';

const Home = () => {
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredOrgs, setFilteredOrgs] = useState([]);

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
                <div className='flex gap-10 flex-wrap justify-center'>
                    {
                        filteredOrgs.map((org) => (
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