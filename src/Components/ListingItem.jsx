import React from 'react';
import {Link} from "react-router-dom";
import Moment from 'react-moment';
import {ImLocation} from "react-icons/im";
import {AiOutlineEdit, AiFillDelete} from "react-icons/ai"

const ListingItem = ({listing, id, onEdit, onDelete}) => {
    return (
        <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-200 ease-in m-[10px]">
            <Link className="contents" to={`/category/${listing.type}/${id}`}>
                <img className="h-[170px] w-full object-cover hover:scale-150 transition-scale duration-200 ease-in" loading="lazy" src={listing.imgUrls[0]} alt="cover-image"/>
                <Moment fromNow className="absolute top-2 left-2 bg-blue-600 text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg">
                    {listing.timestamp?.toDate()}
                </Moment>
                <div className="w-full p-[10px]">
                    <div className="flex items-center space-x-1">
                        <ImLocation className="h-4 w-4 text-green-600"/>
                        <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">{listing.address}</p>
                    </div>
                    <p className="font-semibold m-0 text-lg truncate">{listing.name}</p>
                    <p className="text-[#457b9d] mt-2 font-semibold">${listing.offer
                        ? listing.discountedPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g,",")
                        : listing.regularPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g,",")}
                        {listing.type === "rent" && " / month"}
                    </p>
                    <div className="flex items-center mt-[10px] space-x-3">
                        <div className="flex items-center space-x-1">
                            <p className="font-bold text-xs">{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                            <p className="font-bold text-xs">{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}</p>
                        </div>
                    </div>
                </div>
            </Link>
            {onDelete && (
                <AiFillDelete className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-700" onClick={()=>onDelete(listing.id)}/>
            )}
            {onEdit && (
                <AiOutlineEdit className="absolute bottom-2 right-7 h-[14px] cursor-pointer text-green-700" onClick={()=>onEdit(listing.id)}/>
            )}
        </li>
    );
};

export default ListingItem;