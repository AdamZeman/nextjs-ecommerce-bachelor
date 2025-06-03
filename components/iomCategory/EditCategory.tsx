import React, { useState } from 'react';
import {GetCategoriesRow} from "@/db/goqueries/query_sql";

type PropsType = {
    onClose : () => void,
    setCategories :  React.Dispatch<React.SetStateAction<GetCategoriesRow[]>>,
    category:GetCategoriesRow
}


function EditCategory({ category, onClose, setCategories}:PropsType) {
    const [formData, setFormData] = useState({
        name: category.name,
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
            id: category.id,
            ...formData
        }
        const res = await fetch(`/api/iom/category/EditCategory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        if (res.ok){
            setCategories((prevItems) =>
                prevItems.map((item) =>
                    item.id === newItem.id ? { ...item, ...newItem } : item
                )
            );
            onClose()
        }
    };

    const handleDelete = async () => {
        const res = await fetch(`/api/iom/category/DeleteCategory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                categoryId : category.id
            }),
        });

        if (res.ok){
            setCategories((prevItems) => prevItems.filter((item) => item.id !== category.id));
            onClose()
        }
    };

    return (
        <div className="bg-white p-8 shadow-md max-w-2xl w-[600px] rounded-xl">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Edit Category</h2>
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
                    <label htmlFor="variant-option1-value" className="block text-sm font-medium text-gray-700 mb-2">
                        Category Name
                    </label>
                    <input
                        type="text"
                        id="variant-option1-value"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter variant option 1"
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

export default EditCategory;