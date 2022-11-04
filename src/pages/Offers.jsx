import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import {db} from "../firebase";
import {startAfter,collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import Spinner from "../Components/Spinner";
import ListingItem from "../Components/ListingItem";

const Offers = () => {

    const  [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing,setlastFetchedListing] = useState(null)

    useEffect(()=>{
        async function fetchListing(){
            try {
                const listingRef = collection(db,"listings")
                const q = query(listingRef, where("offer","==", true), orderBy("timestamp", "desc"), limit(8))
                const listingSnap = await getDocs(q)
                const lastVisible = listingSnap.docs[listingSnap.docs.length - 1]
                setlastFetchedListing(lastVisible)
                const listings = []
                listingSnap.forEach((doc)=>{
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListing(listings)
                setLoading(false)
            }catch (e){
                toast.error("Could Not Fetch The Data")
            }
        }
        fetchListing()
    },[])

    async function FetchMore() {
        try {
            const listingRef = collection(db,"listings")
            const q = query(listingRef, where("offer","==", true), orderBy("timestamp", "desc"), limit(4), startAfter(lastFetchedListing))

            const listingSnap = await getDocs(q)
            const lastVisible = listingSnap.docs[listingSnap.docs.length - 1]
            setlastFetchedListing(lastVisible)
            const listings = []
            listingSnap.forEach((doc)=>{
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListing((prevState)=>[...prevState, ...listing])
            setLoading(false)
        }catch (e){
            toast.error("Could Not Fetch The Data")
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-3">
            <h1 className="text-3xl text-center mt-6 mb-6 font-bold">Offers</h1>
            {loading ? (
                <Spinner/>
            ) : listing && listing.length > 0 ? (
                <>
                    <main>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
                            {listing.map((listing)=>(
                                <ListingItem key={listing.id} id={listing.id} listing={listing.data}/>
                            ))}
                        </ul>
                    </main>
                    {lastFetchedListing && (
                        <div className="flex justify-center items-center">
                            <button onClick={FetchMore} className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-200 ease-in-out">
                                Load More
                            </button>
                        </div>
                    )}
                </>
            ): <p>There are no current offers</p>}
            
        </div>
    );
};

export default Offers;