import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import OrgCard from '../components/OrgCard';
import Loader from '../components/Loader';
import Search from '../components/Search';

const Home = () => {
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchOrgs() {
            setLoading(true);
            const res = await axios.get("/orgs");
            setOrgs(res.data);
            setLoading(false);
        }
        fetchOrgs();
    }, [])

    return (
        !loading ?
            <main className='w-full h-[100vh] flex flex-col gap-10 items-center'>
                <Search search={search} setSearch={setSearch} />
                <div className='flex gap-10 flex-wrap justify-center'>
                    {
                        orgs.filter(org => {
                            return org.name?.toLowerCase().includes(search.trim().toLowerCase())
                        }).map((org) => (
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