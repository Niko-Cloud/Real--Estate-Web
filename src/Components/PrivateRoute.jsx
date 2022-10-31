import React from 'react';
import {Navigate, Outlet} from "react-router";
import useAuthStatus from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

const PrivateRoute = () => {

    const {loggedIn, checkStatus} = useAuthStatus()
    if(checkStatus){
        return <Spinner/>
    }

    return loggedIn ? <Outlet/> : <Navigate to="/sign-in"/>
};

export default PrivateRoute;