'use client'
import React, {useState} from 'react';
import {
    GetProductsByCategoriesAndNameRow
} from "@/db/goqueries/query_sql";
import LoveIcon from "@/components/LoveIcon";
import {formatPrice} from "@/lib/shared";

type PropsType = {
    item:   GetProductsByCategoriesAndNameRow;
    userId: number | undefined | null;
};

function ProductCard({item, userId}:PropsType) {
    const [isFavourited, setIsFavourited] = useState<boolean>(item.isfavourite)

    const handleAddToFavorites = async (product:GetProductsByCategoriesAndNameRow) => {
        try {

            await fetch('/api/favourites/AddToFavourites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product.id,
                    userId: userId
                }),
            });
            setIsFavourited(!isFavourited)

        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    return (
        <div className={"relative"}>
            <a
                href={`/products/${item.id}`}
                className="flex flex-col justify-self-center group w-[280px] transform duration-300 group"
            >
                {/* <!-- Product Image -->*/}
                <div className="relative w-full h-60 bg-gray-200 flex items-center justify-center rounded-t-xl">
                    <img src={`https://picsum.photos/seed/${item.id}/200/200`} alt={item.name}
                         className="object-cover w-full h-full rounded-t-xl"/>
                    <div
                        className="flex absolute bg-black w-full h-full rounded-t-xl opacity-0 group-hover:opacity-10 transform duration-300 justify-center items-center">
                    </div>
                    <div
                        className="absolute border border-white rounded-full px-2 text-white opacity-0 group-hover:opacity-100 transform duration-300">
                        Show details
                    </div>
                </div>

                {userId && (userId !== 0) && (
                    <div
                        className="group/love absolute right-2 top-2 z-20 bg-hawaiian-tan-50 rounded-full bg-opacity-50 p-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleAddToFavorites(item);
                        }}
                    ><LoveIcon isFavourited={isFavourited}/></div>
                )}

                {/*<!-- Product Details -->*/}
                <div
                    className=" p-4 border-b-2 border-x-2 border-gray-100 rounded-b-xl group-hover:border-heavy-metal-600 group-hover:bg-heavy-metal-600 transform duration-300 group-hover:text-white text-black">
                    <p className="text-sm mb-1 text-gray-800 group-hover:text-white transform duration-300 ">
                        {item.description.length > 16 ? item.description.slice(0, 16) + "..." : item.description}
                    </p>
                    <h3 className="text-lg font-semibold mb-4 ">{item.name}</h3>

                    <div className="flex items-center justify-between">
                        <p className="">from {formatPrice(item.price)}</p>
                        {item.special && (
                            <p className="text-white rounded-full bg-heavy-metal-800 px-3">{item.name_2}</p>
                        )}
                    </div>
                </div>
            </a>
        </div>
    );
}

export default ProductCard;