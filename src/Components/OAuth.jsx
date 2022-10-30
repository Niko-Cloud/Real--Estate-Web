import React from 'react';
import { FcGoogle} from 'react-icons/fc';

const OAuth = () => {
    return (
        <button className="flex items-center justify-center w-full bg-red-600 text-white px-7 py-3 rounded uppercase text-sm font-medium shadow-md hover:bg-red-700 active:bg-red-900 hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out">
            <FcGoogle className="mr-2 text-2xl bg-white rounded-full"/>
            Continue with google
        </button>
    );
};

export default OAuth;