import React, {useEffect, useState} from 'react';
import Slider from "../Components/Slider";
import {collection,getDoc,getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {db} from "../firebase";
import {Link} from "react-router-dom";
import ListingItem from "../Components/ListingItem";

const Home = () => {
    //Offers
    const [offerListings,setOfferListings] = useState("")
    useEffect(()=>{
        async function fetchListings(){
            try{
                //get Reference
                const listingRef = collection(db,"listings")
                const q = query(listingRef, where("offer","==", true), orderBy("timestamp", "desc"), limit(4))
                const querySnap = await getDocs(q)
                const listings = []
                querySnap.forEach((doc)=>{
                    return listings.push({
                        id: doc.id,
                        data : doc.data()
                    })
                })
                setOfferListings(listings)
            }catch (e){
                console.log(e)
            }
        }
        fetchListings()
    },[])

    //Rent
    const [rentListings,setRentListings] = useState("")
    useEffect(()=>{
        async function fetchListings(){
            try{
                //get Reference
                const listingRef = collection(db,"listings")
                const q = query(listingRef, where("type","==", "rent"), orderBy("timestamp", "desc"), limit(4))
                const querySnap = await getDocs(q)
                const listings = []
                querySnap.forEach((doc)=>{
                    return listings.push({
                        id: doc.id,
                        data : doc.data()
                    })
                })
                setRentListings(listings)
            }catch (e){
                console.log(e)
            }
        }
        fetchListings()
    },[])
    //Sale
    const [saleListings,setSaleListings] = useState("")
    useEffect(()=>{
        async function fetchListings(){
            try{
                //get Reference
                const listingRef = collection(db,"listings")
                const q = query(listingRef, where("type","==", "sale"), orderBy("timestamp", "desc"), limit(4))
                const querySnap = await getDocs(q)
                const listings = []
                querySnap.forEach((doc)=>{
                    return listings.push({
                        id: doc.id,
                        data : doc.data()
                    })
                })
                setSaleListings(listings)
            }catch (e){
                console.log(e)
            }
        }
        fetchListings()
    },[])


    return (
        <div>
            <Slider/>
            <div className="max-w-7xl mx-auto pt-4 space-y-6">
                {offerListings && offerListings.length > 0 && (
                    <div className="m-2 mb-6">
                        <h2 className="px-3 text-2xl mt-6 font-semibold">
                            Recent Offers
                        </h2>
                        <Link to="/offers">
                            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">Show More Offers</p>
                        </Link>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {offerListings.map((listing)=>(
                                <ListingItem key={listing.id} id={listing.id} listing={listing.data}></ListingItem>
                                )
                            )}
                        </ul>
                    </div>
                )}

                {rentListings && rentListings.length > 0 && (
                    <div className="m-2 mb-6">
                        <h2 className="px-3 text-2xl mt-6 font-semibold">
                            Places For Rent
                        </h2>
                        <Link to="/category/rent">
                            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">Show More Rent</p>
                        </Link>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {rentListings.map((listing)=>(
                                <ListingItem key={listing.id} id={listing.id} listing={listing.data}></ListingItem>
                                )
                            )}
                        </ul>
                    </div>
                )}

                {saleListings && saleListings.length > 0 && (
                    <div className="m-2 mb-6">
                        <h2 className="px-3 text-2xl mt-6 font-semibold">
                            Places For Rent
                        </h2>
                        <Link to="/category/sale">
                            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">Show More Sale</p>
                        </Link>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {saleListings.map((listing)=>(
                                    <ListingItem key={listing.id} id={listing.id} listing={listing.data}></ListingItem>
                                )
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home