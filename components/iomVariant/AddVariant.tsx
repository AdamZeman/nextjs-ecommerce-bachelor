'use client'
import React, {useEffect, useState} from 'react';
import {GetProductsRow, GetVariantsFilledProductsRow} from "@/db/goqueries/query_sql";

type PropsType = {
    setVariants:  React.Dispatch<React.SetStateAction<GetVariantsFilledProductsRow[]>>
    onClose :  () => void,
}

function AddVariant({onClose, setVariants }:PropsType) {
    const [products, setProducts] = useState< GetProductsRow[]>()

    const [formData, setFormData] = useState({
        productId: '',
        sku: '',
        stockQuantity: '',
        price: '',
        option_1Value: '',
        option_2Value: ''
    });

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddProduct = async () => {
        const newItem:GetVariantsFilledProductsRow ={
            ...formData,
            productId: parseInt(formData.productId),
            price: parseInt(formData.price),
            stockQuantity: parseInt(formData.stockQuantity),
            id: 0,
            id_2: 0,
            name : "",
            description: "",
            createdAt: new Date(),
            createdAt_2: new Date(),
            price_2: 0,
            special: 0,
            option_1Name: "",
            option_2Name: ""
        }
        const res = await fetch(`/api/iom/variant/AddVariant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        if (res.ok){
            setVariants((prevItems) => [...prevItems, newItem]);
            onClose()
        }
    };

    const fetchInit = async () =>{
        const res = await fetch("/api/iom/products/ShowProducts")
        const data = await res.json();
        setProducts(data.variants)
    }

    useEffect(() => {
        fetchInit()
    }, []);

    return (
        <div className="bg-white p-8 shadow-md max-w-2xl w-[600px] rounded-xl">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Add Variant</h2>
                <button
                    onClick={onClose}
                    className="flex p-5 bg-masala-950 transition-all duration-300 overflow-hidden rounded-full relative justify-center items-center text-white hover:opacity-75"
                >
                    <span className="absolute font-normal text-lg">
                        X
                    </span>
                </button>
            </div>

            <form >
                <div className="mb-6">
                    <label htmlFor="product-id" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Product
                    </label>
                    <select
                        id="product-id"
                        name="productId"
                        value={formData.productId}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                    >
                        <option value="">Choose a product</option>
                        {products?.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="variant-sku" className="block text-sm font-medium text-gray-700 mb-2">
                        Variant SKU
                    </label>
                    <input
                        type="text"
                        id="variant-sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter variant sku"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="variant-stock-quantity" className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity
                    </label>
                    <input
                        type="number"
                        id="variant-stock-quantity"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter stock quantity"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="variant-price" className="block text-sm font-medium text-gray-700 mb-2">
                        Price (in cents)
                    </label>
                    <input
                        type="number"
                        id="variant-price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter price"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="variant-option1-value" className="block text-sm font-medium text-gray-700 mb-2">
                        Option 1 Value
                    </label>
                    <input
                        type="text"
                        id="variant-option1-value"
                        name="option_1Value"
                        value={formData.option_1Value}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter option 1 value"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="variant-option2-value" className="block text-sm font-medium text-gray-700 mb-2">
                        Option 2 Value
                    </label>
                    <input
                        type="text"
                        id="variant-option2-value"
                        name="option_2Value"
                        value={formData.option_2Value}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter option 2 value"
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-hunter-green-400 text-hunter-green-950 font-medium px-6 py-2 hover:opacity-80 transition duration-200 rounded-lg"
                        onClick={handleAddProduct}
                    >
                        Create Variant
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddVariant;