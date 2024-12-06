import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const SignIn = () => {
    const location = useLocation();
    const navigate = useNavigate()

    const oauthLoginHandler = () => {
        window.location.href = import.meta.env.VITE_BACKEND_URL + "/api/v1/auth/google";
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/")
        }

        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get("error");
        if (error === "not_from_iit_bhu") {
            toast.error("User is not from IIT (BHU)");

            if (urlParams.toString()) {
                navigate(location.pathname, { replace: true });
            }
        }
    }, [location, navigate])
    return (
        <>
            {
                <div className='flex flex-col justify-around items-center h-[100vh] bg-gray-700'>
                    <div className='w-96 h-64 bg-gray-200 rounded-lg flex flex-col justify-evenly items-center'>
                        <h1 className='text-center font-bold text-3xl text-gray-700'>Login</h1>
                        <p className='p-5 text-lg'>
                            Please login using the button below. Only for students from IIT (BHU) 😉
                        </p>

                        <div className='flex w-40'>
                            <button type="button" onClick={() => oauthLoginHandler("google")} className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-white p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50 transition-all">
                                <span>
                                    <img src="/google.svg" alt="G" />
                                </span>
                                Google
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default SignIn;
