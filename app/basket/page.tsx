'use client'
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {basketState, removeFromBasket, selectTotal, setBasketItems} from "@/redux/slices/basketSlice";
import {GetBasketItemsByUserIdRow} from "@/db/goqueries/query_sql";
import {formatPrice} from "@/lib/shared";

function BasketPage() {
    const basketItems = useSelector(basketState)
    const totalPrice = useSelector(selectTotal)
    const dispatch = useDispatch();

    const handleRemoveFromBasket = async ( {id} : GetBasketItemsByUserIdRow, index : number) => {
        try {
            const response = await fetch('/api/basket/RemoveFromBasket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ basketItemId: id }),
            });

            if (response.ok) {
                dispatch(removeFromBasket(index))
            }
        } catch (error) {
            console.error('Error removing item from basket:', error);
        }
    };

    const fetchInitial = async () => {
        const res = await fetch(`/api/basket/ShowBasket`, {
            method: 'GET'
        });
        const data = await res.json();
        if (res.ok) {
            dispatch(setBasketItems(data.basketItems))
        }
    };

    useEffect(() => {
        fetchInitial()
    }, []);


    return (
        <div className="pb-4">
            <div className="flex gap-4 pb-6">
                <a
                    href="/category"
                    className="w-1/3 border-gray-200 border-b-2 pb-4 text-center hover:border-gray-800 transition-all duration-300"
                >
                    Product selection
                </a>
                <a
                    href="/basket"
                    className="w-1/3 font-bold text-gray-800 border-gray-800 border-b-2 pb-4 text-center hover:opacity-80 transition-all duration-300"
                >
                    Basket
                </a>
                <a
                    href="/shipping"
                    className="w-1/3 border-gray-200 border-b-2 pb-4 text-center hover:border-gray-800 transition-all duration-300"
                >
                    Shipping details
                </a>
            </div>

            <div className="text-3xl font-bold pb-10">Basket</div>
            <div className="my-4 border-gray-200 border w-full"></div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-1 gap-4 flex-col">
                    {basketItems.map((basketItem, index) => (
                        <div key={`basketItem-${basketItem.id}`} className="flex gap-4 p-4 border border-gray-200 rounded-xl">
                            <div className="h-32 w-32">
                                <img
                                    src={`https://picsum.photos/seed/${basketItem.productId}/200/200`}
                                    alt={basketItem.sku}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                            </div>

                            <div className="flex flex-1 flex-col">
                                <div className="flex flex-col">
                                    <a href={`/products/${basketItem.productId}`}>
                                        <h1>Product</h1>
                                        <h1>{basketItem.name}</h1>
                                        <h1>{basketItem.sku}</h1>
                                    </a>
                                </div>

                                <div className="flex flex-1 justify-between">
                                    <div className="flex flex-col">
                                        <h1 className="text-gray-600">Price</h1>
                                        <h1>{formatPrice(basketItem.price)}</h1>
                                    </div>

                                    <div className="flex flex-col">
                                        <h1 className="text-gray-600">{basketItem.option_1Name}</h1>
                                        <h1>{basketItem.option_1Value}</h1>
                                    </div>

                                    <div className="flex flex-col">
                                        <h1 className="text-gray-600">{basketItem.option_2Name}</h1>
                                        <h1>{basketItem.option_2Value}</h1>
                                    </div>

                                    <div className="flex flex-col">
                                        <h1 className="text-gray-600">Quantity</h1>
                                        <h1>{basketItem.quantity}</h1>
                                    </div>

                                    <div className="flex flex-col">
                                        <h1 className="text-gray-600">Total Price</h1>
                                        <h1>{formatPrice(basketItem.price, basketItem.quantity)}</h1>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    className="bg-transparent hover:text-gray-800 border-[1px] border-gray-200"
                                    onClick={() => handleRemoveFromBasket(basketItem, index)}
                                >
                                    <svg
                                        className="w-8 h-8 cursor-pointer"
                                        fill="currentColor"
                                        viewBox="0 0 256 256"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M202.82861,197.17188a3.99991,3.99991,0,1,1-5.65722,5.65624L128,133.65723,58.82861,202.82812a3.99991,3.99991,0,0,1-5.65722-5.65624L122.343,128,53.17139,58.82812a3.99991,3.99991,0,0,1,5.65722-5.65624L128,122.34277l69.17139-69.17089a3.99991,3.99991,0,0,1,5.65722,5.65624L133.657,128Z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:w-72 w-full flex flex-col p-6 bg-hunter-green-100 rounded-xl">
                    <h1 className="font-bold text-2xl">Your Order</h1>
                    <div className="border-gray-800 border my-8"></div>

                    <div className="flex justify-between pb-4">
                        <h1>Total Price</h1>
                        <h1>{formatPrice(totalPrice)}</h1>
                    </div>

                    <a
                        className="w-full text-center bg-hunter-green-800 text-white hover:opacity-80 transform transition-all duration-300 rounded-full p-2 border-gray-800 border"
                        href={"/shipping"}
                    >
                        Proceed to shipping
                    </a>

                </div>
            </div>
        </div>
    );
}

export default BasketPage;