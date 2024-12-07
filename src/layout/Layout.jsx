import { memo, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Logout from "../components/Logout";


const Layout = memo(({ }) => {
    const location = useLocation();
    const { pathname } = location;
    useEffect(() => {

    }, [pathname]);


    return (
        <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Logout />
                <Outlet />
            </div>
        </main>
    );
    ;
});

export default Layout;