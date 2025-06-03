import React, { useState, useEffect } from 'react';
import EditProductForm from "@/components/iomProduct/EditProduct";
import AddProduct from "@/components/iomProduct/AddProduct";
import ProductCategory from "@/components/iomProduct/ProductCategory";
import {GetProductsRow} from "@/db/goqueries/query_sql";
import {formatPrice} from "@/lib/shared";
import Modal from "@/components/Modal";


function ProductManagement() {
    const [products, setProducts] = useState<GetProductsRow[]>();
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<GetProductsRow | null>(null);
    const [toChooseCategory, setToChooseCategory] = useState<boolean>(false);

    const fetchInitial = async () => {
        const res = await fetch(`/api/iom/product/ShowProducts`, {
            method: 'GET'
        });
        const data = await res.json();
        setProducts(data.products)
    };

    const handleAddClick = () => {
        setShowAddForm(true);
        setSelectedProduct(null);
    };

    const handleRowClick = (product:GetProductsRow) => {
        setSelectedProduct(product);
        setShowAddForm(true);
    };

    const onClose = () => {
        setShowAddForm(false)
        setToChooseCategory(false)
    }

    useEffect(() => {
        fetchInitial();
    }, []);

    return (
        <div className="relative flex flex-col flex-1 p-4 gap-4">
            {showAddForm && (
                <div className="absolute right-0 top-0 z-10" id="addition">

                    <Modal isOpen={showAddForm} onClose={onClose}>
                        {selectedProduct ? (
                            toChooseCategory ? (
                                    <ProductCategory
                                        product={selectedProduct}
                                        onClose={onClose}
                                    />
                                ): (
                                    <EditProductForm
                                        product={selectedProduct}
                                        onClose={onClose}
                                        setProducts={setProducts}
                                        setToChooseCategory={setToChooseCategory}
                                    />
                                )

                        ) : (
                            <AddProduct
                                onClose={() => setShowAddForm(false)} setProducts={setProducts}
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
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Description</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Option 1 Name</th>
                        <th scope="col" className="px-6 py-3">Option 2 Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products?.map((product) => (
                        <tr
                            key={product.id}
                            className="bg-white border-b hover:bg-masala-950 hover:border-gray-700 hover:text-white border-gray-200 transition duration-200 cursor-pointer"
                            onClick={() => handleRowClick(product)}
                        >
                            <th scope="row" className="px-6 py-4 font-medium">
                                {product.id}
                            </th>
                            <td className="px-6 py-4">{product.name}</td>
                            <td className="px-6 py-4">{product.description}</td>
                            <td className="px-6 py-4">{formatPrice(product.price)}</td>
                            <td className="px-6 py-4">{product.option_1Name}</td>
                            <td className="px-6 py-4">{product.option_2Name}</td>
                        </tr>
                    ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductManagement;