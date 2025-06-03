import React, { useState } from 'react';
import {GetVariantsFilledProductsRow} from "@/db/goqueries/query_sql";

type PropsType = {
    variant :  GetVariantsFilledProductsRow,
    setVariants:  React.Dispatch<React.SetStateAction<GetVariantsFilledProductsRow[]>>
    onClose :  () => void,
}

function EditVariantForm({ variant, onClose, setVariants}: PropsType) {
    const [formData, setFormData] = useState({
        sku: variant.sku,
        stockQuantity: variant.stockQuantity,
        price: variant.price,
        option_1Value: variant.option_1Value,
        option_2Value: variant.option_2Value
    });

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditProduct = async () => {
        const newItem ={
            id: variant.id,
            name: variant.name,
            ...formData
        }
        const res = await fetch(`/api/iom/variant/EditVariant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        if (res.ok){
            setVariants((prevItems) =>
                prevItems?.map((item) =>
                    item.id === newItem.id ? { ...item, ...newItem } : item
                )
            );
            onClose()
        }
    };

    const handleDelete = async () => {
        const res = await fetch(`/api/iom/variant/DeleteVariant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                variantId : variant.id
            }),
        });

        if (res.ok){
            setVariants((prevItems) => prevItems?.filter((item) => item.id !== variant.id));
            onClose()
        }
    };

    return (
        <div className="bg-white p-8 shadow-md max-w-2xl w-[600px] rounded-xl">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Edit Variant</h2>
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
                <input
                    type="hidden"
                    id="variant-id"
                    name="variant-id"
                    value={variant.id}
                />

                {/* Variant SKU */}
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

                {/* Stock Quantity */}
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
                        placeholder="Enter variant stock quantity"
                        required
                    />
                </div>

                {/* Price */}
                <div className="mb-6">
                    <label htmlFor="variant-price" className="block text-sm font-medium text-gray-700 mb-2">
                        Variant Price
                    </label>
                    <input
                        type="number"
                        id="variant-price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter variant price"
                        step="0.01"
                        required
                    />
                </div>

                {/* Option 1 */}
                <div className="mb-6">
                    <label htmlFor="variant-option1-value" className="block text-sm font-medium text-gray-700 mb-2">
                        Variant Option 1
                    </label>
                    <input
                        type="text"
                        id="variant-option1-value"
                        name="option1Value"
                        value={formData.option_1Value}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter variant option 1"
                        required
                    />
                </div>

                {/* Option 2 */}
                <div className="mb-6">
                    <label htmlFor="variant-option2-value" className="block text-sm font-medium text-gray-700 mb-2">
                        Variant Option 2
                    </label>
                    <input
                        type="text"
                        id="variant-option2-value"
                        name="option2Value"
                        value={formData.option_2Value}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter variant option 2"
                        required
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-end">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-600 text-white font-medium px-6 py-2 hover:opacity-80 transition duration-200 rounded-lg"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="bg-hunter-green-400 text-hunter-green-950 font-medium px-6 py-2 hover:opacity-80 transition duration-200 rounded-lg"
                        onClick={handleEditProduct}
                    >
                        Confirm Edit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditVariantForm;