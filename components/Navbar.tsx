'use client'
import React, {useEffect} from 'react';
import {signIn,signOut, useSession} from "next-auth/react";
import {useDispatch, useSelector} from "react-redux";
import {basketState, setBasketItems} from "@/redux/slices/basketSlice";
import QuickBasket from "@/components/QuickBasket";
import Image from "next/image";

function Navbar() {
    const { data: session } = useSession()
    const dispatch = useDispatch();
    const user = session?.user;
    const basketItems = useSelector(basketState)

    const fetchInitial = async () => {
        const res = await fetch(`/api/basket/ShowBasket`, {
            method: 'GET'
        });
        const data = await res.json();
        dispatch(setBasketItems(data.basketItems))
    }

    useEffect(() => {
        if (!user){
            return
        }
        fetchInitial()
    }, []);

    return (
        <div className=" flex justify-between items-center py-2 ">
            <div className="flex items-center gap-6">
                <a
                    href="/"
                    className="relative text-center w-24"
                >
                    <div className=" text-3xl font-normal font-serif">NEXT</div>
                    <div className="-mt-2 text-xs font-mono">ecomm</div>
                </a>


                <div className="relative group  ">
                    <div
                        className="flex peer text-masala-950 w-40  text-lg font-medium text-center items-center gap-2 pl-4 pr-20 py-4 group-hover:bg-masala-950 transition-all group-hover:text-white  duration-300 rounded-t-lg">
                        <a className="">Menu</a>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="h-3 mb-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
                        </svg>
                    </div>

                    <div
                        className="z-10 absolute left-0  opacity-0 group-hover:opacity-100 peer-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto peer-hover:pointer-events-auto">
                        <div className="text-white flex flex-col rounded-b-lg">

                            <a href="/category"
                               className="bg-masala-950 w-40 pl-4 pr-20 py-4 hover:bg-masala-800 text-md font-normal last:rounded-b-lg">
                                Products
                            </a>

                            <a href="/contact"
                               className="bg-masala-950 w-40  pl-4  pr-20 py-4 hover:bg-masala-800 text-md font-normal last:rounded-b-lg">
                                Contact
                            </a>

                            {user && user.role >= 1 && (
                                <>
                                    <a href="/orders"
                                       className="bg-masala-950 w-40  pl-4  pr-20  py-4 hover:bg-masala-800 text-md font-normal last:rounded-b-lg">
                                        Orders
                                    </a>
                                    <a href="/rooms"
                                       className="bg-masala-950 w-40 pl-4  pr-20  py-4 hover:bg-masala-800 text-md font-normal last:rounded-b-lg">
                                        Rooms
                                    </a>
                                </>
                            )}

                            {user && user.role >= 2 && (
                                <>
                                    <a href="/iom"
                                       className="bg-masala-950 w-40  pl-4  pr-20   py-4 hover:bg-masala-800 text-md font-normal last:rounded-b-lg">
                                        IOM
                                    </a>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center relative">

                {user && user.role >= 1 && (
                    <div className="p-4">
                        <a href="/favourites"
                           className="text-masala-950 hover:text-masala-950 text-lg font-medium transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5"
                                 stroke="currentColor" className="h-6 text-gray-700">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                            </svg>
                        </a>
                    </div>
                )}


                <div className="group p-4">
                    <div
                        className="peer text-masala-950 hover:text-masala-950 text-lg font-medium transition-colors py-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="h-6 text-gray-700">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                        </svg>
                    </div>

                    <div
                        className="z-10 absolute right-0  opacity-0 group-hover:opacity-100 peer-hover:opacity-100 transition-opacity duration-300 pt-2 pointer-events-none group-hover:pointer-events-auto peer-hover:pointer-events-auto">
                        <div className="bg-masala-950 text-white p-4 flex flex-col gap-2 w-72 rounded-xl">

                            <div className="flex flex-col gap-4 ">
                                <div className="flex gap-4">

                                    {user && user.isSigned && (
                                        <>
                                            <div className="flex gap-4">
                                                <Image
                                                    src={user.avatarUrl || ''}
                                                    className="w-full object-cover h-8 rounded-full"
                                                    alt="user avatar"
                                                    width={96}
                                                    height={96}
                                                />

                                            </div>
                                            <div>{user.name}</div>
                                        </>
                                    )}

                                    {!user && (
                                        <div>Please Sign In</div>
                                    )}

                                </div>

                                <div className="pt-[1px] bg-gray-100"></div>

                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4 items-center">


                                        {user && user.isSigned && (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth="1.5" stroke="currentColor" className="h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/>
                                                </svg>
                                                <button onClick={() => signOut()}
                                                   className="text-md font-medium transition-colors">
                                                    Logout
                                                </button>
                                            </>
                                        )}

                                        {!user && (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
                                                </svg>

                                                <button onClick={() => signIn("google")}
                                                   className="text-md font-medium transition-colors">
                                                    Login
                                                </button>
                                            </>
                                        )}

                                    </div>

                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1.5" stroke="currentColor" className="h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {user && user.role >= 1 && (
                    <>
                        <div id="basket-reloader" className="hidden"></div>
                        <div className="group p-4"
                             hx-get="/api/update-basket-size"
                             hx-target="#basket-counter"
                             hx-trigger="load"
                        >
                            <a href="/basket" className="peer text-masala-950 text-lg font-medium transition-colors">
                                <div className="py-4">

                                    <div className="relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1.5" stroke="currentColor" className="h-6 text-gray-700">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
                                        </svg>

                                        <span
                                            className="flex justify-center items-center absolute top-0 left-3 bg-masala-950 p-2 rounded-full ">
                                             <span
                                                 id="basket-counter"
                                                 className="text-white absolute text-xs text-center top-0">{basketItems?.length}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                            </a>
                            <div
                                className="z-10 absolute right-0  opacity-0 group-hover:opacity-100 peer-hover:opacity-100 transition-opacity duration-300 pt-2 pointer-events-none group-hover:pointer-events-auto peer-hover:pointer-events-auto">
                                <div className="bg-masala-950 p-4 rounded-xl">
                                    <div
                                        className="text-white w-[350px]"
                                        id="quick-basket"
                                    >
                                        <QuickBasket basketItems={basketItems}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;