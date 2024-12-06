import { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BackendRedirection = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token")
        const error = urlParams.get("error")
        if (token) {
            localStorage.setItem("token", token)
            return navigate("/")
        } else if (error) {
            if (error === "not_from_iit_bhu") {
                toast.error("User is not from IIT (BHU)");
            }
            return navigate(`/login`)
        }
    }, [])
    return (
        <div></div>
    )
}

export default BackendRedirection