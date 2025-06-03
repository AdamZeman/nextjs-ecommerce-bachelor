import React, {useEffect, useState} from 'react';
import {GetProductsRow, GetSpecialRow} from "@/db/goqueries/query_sql";

type PropsType = {
    setProducts:  React.Dispatch<React.SetStateAction<GetProductsRow[] | undefined>>
    onClose :  () => void,
}


function AddProduct({ onClose, setProducts } : PropsType) {
    const [specials, setSpecials] = useState<GetSpecialRow[]>([])
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        option_1Name: '',
        option_2Name: '',
        special: ''
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

    const handleAddProduct = async () => {
        const newItem:GetProductsRow  ={
            ...formData,
            id: 0,
            createdAt: new Date(),
            price: parseInt(formData.price),
            special: parseInt(formData.special),
        }
        const res = await fetch(`/api/iom/product/AddProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        if (res.ok){
            setProducts((prevItems) => [...prevItems ?? [], newItem]);
            onClose()
        }
    };

    useEffect(() => {
        fetchInitial();
    }, []);


    return (
        <div className="bg-white p-8 shadow-md max-w-2xl w-[600px] rounded-xl">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Add Product</h2>
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
                        value={formData.special}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    >
                        <option value="">No Special Tag</option>
                        {specials.map((item) => (
                            <option key={item.id} value={item.id} className="p-6">
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-hunter-green-400 text-hunter-green-950 font-medium px-6 py-2 hover:opacity-80 transition duration-200 rounded-lg"
                        onClick={handleAddProduct}
                    >
                        Create Product
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddProduct;