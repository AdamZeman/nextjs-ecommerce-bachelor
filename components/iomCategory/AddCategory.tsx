import React, { useState } from 'react';
import {GetCategoriesRow} from "@/db/goqueries/query_sql";

type PropsType = {
    onClose : () => void,
    setCategories :  React.Dispatch<React.SetStateAction<GetCategoriesRow[]>>
}

function AddCategory({ onClose, setCategories }:PropsType) {
    const [formData, setFormData] = useState({
        name:''
    });

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddProduct = async () => {
        const newItem: GetCategoriesRow ={
            id: 0,
            description: "",
            ...formData
        }
        const res = await fetch(`/api/iom/category/AddCategory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        if (res.ok){
            setCategories((prevItems) => [...prevItems, newItem]);
            onClose()
        }
    };

    return (
        <div className="bg-white p-8 shadow-md max-w-2xl w-[600px] rounded-xl">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Add Category</h2>
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
                    <label htmlFor="variant-sku" className="block text-sm font-medium text-gray-700 mb-2">
                        Category Tag Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter category name"
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-hunter-green-400 text-hunter-green-950 font-medium px-6 py-2 hover:opacity-80 transition duration-200 rounded-lg"
                        onClick={handleAddProduct}
                    >
                        Create Category
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddCategory;