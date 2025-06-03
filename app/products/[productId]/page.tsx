'use client'

import React, {useEffect, useState} from 'react';
import Carrousel from '@/components/Carrousel';
import Rating from '@/components/Rating';
import Review from '@/components/Review';
import UiAmountInput from '@/components/UiAmountInput';
import {useParams} from "next/navigation";
import {useSession} from "next-auth/react";
import {useDispatch} from "react-redux";
import {addToBasket} from "@/redux/slices/basketSlice";
import {
    GetCategoriesByProductIDRow,
    GetProductByIdRow, GetProductsByCategoriesAndNameRow,
    GetReviewsFillUserByProductIDRow, GetVariantByOptionsRow
} from "@/db/goqueries/query_sql";
import {formatPrice} from "@/lib/shared";
import LoveIcon from "@/components/LoveIcon";

const SingleProduct = () => {
    const [product, setProduct] = useState<GetProductByIdRow>();
    const [option1Values, setOption1Values] = useState<string[]>([]);
    const [option2Values, setOption2Values] = useState<string[]>([]);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [reviews, setReviews] = useState<GetReviewsFillUserByProductIDRow[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<GetProductsByCategoriesAndNameRow[]>([]);
    const [categories, setCategories] = useState<GetCategoriesByProductIDRow[]>([]);
    const [selectedOption1, setSelectedOption1] = useState<string>();
    const [selectedOption2, setSelectedOption2] = useState<string>();
    const [amount, setAmount] = useState<number>(1);
    const [variant, setVariant] = useState<GetVariantByOptionsRow>()

    const [addedButton, setAddedButton] = useState<string>("Add")

    const params = useParams();
    const dispatch = useDispatch();
    const { data: session } = useSession()
    const user = session?.user;

    const handleAddToFavorites = async (productId: number | undefined) => {
        try {
            await fetch('/api/favourites/AddToFavourites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: productId,
                    userId: user?.id
                }),
            });
            setIsFavorite(!isFavorite)
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    const handleOptionChange = async () => {
        try {
            const res = await fetch(`/api/products/UpdateProductInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product?.id,
                    option_1Value: selectedOption1,
                    option_2Value: selectedOption2
                }),
            });

            const data = await res.json();
            setVariant(data.variant);

        } catch (error) {
            console.error('Error updating product info:', error);
        }
    };

    const handleAddToBasket = async () => {
        try {
            const res = await fetch(`/api/basket/AddToBasket`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    variant: variant,
                    amount: amount,
                    userId: user?.id
                }),
            });
            if (res.ok){
                const data = await res.json()
                dispatch(addToBasket(data.basketItem))
                setAddedButton("Added")
            }
        } catch (error) {
            console.error('Error adding to basket:', error);
        }
    };

    const fetchInitial = async () => {
        const res = await fetch(`/api/products/ShowSingleProduct/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: params.productId,
            }),
        });

        const data = await res.json();
        setProduct(data.product);
        setIsFavorite(data.isFavourite)
        setOption1Values(data.option1Values)
        setOption2Values(data.option2Values)
        setReviews(data.reviews)
        setCategories(data.categories)
        setRelatedProducts(data.relatedProducts)
        setSelectedOption1(data.option1Values[0])
        setSelectedOption2(data.option2Values[0])
    };

    useEffect(() => {
        fetchInitial();
    }, []);

    useEffect(() => {
        if (product?.id && selectedOption1 && selectedOption2) {
            handleOptionChange();
        }
    }, [product, selectedOption1, selectedOption2]);

    return (
        <div className="flex flex-col gap-10 py-4">
            <div className="grid md:grid-cols-2 gap-10">
                <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-center">
                    <img
                        src={`https://picsum.photos/seed/${product?.id ?? 1}/600/600`}
                        alt={product?.name}
                        className="w-full  md:h-[500px] object-cover rounded-lg"
                    />
                </div>

                <form className="">
                    <div className="flex flex-wrap flex-1 gap-4">
                        {categories && categories.map(item => (
                            <div key={item.id} className="rounded-full px-4 py-1 bg-hunter-green-200 text-hunter-green-800">
                                {item.name}
                            </div>
                        ))}
                    </div>
                        <div className="flex justify-between">
                            <h1 className="pt-4 font-bold text-3xl">{product?.name}</h1>

                            {user && (
                                <div
                                    className="group/love"
                                    onClick={() => handleAddToFavorites(product?.id)}
                                >
                                    <LoveIcon isFavourited={isFavorite}/>
                                </div>
                            )}
                        </div>

                    <h1 className="pt-4 font-bold text-lg text-gray-800">
                        from {formatPrice(product?.price)}
                    </h1>

                    <h1 className="pt-4">{product?.description}</h1>

                    <div className="mt-10 p-4 bg-hawaiian-tan-50 rounded-2xl flex flex-col gap-4">
                        <h1 className="font-bold text-lg">Options</h1>

                        <div>
                            <h3 className="text-gray-600 mb-2">{product?.option_1Name}</h3>
                            <div className="flex justify-between flex-1">
                                <div className="flex gap-4">
                                    {option1Values && option1Values.map((optionValueItem, index) => (
                                        <label
                                            key={index}
                                            className="flex items-center px-5 py-3 w-full bg-hawaiian-tan-50 text-sm cursor-pointer border-[1px] border-gray-500 rounded-lg transition-all duration-300 hover:border-hawaiian-tan-700 has-[input:checked]:border-hawaiian-tan-700 has-[input:checked]:text-hawaiian-tan-700"
                                        >
                                            <input
                                                value={optionValueItem}
                                                name="option1value"
                                                className="absolute opacity-0 h-0 w-0 "
                                                type="radio"
                                                onChange={() => setSelectedOption1(optionValueItem)}
                                                checked={optionValueItem === selectedOption1}
                                            />
                                            {optionValueItem}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="text-gray-600 mb-2">{product?.option_2Name}</div>
                            <div className="flex justify-between flex-1">
                                <div className="flex gap-4">
                                    {option2Values&& option2Values.map((optionValueItem, index) => (
                                        <label
                                            key={index}
                                            className="flex items-center px-5 py-3 w-full bg-hawaiian-tan-50 text-sm cursor-pointer border-[1px] border-gray-500 rounded-lg transition-all duration-300 hover:border-hawaiian-tan-700 has-[input:checked]:border-hawaiian-tan-700 has-[input:checked]:text-hawaiian-tan-700"
                                        >
                                            <input
                                                value={optionValueItem}
                                                name="option2value"
                                                className="absolute opacity-0 h-0 w-0 peer"
                                                type="radio"
                                                onChange={() => setSelectedOption2(optionValueItem)}
                                                checked={optionValueItem === selectedOption2}
                                            />
                                            {optionValueItem}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <UiAmountInput amount={amount} setAmount={setAmount}/>

                            <div className="w-1/2 flex flex-col gap-2">
                                <div className="relative group inline-block cursor-pointer">
                                      <span className="text-gray-600 underline">
                                        In stock
                                      </span>
                                    <div
                                        className="absolute left-1/2 top-full z-10 mt-2 w-56 -translate-x-1/2 scale-0 transform rounded-lg bg-black px-3 py-2 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                                        Only items in stock are shipped immediately.<br/>
                                        Ordering more may delay delivery.
                                    </div>
                                </div>

                                <h1 id="stock-info">{variant?.stockQuantity} left</h1>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-gray-600">Total Price</h1>
                            <h1 id="total-price">{formatPrice(variant?.price, amount)}</h1>
                        </div>


                        {user && (
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    className="w-1/2 text-center bg-hunter-green-700 text-white hover:opacity-80 transform transition-all duration-300 rounded-full p-2 border-hunter-green-700 border"
                                    id="addToBasketBtn"
                                    onClick={() => handleAddToBasket()}
                                >
                                    {addedButton}
                                </button>

                                <a
                                    href="/basket"
                                    className="w-1/2 text-center bg-white text-gray-800 hover:opacity-80 transform transition-all duration-300 rounded-full p-2 border-hunter-green-700 border"
                                >
                                    Show Basket
                                </a>
                            </div>
                        )}
                        {!user && (
                            <div
                                className="w-full text-center bg-white text-hunter-green-700 hover:opacity-80 transform transition-all duration-300 rounded-full p-2 border-hunter-green-700 border"
                            >Please sign to buy any product
                            </div>
                        )}

                    </div>
                </form>
            </div>

            {relatedProducts && relatedProducts.length > 0 && (
                <div>
                    <Carrousel id="myCar" h="72" products={relatedProducts}/>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
                <div className="lg:col-span-1 w-full">
                    <Rating reviews={reviews} />
                </div>

                <div className="lg:col-span-2 grid-cols-1 grid lg:grid-cols-2 gap-6 auto-rows-min">
                    {reviews && reviews.map((item, index) => (
                        <Review review={item} key={index}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;