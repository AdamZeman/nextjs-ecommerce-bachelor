import React, {useEffect, useState} from 'react';
import {GetProductsRow, GetSpecialRow} from "@/db/goqueries/query_sql";

type PropsType = {
    product: GetProductsRow,
    setProducts:  React.Dispatch<React.SetStateAction<GetProductsRow[] | undefined>>,
    onClose :  () => void,
    setToChooseCategory:  React.Dispatch<React.SetStateAction<boolean>>,
}


function EditProduct({ product, onClose, setProducts, setToChooseCategory}: PropsType) {

    const [specials, setSpecials] = useState<GetSpecialRow[]>([])
    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description,
        price: product.price,
        option_1Name: product.option_1Name,
        option_2Name: product.option_2Name,
        special:product.special
    });

    const fetchInitial = async () => {
        const res = await fetch(`/api/iom/special/ShowSpecials`, {
            method: 'GET'
        });
        const data = await res.json();
        setSpecials(data.specials)
    };

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditProduct = async () => {
        const newItem ={
            id: product.id,
            ...formData
        }
        const res = await fetch(`/api/iom/product/EditProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        if (res.ok){
            setProducts((prevItems) =>
                prevItems?.map((item) =>
                    item.id === newItem.id ? { ...item, ...newItem } : item
                )
            );
            onClose()
        }
    };

    const handleDelete = async () => {
        const res = await fetch(`/api/iom/product/DeleteProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId : product.id
            }),
        });

        if (res.ok){
            setProducts((prevItems) => prevItems?.filter((item) => item.id !== product.id));
            onClose()
        }
    };

    useEffect(() => {
        fetchInitial();
    }, []);


    return (
        <div className="bg-white p-8 shadow-md max-w-2xl w-[600px] rounded-xl">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Edit Product</h2>
                <button
                    onClick={onClose}
                    className="flex p-5 bg-masala-950 transition-all duration-300 overflow-hidden rounded-full relative justify-center items-center text-white hover:opacity-75"
                >
                    <span className="absolute font-normal text-lg">
                        X
                    </span>
                </button>
            </div>

            <form>

                {/* Name */}
                <div className="mb-6">
                    <label htmlFor="product-sku" className="block text-sm font-medium text-gray-700 mb-2">
                        Product name
                    </label>
                    <input
                        type="text"
                        id="product-sku"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter product sku"
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label htmlFor="product-stock-quantity" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <input
                        id="product-stock-quantity"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter product stock quantity"
                        required
                    />
                </div>

                {/* Price */}
                <div className="mb-6">
                    <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-2">
                        Product Price
                    </label>
                    <input
                        type="number"
                        id="product-price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter product price"
                        step="0.01"
                        required
                    />
                </div>

                {/* Option 1 */}
                <div className="mb-6">
                    <label htmlFor="product-option1-value" className="block text-sm font-medium text-gray-700 mb-2">
                        Product Option 1
                    </label>
                    <input
                        type="text"
                        id="product-option1-value"
                        name="option_1Name"
                        value={formData.option_1Name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter product option 1"
                        required
                    />
                </div>

                {/* Option 2 */}
                <div className="mb-6">
                    <label htmlFor="product-option2-value" className="block text-sm font-medium text-gray-700 mb-2">
                        Product Option 2
                    </label>
                    <input
                        type="text"
                        id="product-option2-value"
                        name="option_2Name"
                        value={formData.option_2Name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter product option 2"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="special"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Special Tag
                    </label>
                    <select
                        id="special"
                        name="special"
                        value={formData.special as number}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    >
                        <option value="">No Special Tag</option>
                        {specials?.map((item) => (
                            <option key={item.id} value={item.id} className="p-6">
                                {item.name}
                            </option>
                        ))}
                    </select>
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
                        className="bg-hawaiian-tan-300 text-hawaiian-tan-950 font-medium px-6 py-2 hover:opacity-80 transition duration-200 rounded-lg"
                        onClick={() => setToChooseCategory(true)}
                    >
                        Categories
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

export default EditProduct;