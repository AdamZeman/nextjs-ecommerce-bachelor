import React, { useState, useEffect } from 'react';
import EditCategory from "@/components/iomCategory/EditCategory";
import AddCategory from "@/components/iomCategory/AddCategory";
import {GetCategoriesRow} from "@/db/goqueries/query_sql";
import Modal from "@/components/Modal";

function CategoryManagement() {
    const [categories, setCategories] = useState<GetCategoriesRow[]>([]);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<GetCategoriesRow | null>(null);

    const fetchInitial = async () => {
        try {
            const res = await fetch('/api/iom/category/ShowCategories');
            const data = await res.json();
            setCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddClick = () => {
        setShowAddForm(true);
        setSelectedCategory(null);
    };

    const handleRowClick = (category:GetCategoriesRow) => {
        setSelectedCategory(category);
        setShowAddForm(true);
    };

    useEffect(() => {
        fetchInitial();
    }, []);


    return (
        <div className="relative flex flex-col flex-1 p-4 gap-4">
            {showAddForm && (
                <div className="absolute right-0 top-0 z-10" id="addition">
                    <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
                        {selectedCategory ? (
                            <EditCategory
                                onClose={() => setShowAddForm(false)}
                                setCategories={setCategories}
                                category={selectedCategory}
                            />
                        ) : (
                            <AddCategory
                                onClose={() => setShowAddForm(false)}
                                setCategories={setCategories}
                            />
                        )}
                    </Modal>
                </div>
            )}

            <div className="flex gap-4 justify-end items-center">
                <button
                    onClick={handleAddClick}
                    className="flex font-medium text-sm px-5 py-2.5 text-white bg-masala-950 transition-all duration-300 overflow-hidden rounded-lg"
                >
                    Add
                </button>
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-600">
                    <thead className="text-xs text-gray-100 uppercase bg-masala-950">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3">Category Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((category) => (
                        <tr
                            key={category.id}
                            className="bg-white border-b hover:bg-masala-950 hover:border-gray-700 hover:text-white border-gray-200 transition duration-200 cursor-pointer"
                            onClick={() => handleRowClick(category)}
                        >
                            <input
                                type="hidden"
                                id={`id-${category.id}`}
                                name="id"
                                value={category.id}
                            />
                            <th scope="row" className="px-6 py-4 font-medium">
                                {category.id}
                            </th>
                            <td className="px-6 py-4">{category.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CategoryManagement;