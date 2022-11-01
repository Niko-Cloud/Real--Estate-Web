import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {doc, getDoc} from "firebase/firestore"
import {db} from "../firebase";
import Spinner from "../Components/Spinner";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {EffectFade, Autoplay, Navigation, Pagination} from "swiper";
import 'swiper/css/bundle';
import {FaShare, FaBed, FaShower, FaParking, FaChair, FaBath} from "react-icons/fa"
import {ImLocation} from "react-icons/im";

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

            <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg border-3 shadow-lg bg-white space-x-5">
                <div className="w-full lg-[400px] h-[200px]">
                    <p className="text-2xl font-bold mb-3 text-blue-800">
                        {listing.name} - $ {listing.offer ? listing.discountedPrice.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g,",") : listing.regularPrice.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g,",")}
                        {listing.type === "rent" ? " / Month" : ""}
                    </p>
                    <p className="flex items-center mt-6 mb-3 font-semibold">
                        <ImLocation className="text-green-700 mr-1"/> {listing.address}
                    </p>
                    <div className="flex space-x-5 justify-start items-center w-[75%]">
                        <p className="text-white bg-red-700 w-full p-1 max-w-[200px] text-center rounded-md shadow-md font-semibold">
                            {listing.type === "rent" ? "For Rent" : "For Sale"}
                        </p>
                        <p>
                            {listing.offer && (
                                <p className="text-white bg-green-700 w-full min-w-[200px] p-1 text-center rounded-md shadow-md font-semibold">
                                    ${listing.regularPrice - listing.discountedPrice} discount
                                </p>
                            )}
                        </p>
                    </div>
                    <p className="mt-3 mb-3">
                        <span className="font-semibold">
                            Description -
                        </span>
                        <span>
                            {listing.description}
                        </span>
                    </p>
                    <ul className="flex space-x-2 sm:space-x-10 text-sm font-semibold" >
                        <li className="flex items-center whitespace-nowrap">
                            <FaBed className="text-lg mr-1"/>
                            {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaBath className="text-lg mr-1"/>
                            {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bedrooms} Bath`}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaParking className="text-lg mr-1"/>
                            {listing.parking ? "Parking Available" : "No Parking"}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaChair className="text-lg mr-1"/>
                            {listing.furnished ? "Furnished Available" : "No Furnished"}
                        </li>

                    </ul>
                </div>
                <div className="bg-pink-900 w-full lg-[400px] h-[200px] z-10 overflow-x-hidden ">
                </div>
            </div>
        </main>
    );
};

export default Listing;