import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate()
    return (
        <div>Home</div>
    )
}

export default Home