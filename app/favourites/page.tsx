'use client'
import React, {useEffect, useState} from 'react';
import {GetFavouritesByIdRow} from "@/db/goqueries/query_sql";

function FavouritesPage() {
    const [favouriteItems, setFavouriteItems] = useState<GetFavouritesByIdRow[]>()

    const fetchInitial = async () => {
        const res = await fetch(`/api/favourites/ShowFavourites`, {
            method: 'GET'
        });
        const data = await res.json();
        setFavouriteItems(data.favourites)
    };

    const handleRemove = async (favouriteItem : GetFavouritesByIdRow) => {
        try {
            const res = await fetch('/api/favourites/AddToFavourites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: favouriteItem.productId
                }),
            });

            if(res.ok){
                setFavouriteItems((prevItems) =>
                    prevItems?.filter((item) => item.productId !== favouriteItem.productId)
                );
            }
        } catch (error) {
            console.error('Error removing from favourites:', error);
        }
    };

    useEffect(() => {
        fetchInitial();
    }, []);


    return (
        <div className="pb-4">
            <div className="flex gap-4 pb-6">
                <a
                    href="/orders"
                    className="w-1/3 border-gray-200 border-b-2 pb-4 text-center hover:border-gray-800 transition-all duration-300"
                >
                    Orders
                </a>
                <a
                    href="/favourites"
                    className="w-1/3 font-bold text-gray-800 border-gray-800 border-b-2 pb-4 text-center hover:opacity-80 transition-all duration-300"
                >
                    Favourites
                </a>
                <a
                    href="/rooms"
                    className="w-1/3 border-gray-200 border-b-2 pb-4 text-center hover:border-gray-800 transition-all duration-300"
                >
                    Messenger
                </a>
            </div>
            <div className="text-3xl font-bold pb-10">Favourites</div>
            <div className="my-4 border-gray-200 border w-full"></div>
            <div className="flex gap-8">
                <div className="flex flex-1 gap-4 flex-col">
                    {favouriteItems?.map((favouriteItem) => {
                        const itemID = `favouriteItem-${favouriteItem.productId}`;

                        return (
                            <div key={itemID} className="flex gap-4 p-4 border border-gray-200 rounded-xl">
                                <div>
                                    <img
                                        src={`https://picsum.photos/seed/${favouriteItem.productId}/200/200`}
                                        alt={favouriteItem.name_2}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col">
                                    <div className="flex flex-col">
                                        <h1>Product</h1>
                                        <h1>{favouriteItem.name_2}</h1>
                                    </div>
                                    <div className="flex flex-1 justify-between"></div>
                                </div>
                                <div>
                                    <button
                                        className="bg-transparent hover:text-gray-800 border-[1px] border-gray-200"
                                        onClick={() => handleRemove(favouriteItem)}
                                    >
                                        <svg
                                            className="w-8 h-8 cursor-pointer"
                                            fill="currentColor"
                                            viewBox="0 0 256 256"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M202.82861,197.17188a3.99991,3.99991,0,1,1-5.65722,5.65624L128,133.65723,58.82861,202.82812a3.99991,3.99991,0,0,1-5.65722-5.65624L122.343,128,53.17139,58.82812a3.99991,3.99991,0,0,1,5.65722-5.65624L128,122.34277l69.17139-69.17089a3.99991,3.99991,0,0,1,5.65722,5.65624L133.657,128Z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default FavouritesPage;