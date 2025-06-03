import React, { useState, useEffect } from 'react';
import EditVariantForm from "@/components/iomVariant/EditVariantForm";
import AddVariant from "@/components/iomVariant/AddVariant";
import {GetVariantsFilledProductsRow} from "@/db/goqueries/query_sql";
import {formatPrice} from "@/lib/shared";
import Modal from "@/components/Modal";

function VariantManagement() {
    const [variants, setVariants] = useState< GetVariantsFilledProductsRow[]>([]);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [selectedVariant, setSelectedVariant] = useState<GetVariantsFilledProductsRow | null>(null);

    const fetchInitial = async () => {
        const res = await fetch(`/api/iom/variant/ShowVariants`, {
            method: 'GET'
        });
        const data = await res.json();
        setVariants(data.variants)
    };

    const handleAddClick = () => {
        setShowAddForm(true);
        setSelectedVariant(null);
    };

    const handleRowClick = (variant:GetVariantsFilledProductsRow) => {
        setSelectedVariant(variant);
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
                        {selectedVariant ? (
                            <EditVariantForm
                                variant={selectedVariant}
                                onClose={() => setShowAddForm(false)}
                                setVariants={setVariants}
                            />
                        ) : (
                            <AddVariant
                                onClose={() => setShowAddForm(false)}
                                setVariants={setVariants}
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
                        <th scope="col" className="px-6 py-3">Product Name</th>
                        <th scope="col" className="px-6 py-3">SKU</th>
                        <th scope="col" className="px-6 py-3">Stock Quantity</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Option 1 Value</th>
                        <th scope="col" className="px-6 py-3">Option 2 Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {variants?.map((variant) => (
                            <tr
                                key={variant.id}
                                className="bg-white border-b hover:bg-masala-950 hover:border-gray-700 hover:text-white border-gray-200 transition duration-200 cursor-pointer"
                                onClick={() => handleRowClick(variant)}
                            >
                                <th scope="row" className="px-6 py-4 font-medium">
                                    {variant.id}
                                </th>
                                <td className="px-6 py-4">{variant.name}</td>
                                <td className="px-6 py-4">{variant.sku}</td>
                                <td className="px-6 py-4">{variant.stockQuantity}</td>
                                <td className="px-6 py-4">{formatPrice(variant.price)}</td>
                                <td className="px-6 py-4">{variant.option_1Value}</td>
                                <td className="px-6 py-4">{variant.option_2Value}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VariantManagement;