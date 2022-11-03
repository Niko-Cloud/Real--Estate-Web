import {useEffect, useState} from 'react';
import {getAuth, updateProfile} from "firebase/auth";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import {collection, doc, updateDoc, where, orderBy, getDocs, query, deleteDoc} from "firebase/firestore"
import {db} from "../firebase"
import { FcHome } from 'react-icons/fc';
import {Link} from "react-router-dom";
import ListingItem from "../Components/ListingItem";

const Profile = () => {
    const auth = getAuth()
    const navigate = useNavigate()
    const [formData, setformData] = useState({
        name:auth.currentUser.displayName,
        email:auth.currentUser.email
    })
    const [Edit,setEdit] = useState(false)
    const {name,email} = formData
    const [listings, setlistings] = useState(null)
    const [loading, setloading] = useState(true)

    const onLogout = () => {
        auth.signOut()
        navigate("/")
    }

    const onChange = (e) => {
        setformData((prevState)=>({
            ...prevState,
            [e.target.id] : e.target.value
        }))
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                //update display name in firebase auth
                await updateProfile(auth.currentUser, {
                    displayName: name,
                })

                //update name in firestore
                const docRef = doc(db, "users", auth.currentUser.uid)
                await updateDoc(docRef, {
                    name,
                })
                toast.success('Profile Succesfully Updated')
            }
        } catch (error) {
            toast.error("Couldn't Update your profile")
        }
    }

    useEffect(()=>{
        const fetch_user_listing = async () => {
            const listingRef = collection(db, "listings")
            const q = query(listingRef, where("userRef","==", auth.currentUser.uid), orderBy("timestamp", "desc"))
            const querySnap = await getDocs(q)
            let listings = []
            querySnap.forEach((doc)=>{
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setlistings(listings)
            setloading(false)

        }
        fetch_user_listing()

    },[auth.currentUser.uid])

    const onDelete = async (listingID) => {
        if (window.confirm("Are you wanna delete the listing?")) {
            await deleteDoc(doc(db,"listings", listingID))
            const updatedListings = listings.filter(
                (listing) => listing.id !== listingID
            )
            setlistings(updatedListings)
            toast.success("Succesfully Deleted the Listing")
        }
    }

    const onEdit = (listingID) => {
        navigate(`/edit-listing/${listingID}`)
    }

    return (
        <>
            <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
                <h1 className="text-3xl text-center font-bold mt-6">My Profile</h1>
                <div className="w-full md:w-[50%] mt-6 px-3">
                    <form>
                        {/* Name Input */}
                        <input className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${Edit && "bg-red-200 focus:bg-red-200"}`} type="text" id="name" value={name} disabled={!Edit} onChange={onChange}
                        />

                        {/* Email Input */}
                        <input className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out" type="email" id="email" value={email} disabled={!Edit}/>
                        <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
                            <p className="flex items-center">
                                Do you want to change your name?
                                <span
                                    onClick={()=> {
                                    Edit && onSubmit()
                                        setEdit((prevState) => !prevState)
                                    }}
                                      className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer">
                                    {Edit ? ("Apply Change") : ("Edit")}
                                </span>
                            </p>
                            <p onClick={onLogout} className="text-blue-600 hover:text-blue-800 cursor-pointer transition ease-in-out duration-200">
                                Sign Out
                            </p>
                        </div>
                    </form>
                    <button className="uppercase w-full bg-blue-600 text-white px-6 py-3 rounded text-sm font-medium shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-900" type="submit">
                        <Link to="/create-listing" className="flex items-center w-full justify-center">
                            <FcHome size={23} className="items-center mr-2 bg-white rounded-full p-1 border-2"/>
                            Sell or Rent your Home
                        </Link>
                    </button>
                </div>
            </section>
            <div className="max-w-6xl mx-auto px-3 mt-6">
                {!loading && listings.length > 0 && (
                    <>
                        <h2 className="text-2xl text-center font-semibold">My Listings</h2>
                        <ul className=" sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-43 xl:grid-cols-4 2xl-grid-cols-5 mt-6 mb-6">
                            {listings.map((listing)=>(
                                <ListingItem
                                    key={listing.id}
                                    id={listing.id}
                                    listing={listing.data}
                                    onDelete={()=>onDelete(listing.id)}
                                    onEdit={()=>onEdit(listing.id)}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </>
    );
};

export default Profile;