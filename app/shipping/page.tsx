'use client'
import React, {useState} from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {useSession} from "next-auth/react";
import {useSelector} from "react-redux";
import { selectTotal} from "@/redux/slices/basketSlice";
import {formatPrice} from "@/lib/shared";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
)

function Shipping() {
    const totalPrice = useSelector(selectTotal)
    const { data: session } = useSession()
    const user = session?.user;

    const [address, setAddress] = useState<string>("")
    const [houseNumber, setHouseNumber] = useState<string>("")
    const [postalCode, setPostalCode] = useState<string>("")
    const [city, setCity] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [notes, setNotes] = useState<string>("")

    const [phoneValid, setPhoneValid] = useState<boolean | null>(null);


    const handlePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhoneNumber(value);

        const pattern = /^\+?[0-9]{7,15}$/;
        setPhoneValid(pattern.test(value));
    };

    const handleCheckout = async () => {
        try {
            const stripe = await stripePromise
            const response = await fetch('/api/checkout/CreateCheckout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address : address,
                    houseNumber:houseNumber,
                    phoneNumber:phoneNumber,
                    city:city,
                    notes:notes,
                    postalCode:postalCode,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                await stripe?.redirectToCheckout({
                    sessionId: result.id
                });
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

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
                    className="w-1/3 border-gray-200 border-b-2 pb-4 text-center hover:border-gray-800 transition-all duration-300"
                >
                    Basket
                </a>
                <a
                    href="/shipping"
                    className="w-1/3 font-bold text-gray-800 border-gray-800 border-b-2 pb-4 text-center hover:opacity-80 transition-all duration-300"
                >
                    Shipping details
                </a>
            </div>

            <div className="text-3xl font-bold pb-10">Shipping details</div>
            <div className="my-4 border-gray-200 border w-full"></div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-1 flex-col gap-4">
                    <div className={"text-sm text-gray-400"}>Name</div>

                    <div className="flex flex-col">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input id="name" name="name" type="text" value={user?.name ?? ""} placeholder="Example Name"
                               required disabled
                               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                    </div>

                    <div className={"pt-8 text-sm text-gray-400"}>Address</div>

                    <div className={"flex space-x-4"}>
                        <div className="flex flex-col flex-1">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address
                                Name</label>
                            <input id="address" name="address" type="text" placeholder="Example Address" required value={address}
                                   onChange={(e) => setAddress(e.target.value)}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />

                        </div>

                        <div className="flex flex-col flex-1">
                            <label htmlFor="house-number" className="block text-sm font-medium text-gray-700 mb-2">House
                                Number</label>
                            <input id="house-number" name="house-number" type="text" placeholder="Example Number"
                                   required value={houseNumber}
                                   onChange={(e) => setHouseNumber(e.target.value)}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>

                        </div>

                    </div>

                    <div className={"flex space-x-4"}>

                        <div className="flex flex-col flex-1">
                            <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 mb-2">Postal
                                Code</label>
                            <input id="postal-code" name="postal-code" type="text" placeholder="Example Postcode"
                                   required value={postalCode}
                                   onChange={(e) => setPostalCode(e.target.value)}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                        </div>


                        <div className="flex flex-col flex-1">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <input id="city" name="city" type="text" placeholder="Example City" required value={city}
                                   onChange={(e) => setCity(e.target.value)}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                        </div>

                    </div>

                    <div className={" pt-8 text-sm text-gray-400"}>Contact</div>

                    <div className={"flex space-x-4"}>
                        <div className="flex flex-col flex-1">
                            <div className="flex justify-between items-center">
                                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-2">Phone
                                    Number</label>
                                {phoneValid === true && (
                                    <div className="text-green-600">✅ Valid phone number</div>
                                )}
                                {phoneValid === false && (
                                    <div className="text-red-600">❌ Invalid phone number</div>
                                )}
                            </div>
                            <input id="phone-number" name="phone-number" type="text" placeholder="Example Phone number"
                                   required
                                   onChange={(e) => handlePhoneNumber(e)}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                   pattern="^\+?[0-9]{7,15}$"
                                   value={phoneNumber}
                            />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address</label>
                            <input id="email" name="email" type="text" value={user?.email ?? ""} placeholder="Example Email"
                                   required disabled
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Extra
                            Notes</label>
                        <textarea id="notes" name="notes" placeholder="Example Extra Notes" required value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-24">
                    </textarea>
                    </div>
                </div>

                <div className="lg:w-72 w-full flex flex-col p-6 bg-hunter-green-100 rounded-xl">
                    <h1 className="font-bold text-2xl">Your Order</h1>
                    <div className="border-gray-800 border my-8"></div>

                    <div className="flex justify-between pb-4">
                        <h1>Total Price</h1>
                        <h1>{formatPrice(totalPrice)}</h1>
                    </div>

                    <button
                        className="w-full text-center bg-hunter-green-800 text-white hover:opacity-80 transform transition-all duration-300 rounded-full p-2 border-gray-800 border"
                        onClick={handleCheckout}
                        id="checkoutBtn"
                    >
                        Checkout
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Shipping;