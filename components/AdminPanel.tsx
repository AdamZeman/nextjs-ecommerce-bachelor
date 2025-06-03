'use client'
import React from 'react';

type PropsType = {
    setActiveView :  React.Dispatch<React.SetStateAction<string>>,
}

function AdminPanel ({setActiveView}:PropsType){

    const SingleButton = ({ view, name }: {view:string, name:string}) => {
        return (
            <button
                onClick={() => setActiveView(view)}
                className={`group relative flex items-center px-4 py-3 w-full text-left border-[1px] transition-all duration-300 overflow-hidden
                  ${'border-white bg-white hover:border-gray-800'}`}
                    >
                <span className={`w-3 h-3 border-[1px] border-gray-800 mr-3 
                  ${''}`}></span>
                        <span className={`text-sm transition-colors duration-300
                  ${'text-black group-hover:text-gray-800'}`}>
                  {name}
                </span>
            </button>
        );
    };

    return (
        <div className="flex flex-col bg-masala-50 p-6 rounded-md w-[300px] gap-8">
            <div>
                <h2 className="text-lg font-semibold text-black border-b border-gray-700 pb-2 mb-4">
                    Product
                </h2>
                <div className="flex flex-col gap-2">
                    <SingleButton view="productManagement" name="Product Management" />
                    <SingleButton view="variantManagement" name="Variant Management" />
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold text-black border-b border-gray-700 pb-2 mb-4">
                    Category
                </h2>
                <div className="flex flex-col gap-2">
                    <SingleButton view="categoryManagement" name="Category Management" />
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold text-black border-b border-gray-700 pb-2 mb-4">
                    Special
                </h2>
                <div className="flex flex-col gap-2">
                    <SingleButton view="specialManagement" name="Special Tags Management" />
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold text-black border-b border-gray-700 pb-2 mb-4">
                    Orders
                </h2>
                <div className="flex flex-col gap-2">
                    <SingleButton view="orderManagement" name="Order Management" />
                    <SingleButton view="pendingOrders" name="Pending Orders" />
                    <SingleButton view="openDisputes" name="Open Disputes" />
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;