import React, {useEffect, useState} from 'react';
import {collection, getDocs, limit, orderBy, query} from "firebase/firestore";
import {db} from "../firebase";
import Spinner from "./Spinner";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {EffectFade, Autoplay, Navigation, Pagination} from "swiper";
import 'swiper/css/bundle';
import {useNavigate} from "react-router";
import {data} from "autoprefixer";


const Slider = () => {

    const [listings,setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    SwiperCore.use([Autoplay, Navigation, Pagination])
    const navigate = useNavigate()

    useEffect(()=>{
        async function fetchListings(){
            const listingRef = collection(db,"listings")
            const q = query(listingRef, orderBy("timestamp", "desc"), limit(5))
            const querySnap = await getDocs(q)
            let listings = []
            querySnap.forEach((doc)=>{
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
        }
        fetchListings()
    },[])

    if(loading){
        return <Spinner/>
    }
    if(listings.length === 0){
        return <></>
    }
    return (
        listings && (
            <>
                <Swiper
                slidesPerView={1}
                navigation
                pagination={{type: "progressbar"}}
                effect="fade"
                modules={[EffectFade]}
                autoplay={{delay:3000}}>
                    {listings.map(({data, id})=>(
                        <SwiperSlide key={id} onClick={()=>navigate(`/category/${data.type}/${id}`)}>
                            <div className="relative w-full h-[300px] overflow-hidden" style={{background:`url('${data.imgUrls[0]}') center no-repeat`, backgroundSize: "cover"}}>
                            </div>
                            <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#4927b9] shadow-lg opacity-90 p-2 rounded-br-3xl">
                                {data.name}
                            </p>
                            <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#58bd92] shadow-lg opacity-90 p-2 rounded-tr-3xl">
                                ${data.discountedPrice ?? data.regularPrice}
                                {data.type === "rent" && " / Month"}
                            </p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        )
    );
};

export default Slider;