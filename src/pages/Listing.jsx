import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {doc, getDoc} from "firebase/firestore"
import {db} from "../firebase";
import Spinner from "../Components/Spinner";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {EffectFade, Autoplay, Navigation, Pagination} from "swiper";
import 'swiper/css/bundle';
import {FaShare} from "react-icons/fa"

const Listing = () => {
    const params = useParams()
    const [listing,setlisting]=useState(null)
    const [loading, setloading] = useState(true)
    const [linkCopied, setlinkCopied] = useState(false)
    SwiperCore.use([Autoplay, Navigation, Pagination])
    useEffect(()=>{
        async function fetchListing(){
            const docRef = doc(db,"listings", params.listingId)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                setlisting(docSnap.data())
                setloading(false)
            }
        }
        fetchListing()
    },[params.listingId])
    if(loading){
        return <Spinner/>
    }


    return (
        <main>
            <Swiper slidesPerView={1} navigation pagination={{type: "progressbar"}} effect="fade" modules={[EffectFade]} autoplay={{delay:3000}}>
                {listing.imgUrls.map((url, index)=>(
                    <SwiperSlide key={index}>
                        <div
                            className="relative w-full h-[400px] overflow-hidden"
                            style={{background:`url('${listing.imgUrls[index]}') center no-repeat`, backgroundSize: "cover"}}>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="fixed top-[13%] right-[3%] cursor-pointer z-10 bg-white rounded-full border-2 border-gray-400 w-12 h-12 items-center flex justify-center" onClick={()=>{
                navigator.clipboard.writeText(window.location.href)
                setlinkCopied(true)
                setTimeout(()=>{
                    setlinkCopied(false)
                },2000)
            }}>
                <FaShare size={25} className="text-slate-500"/>
            </div>
            {linkCopied && (
                <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 px-3 py-2">Link Copied</p>
            )}
        </main>
    );
};

export default Listing;