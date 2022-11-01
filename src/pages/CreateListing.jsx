import {useState} from 'react';
import Spinner from "../Components/Spinner";
import {toast} from "react-toastify";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import {getAuth} from "firebase/auth";
import {v4 as uuidv4} from "uuid"
import {serverTimestamp, addDoc, collection} from "firebase/firestore";
import {db} from "../firebase"
import {useNavigate} from "react-router";
import {MdHelp} from "react-icons/md"

const CreateListing = () => {
    const navigate = useNavigate()
    const auth = getAuth()
    const [geolocationEnabled, setgeolocationEnabled] = useState(true)
    const [loading,setLoading] = useState(false)
    const [formData,setformData]=useState({
        type: "rent",
        name: "",
        bedrooms:1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address:"",
        description:"",
        offer:false,
        regularPrice: 0,
        discountedPrice: 0,
        latitude:0,
        longitude:0,
        images: {}
    })

    const {type, name, bedrooms, bathrooms, parking, furnished, address, description, offer, regularPrice, discountedPrice, latitude, longitude, images} = formData

    function onChange(e){
        let boolean = null
        if(e.target.value === "true"){
            boolean = true
        }
        if(e.target.value === "false"){
            boolean = false
        }
        if(e.target.files){
            setformData((prevState) =>({
                ...prevState,
                images: e.target.files
            }))
        }
        if(!e.target.files){
            setformData((prevState) =>({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (+discountedPrice >= +regularPrice) {
            setLoading(false)
            toast.error("Regular Price Should Have Higher Than Discounted Price")
        }
        if (images.length > 6) {
            setLoading(false)
            toast.error("Maximum images are 6")
        }

        let geolocation = {}
        if(geolocationEnabled){
            const Geocodio = require('geocodio-library-node');
            const geocoder = new Geocodio('5c66bfc6e556feb5363a66acc5f3e7c6ca5566b');

            geocoder.geocode({address})
                .then(response => {
                    console.log(response.results[0]);
                    geolocation.lat = response.results?.address.response.results[0].location.lat ?? 0
                    geolocation.lng = response.results?.address.response.results[0].location.lng ?? 0

                    if(response.results.address.response.error === "Could not geocode address. Postal code or city required."){
                        setLoading(false)
                        toast.error("Please Enter The Correct Address")
                    }
                })
                .catch(err => {
                        console.error(err);
                    }
                );
        }else{
            geolocation.lat = latitude
            geolocation.lng = longitude
        }

        const storeImage = async (image) => {
            return new Promise((resolve,reject)=>{
                const storage = getStorage()
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, filename)
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        // eslint-disable-next-line default-case
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error)
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve('File available at', downloadURL);
                        });
                    }
                );
            })
        }

        const imgUrls = await Promise.all(
            [...images].map((image)=>storeImage(image)))
                .catch((error)=>{
                setLoading(false)
                toast.error("Images not Uploaded")
            });


        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp : serverTimestamp(),
            userRef: auth.currentUser.uid,
        }
        delete formDataCopy.images
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        delete formDataCopy.latitude
        delete formDataCopy.longitude
        const docRef = await addDoc(collection(db,"listings"), formDataCopy)
        setLoading(false)
        toast.success("Data Successfully Added")
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    if(loading){
        return <Spinner/>
    }

    return (
        <main className="max-w-md px-2 mx-auto">
            <h1 className="text-3xl font-bold text-center mt-6">Create a Listing</h1>
            <form onSubmit={onSubmit}>
                <p className="text-lg mt-6 font-semibold mb-1">Sell or Rent</p>
                <div className="flex justify-between">
                    <button onClick={onChange} type="button" id="type" value="rent" className={`uppercase w-full shadow-md px-7 py-3 rounded font-medium tx-sm hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out mr-3 ${
                        type === "rent" ? ("bg-slate-600 text-white") : ("bg-white text-black")
                    }`}>Rent</button>
                    <button onClick={onChange} type="button" id="type" value="sale" className={`uppercase w-full shadow-md px-7 py-3 rounded font-medium tx-sm hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out ml-3 ${
                        type === "sale" ? ("bg-slate-600 text-white") : ("bg-white text-black")
                    }`}>Sale</button>
                </div>
                <p className="mt-6 text-lg font-semibold">Name</p>
                <div>
                    <input type="text" id="name" value={name} onChange={onChange} placeholder="Name" maxLength="32" minLength="10" required className="w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"/>
                </div>
                <div className="flex space-x-6 mb-6">
                    <div>
                        <p className="text-lg font-semibold">Beds</p>
                        <input onChange={onChange} type="number" id="bedrooms" value={bedrooms}  min="1" max="50" required className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-slate-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"/>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Baths</p>
                        <input type="number" id="bathrooms" value={bathrooms} onChange={onChange} min="1" max="50" required className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-slate-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"/>
                    </div>
                </div>
                <p className="text-lg mt-6 font-semibold mb-1">Parking Spot</p>
                <div className="flex justify-between">
                    <button onClick={onChange} type="button" id="parking" value={true} className={`uppercase w-full shadow-md px-7 py-3 rounded font-medium tx-sm hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out mr-3 ${
                        !parking ? ("bg-white text-black") : ("bg-slate-600 text-white")
                    }`}>Yes</button>
                    <button onClick={onChange} type="button" id="parking" value={false} className={`uppercase w-full shadow-md px-7 py-3 rounded font-medium tx-sm hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out ml-3 ${
                        parking ? ("bg-white text-black") : ("bg-slate-600 text-white")
                    }`}>No</button>
                </div>
                <p className="text-lg mt-6 font-semibold mb-1">Furnished</p>
                <div className="flex justify-betweenz">
                    <button onClick={onChange} type="button" id="furnished" value={true} className={`uppercase w-full shadow-md px-7 py-3 rounded font-medium tx-sm hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out mr-3 ${
                        !furnished ? ("bg-white text-black") : ("bg-slate-600 text-white")
                    }`}>Yes</button>
                    <button onClick={onChange} type="button" id="furnished" value={false} className={`uppercase w-full shadow-md px-7 py-3 rounded font-medium tx-sm hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out ml-3 ${
                        furnished ? ("bg-white text-black") : ("bg-slate-600 text-white")
                    }`}>No</button>
                </div>
                <p className="mt-6 text-lg font-semibold">Address</p>
                <div>
                    <textarea type="text" id="address" value={address} onChange={onChange} placeholder="Address" required className="w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"/>
                    <p className="flex mb-6 text-gray-500 text-sm"> <MdHelp size={23} className="py-1 mr-1"/> Address Format Example : 17015 Walnut Grove Drive, Morgan Hill CA</p>
                    {!geolocationEnabled && (
                        <div className="flex space-x-6">
                            <div>
                                <p className="text-lg font-semibold">Latitude</p>
                                <input type="number" id="latitude" value={latitude} onchage={onChange} min="-90" max="90" className="w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"/>
                            </div>
                            <div >
                                <p className="text-lg font-semibold">Longitude</p>
                                <input type="number" id="longitude" value={longitude} onchage={onChange} min="-180" max="180" className="w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"/>
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-lg font-semibold">Description</p>
                <div>
                    <textarea type="text" id="description" value={description} onChange={onChange} placeholder="Description" required className="w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"/>
                </div>
                <p className="text-lg font-semibold mb-1">Offer</p>
                <div className="flex justify-between">
                    <button onClick={onChange} type="button" id="offer" value={true} className={`uppercase w-full shadow-md px-7 py-3 rounded font-medium tx-sm hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out mr-3 ${
                        !offer ? ("bg-white text-black") : ("bg-slate-600 text-white")
                    }`}>Yes</button>
                    <button onClick={onChange} type="button" id="offer" value={false} className={`uppercase w-full shadow-md px-7 py-3 rounded font-medium tx-sm hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out ml-3 ${
                        offer ? ("bg-white text-black") : ("bg-slate-600 text-white")
                    }`}>No</button>
                </div>
                <div className="flex items-center mb-6">
                    <div>
                        <p className="text-lg mt-6 font-semibold mb-1">Regular Price</p>
                        <div className="flex w-full justify-center items-center space-x-6">
                            <input type="number" id="regularPrice" value={regularPrice} onChange={onChange} min="50" max="40000000" required className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-slate-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                            {type === "rent" && (
                                <div>
                                    <p className="text-md whitespace-nowrap w-full">$ / Month</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {offer && (
                    <div className="flex items-center mb-6">
                        <div>
                            <p className="text-lg font-semibold mb-1">Discounted Price</p>
                            <div className="flex w-full justify-center items-center space-x-6">
                                <input type="number" id="discountedPrice" value={discountedPrice} onChange={onChange} min="50" max="40000000" required={offer} className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-slate-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                                {type === "rent" && (
                                    <div>
                                        <p className="text-md whitespace-nowrap w-full">$ / Month</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div>
                    <div className="mb-6">
                        <p className="text-lg font-semibold mb-1">Images</p>
                        <p className="text-gray-600">The 1st image will be the cover (max 6) 2MB Each Files</p>
                        <input type="file" id="images" onChange={onChange} accept=".jpg,.png,.jpeg" multiple required className="bg-white border text-gray border-slate-300 w-full px-6 py-3 rounded shadow-md transition duration-200 ease-in-out focus:bg-white focus:border-slate-600"/>
                    </div>
                </div>
                <button type="submit" className="mb-6 w-full bg-blue-600 rounded text-lg text-white px-6 py-2 uppercase shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200 ease-in-out foucs:bg-blue-800 focus:shadow-lg active:bg-blue-900 active:shadow-lg">Create Listing</button>
            </form>
        </main>
    );
};

export default CreateListing;