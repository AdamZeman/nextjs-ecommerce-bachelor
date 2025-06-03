'use client'
import React, { useEffect, useState, useRef } from 'react';
import ProductList from "@/components/ProductList";
import ProductFilter from "@/components/ProductFilter";
import CarrouselHeader from "@/components/CarrouselHeader";
import { useSession } from "next-auth/react";
import {
    GetCategoriesRow,
    GetProductsByCategoriesAndNameRow, GetSpecialRow
} from "@/db/goqueries/query_sql";
import {useDispatch, useSelector} from "react-redux";
import {filterState, setNameTo} from "@/redux/slices/filterSlice";

function Page() {
    const MaxPerPage = 30

    const [products, setProducts] = useState<GetProductsByCategoriesAndNameRow[]>([]);
    const [categories, setCategories] = useState<GetCategoriesRow[]>([]);

    const [special, setSpecial] = useState<GetSpecialRow[]>([]);

    const [page, setPage] = useState<number>(0);

    const { data: session, status } = useSession();
    const user = session?.user;

    const filters = useSelector(filterState)
    const dispatch = useDispatch()

    const fetchInitial = async (page: number, replace:boolean) => {
        const res = await fetch(`/api/products/ShowProducts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user?.id,
                page: page,
                limit: MaxPerPage,
                categoryIds: filters.categories,
                specialIds: filters.special,
                nameFilter: filters.name,
                priceFrom: filters.price.from,
                priceTo:filters.price.to
            }),
        });

        const data = await res.json();

        if(replace){
            setProducts(data.products)
            setPage(1)
        }else{
            setProducts(prevProducts => [
                ...(Array.isArray(prevProducts) ? prevProducts : []),
                ...(Array.isArray(data.products) ? data.products : []),
            ]);        }
        setCategories(data.categories);
        setSpecial(data.special);
    };

    useEffect(() => {

        if (!(page == 1 || page === 0)){
            fetchInitial(page, false);
        }
    }, [page]);

    useEffect(() => {
        fetchInitial(1, true);
    }, [status, filters]);



    const loaderRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting ) {
                    setPage(prevPage => {
                        const nextPage = prevPage + 1;
                        return nextPage;
                    });
                }
            }, { threshold: 1.0 }
        );
        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, []);

    return (
        <div>
            <CarrouselHeader id={"hello"} />
            <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 pb-10"}>
                <div className={"col-span-1 md:col-span-1"}>
                    <ProductFilter special={special} categories={categories} />
                </div>
                <div className="px-4 col-span-1 md:col-span-2 lg:col-span-3">
                    <input
                        type="text"
                        id="search"
                        name="search"
                        className="w-full p-2 mb-4 border rounded-lg"
                        placeholder="Search..."
                        value={filters.name ?? ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            dispatch(setNameTo(value ? value : ""));
                        }}
                    />
                    <ProductList products={products} userId={user?.id}/>
                </div>
            </div>

            <div ref={loaderRef} className="loader" style={{textAlign: 'center', padding: '20px'}}>
            </div>
        </div>
    );
}

export default Page;
