import React, {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged, } from "firebase/auth";

const UseAuthStatus = () => {
    const [loggedIn, setloggedIn] = useState(false)
    const [checkStatus, setcheckStatus] = useState(true)

    useEffect(()=>{
        const auth = getAuth()
        onAuthStateChanged(auth, (user)=>{
            if(user){
                setloggedIn(true)
            }
            setcheckStatus(false)
        })
    },[])
    return (
        {loggedIn, checkStatus}
    );
};

export default UseAuthStatus;