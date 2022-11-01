import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {doc, getDoc} from "firebase/firestore"
import {db} from "../firebase";
import Spinner from "../Components/Spinner";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {EffectFade, Autoplay, Navigation, Pagination} from "swiper";
import 'swiper/css/bundle';

const Listing = () => {
    const params = useParams()
    const [listing,setlisting]=useState(null)
    const [loading, setloading] = useState(true)
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
        </main>
    );
};

export default Listing;