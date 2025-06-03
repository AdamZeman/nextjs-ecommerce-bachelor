'use client'

import React, { useEffect } from 'react';

import ProductCard from "@/components/ProductCard";
import {GetProductsByCategoriesAndNameRow} from "@/db/goqueries/query_sql";

type PropsType = {
    id:string,
    h:string,
    products: GetProductsByCategoriesAndNameRow[],
}

function Carrousel ({ id, h, products }: PropsType) {
    useEffect(() => {
        const setupArrow = (el:string, container:string, percentage:number) => {
            const element = document.getElementById(el);
            if (element) {
                element.addEventListener('click', function() {
                    const containerEl = document.getElementById(container);
                    if (containerEl) {
                        const displace = window.innerWidth * (percentage / 100);
                        containerEl.scrollBy({
                            left: displace,
                            behavior: 'smooth'
                        });
                    }
                });
            }
        };

        setupArrow(`left-arrow-${id}`, `scroll-container-${id}`, -100);
        setupArrow(`right-arrow-${id}`, `scroll-container-${id}`, 100);

        return () => {
            const leftArrow = document.getElementById(`left-arrow-${id}`);
            const rightArrow = document.getElementById(`right-arrow-${id}`);

            if (leftArrow) {
                leftArrow.replaceWith(leftArrow.cloneNode(true));
            }
            if (rightArrow) {
                rightArrow.replaceWith(rightArrow.cloneNode(true));
            }
        };
    }, [id]);

    return (
        <div className="py-1">
            <div className="relative flex items-center gap-6">
                <div
                    id={`left-arrow-${id}`}
                    className="z-20 absolute m-1 rounded-xl arrow p-4 text-white content-center left-6 h-1/3 transition-opacity duration-300 hover:opacity-100 opacity-50  cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </div>

                <div
                    id={`scroll-container-${id}`}
                    className={`flex gap-8 overflow-x-auto overflow-hidden whitespace-nowrap flex-1 scrollbar-hide space-x-1 h-${h}`}
                >
                    {products.map((item, index) => (
                        <ProductCard item={item} userId={null} key={index}/>
                    ))}
                </div>

                <div
                    id={`right-arrow-${id}`}
                    className="z-20 absolute m-1 rounded-xl arrow p-4 text-white content-center right-6 h-1/3 transition-opacity duration-300 hover:opacity-100 opacity-50  cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Carrousel;