'use client'
import React, {useEffect, useState} from 'react';
import ProductList from "@/components/ProductList";
import {useSession} from "next-auth/react";
import {GetProductsByCategoriesAndNameRow} from "@/db/goqueries/query_sql";

function Home() {
    const [products, setProducts] = useState([])
    const { data: session, status } = useSession();
    const user = session?.user ;

    const fetchInitial = async () => {
        const res = await fetch(`/api/products/ShowProducts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user?.id,
                specialIds: [2]
            }),
        });
        const data = await res.json();
        setProducts(data.products.filter((item: GetProductsByCategoriesAndNameRow) => item.special === 2));
    };

    useEffect(() => {
        fetchInitial();
    }, [status]);

    return (
        <div className="pt-4 pb-10 flex flex-col gap-4">

            <div className="flex md:flex-row flex-col bg-hawaiian-tan-200 rounded-lg md:py-16 py-4 px-4 lg:px-32 sm:px-16 gap-10 justify-center items-center">
                <div className="flex flex-col md:w-2/3 pt-10 gap-4 text-center md:text-left">
                    <div className="text-hawaiian-tan-800 font-bold text-lg">hendrerit ullamcorper. Donec</div>
                    <div className="font-bold text-5xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
                    <div className="text-lg py-4">eu magna massa, scelerisque ac lobortis et, posuere eu metus. Aenean
                        fringilla, felis id hendrerit ullamcorper, lectus leo faucibus tellus, vel ullamcorper
                    </div>
                    <a href="/category" className="text-2xl font-bold underline">List products by categories</a>

                </div>
                <div className="md:w-1/3 p-4 md:p-0 ">
                    <img
                        alt="Product"
                        src={`https://picsum.photos/seed/${510}/600/600`}
                    />
                </div>

            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                <div className="rounded-lg flex bg-hunter-green-200 transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="w-1/2 flex flex-col  p-10">
                        <div className="font-bold text-lg">scelerisque ac lobortis</div>
                        <div className="text-md">scelerisque ac lobortis et</div>
                        <div className="font-bold text-lg">scelerisque</div>
                    </div>
                    <div className="w-1/2 ">
                        <img
                            alt="Product"
                            src={`https://picsum.photos/seed/${501}/600/600`}
                            className="object-cover rounded-r-lg w-full h-full"
                        />
                    </div>
                </div>
                <div className="rounded-lg flex bg-timber-green-200 transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="w-1/2 flex flex-col p-10">
                        <div className="font-bold text-lg">scelerisque ac lobortis</div>
                        <div className="text-md">scelerisque ac lobortis et</div>
                        <div className="font-bold text-lg">scelerisque</div>
                    </div>
                    <div className="w-1/2 ">
                        <img
                            alt="Product"
                            src={`https://picsum.photos/seed/${502}/600/600`}
                            className="object-cover rounded-r-lg w-full h-full"
                        />
                    </div>
                </div>
                <div className="rounded-lg flex bg-heavy-metal-200 transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="w-1/2 flex flex-col p-10">
                        <div className="font-bold text-lg">scelerisque ac lobortis</div>
                        <div className="text-md">scelerisque ac lobortis et</div>
                        <div className="font-bold text-lg">scelerisque</div>
                    </div>
                    <div className="w-1/2 h-full">
                        <img
                            alt="Product"
                            src={`https://picsum.photos/seed/${503}/600/600`}
                            className="object-cover rounded-r-lg w-full h-full"
                        />
                    </div>
                </div>
            </div>
            <div className="mb-10">

                <div className="font-bold text-3xl mb-4">New Products</div>
                <div className={"mb-4"}>
                    <ProductList products={products} userId={user?.id}/>
                </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                <div className="rounded-lg flex bg-timber-green-200 transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="w-1/2 flex flex-col  p-10">
                        <div className="font-bold text-lg">scelerisque ac lobortis</div>
                        <div className="text-md">scelerisque ac lobortis et</div>
                        <div className="font-bold text-lg">scelerisque</div>
                    </div>
                    <div className="w-1/2 ">
                        <img
                            alt="Product"
                            src={`https://picsum.photos/seed/${504}/600/600`}
                            className="object-cover rounded-r-lg w-full h-full"
                        />
                    </div>
                </div>
                <div className="rounded-lg flex bg-heavy-metal-200 transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="w-1/2 flex flex-col p-10">
                        <div className="font-bold text-lg">scelerisque ac lobortis</div>
                        <div className="text-md">scelerisque ac lobortis et</div>
                        <div className="font-bold text-lg">scelerisque</div>
                    </div>
                    <div className="w-1/2 ">
                        <img alt="Product" src={`https://picsum.photos/seed/${505}/600/600`}
                             className="object-cover rounded-r-lg w-full h-full"/>
                    </div>
                </div>
                <div className="rounded-lg flex bg-hunter-green-200 transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="w-1/2 flex flex-col p-10">
                        <div className="font-bold text-lg">scelerisque ac lobortis</div>
                        <div className="text-md">scelerisque ac lobortis et</div>
                        <div className="font-bold text-lg">scelerisque</div>
                    </div>
                    <div className="w-1/2 h-full">
                        <img
                            alt="Product"
                            src={`https://picsum.photos/seed/${506}/600/600`}
                            className="object-cover rounded-r-lg w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;