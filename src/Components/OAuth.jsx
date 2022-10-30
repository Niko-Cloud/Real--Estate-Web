import React from 'react';
import { FcGoogle} from 'react-icons/fc';
import {toast} from "react-toastify";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {doc, setDoc, getDoc, serverTimestamp} from "firebase/firestore";
import {db} from "../firebase";
import {useNavigate} from "react-router";


const OAuth = () => {

    const navigate = useNavigate()

    const onGoogleClick = async() => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth,provider)
            const user = result.user
            console.log(user)

            //check user

            const docRef = doc(db,"users", user.uid)
            const docSnap = await getDoc(docRef)

            if(!docSnap.exists()){
                await setDoc(docRef,{
                    name: user.displayName,
                    email:user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate("/")

        }catch (error){
            toast.error("Couldn't authorize with Google")
            console.log(error)
        }
    }



    return (
        <button type="button" onClick={onGoogleClick} className="flex items-center justify-center w-full bg-red-600 text-white px-7 py-3 rounded uppercase text-sm font-medium shadow-md hover:bg-red-700 active:bg-red-900 hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out">
            <FcGoogle className="mr-2 text-2xl bg-white rounded-full"/>
            Continue with google
        </button>
    );
};

export default OAuth;