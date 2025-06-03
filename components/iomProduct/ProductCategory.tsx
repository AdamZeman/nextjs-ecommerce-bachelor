import React, {useEffect, useState} from 'react';
import {GetCategoriesFilteredProductIDRow, GetProductsRow} from "@/db/goqueries/query_sql";


function CategoryButton({ productId, category}:{productId: number, category: GetCategoriesFilteredProductIDRow}) {
    const [isActive, setIsActive] = useState<boolean>(category.hasProduct);

    const handleClick = async () => {
        try {
            const res = await fetch(`/api/iom/product/CategorySwitch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId : productId,
                    categoryId : category.id,
                    isTrue: !isActive
                }),
            });

            if (res.ok) {
                setIsActive(!isActive);
            }
        } catch (error) {
            console.error('Error toggling category:', error);
        }
    };

    return (
        <tr
            className={`${isActive ? 'bg-green-300' : 'bg-white'} border-b hover:bg-masala-950 hover:border-gray-700 hover:text-white border-gray-200 transition duration-200 cursor-pointer`}
            onClick={handleClick}
        >
            <th scope="row" className="px-6 py-4 font-medium">
                {category.id}
            </th>
            <td className="px-6 py-4">
                {category.name}
            </td>
        </tr>
    );
}

type PropsType = {
    product : GetProductsRow,
    onClose :  () => void,
}

function ProductCategory({ product, onClose }:PropsType) {
    const [localCategories, setLocalCategories] = useState<GetCategoriesFilteredProductIDRow[]>([]);

    const fetchInitial = async () => {
        const res = await fetch(`/api/iom/product/ShowProductCategories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId : product.id
            }),

        });
        const data = await res.json();
        setLocalCategories(data.categories)
    };

    useEffect(() => {
        fetchInitial();
    }, []);

    return (
        <div className="bg-white p-8 shadow-md max-w-2xl w-[600px] rounded-xl">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Edit Product Categories</h2>
                <button
                    onClick={onClose}
                    className="flex p-5 bg-masala-950 transition-all duration-300 overflow-hidden rounded-full relative justify-center items-center text-white hover:opacity-75"
                >
                    <span className="absolute font-normal text-lg">
                        X
                    </span>
                </button>
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-600">
                    <thead className="text-xs text-gray-100 uppercase bg-masala-950">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3">Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    <input
                        type="hidden"
                        id={`product-id-${product.id}`}
                        name="product-id"
                        value={product.id}
                    />
                    {localCategories.map(category => (
                        <CategoryButton
                            key={category.id}
                            productId={product.id}
                            category={category}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductCategory;