'use client'
import React from 'react';

import ProductCard from "@/components/ProductCard";
import {
    GetProductsByCategoriesAndNameRow
} from "@/db/goqueries/query_sql";

type PropsType = {
    products: GetProductsByCategoriesAndNameRow[] | undefined;
    userId: number | undefined;
};

function ProductList({products, userId}:PropsType) {

    return (
        <div id="product_container"
             className="flex flex-wrap md:justify-normal justify-center transform duration-500 gap-4">
            {products?.map((item, index) => (
                <ProductCard item={item} userId={userId} key={index}/>
            ))}
        </div>
    );

}

export default ProductList;