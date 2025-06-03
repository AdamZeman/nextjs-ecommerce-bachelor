'use client'
import React, {useEffect, useState} from 'react';
import {GetOrderItemsByOrderIDRow, GetOrdersFillUserByStatusRow} from "@/db/goqueries/query_sql";
import {formatPrice} from "@/lib/shared";

type PropsType = {
    order : GetOrdersFillUserByStatusRow,
    onClose :  () => void,
    setOrders : React.Dispatch<React.SetStateAction<GetOrdersFillUserByStatusRow[]>>
}

function EditOrder({ order, onClose, setOrders}:PropsType) {
    const [formData, setFormData] = useState<{status:string, orderItems: GetOrderItemsByOrderIDRow[]}>({
        status: order.status,
        orderItems: []
    });

    const statuses = ["pending", "issue", "done"];


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/iom/order/ShowOrderItems',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id:order.id
                    }),
                });
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    orderItems: data.orderItems
                }));

            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();

    }, []);

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditProduct = async () => {
        const newItem ={
            id: order.id,
            ...formData
        }
        const res = await fetch(`/api/iom/order/EditOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        if (res.ok){
            setOrders((prevItems) =>
                prevItems.map((item) =>
                    item.id === newItem.id ? { ...item, ...newItem } : item
                )
            );
            onClose()
        }
    };

    return (
        <div className="bg-white p-8 shadow-md max-w-2xl w-[600px] rounded-xl">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">View Order</h2>
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

                {/* Status Section */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Status</h3>
                    <div className="flex gap-3 items-center w-full text-sm font-medium rounded-lg sm:flex">
                        {statuses.map((item) => (
                            <label
                                key={item}
                                htmlFor={`radio-${item}`}
                                className={`flex items-center ps-3 py-3 w-full bg-hawaiian-tan-50 text-sm cursor-pointer border-[1px] rounded-lg transition-all duration-300 ${
                                    formData.status === item
                                        ? "border-hawaiian-tan-700 text-hawaiian-tan-700"
                                        : "border-white"
                                } hover:border-hawaiian-tan-700`}
                            >
                                <input
                                    id={`radio-${item}`}
                                    type="radio"
                                    checked={formData.status === item}
                                    value={item}
                                    name="status"
                                    className="absolute opacity-0 h-0 w-0"
                                    onChange={handleChange}
                                />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Order Items Section */}
                <div className="flex flex-1 gap-4 flex-col mb-4 overflow-y-scroll max-h-[400px]">
                    {formData.orderItems.map((orderItem) => (
                        <div
                            key={orderItem.id}
                            id={`orderItem-${orderItem.id}`}
                            className="flex flex-1 gap-4 p-4 border border-gray-200 rounded-xl"
                        >
                            <div className="w-16">
                                <img
                                    src={`https://picsum.photos/seed/${orderItem.productId}/200/200`}
                                    alt={orderItem.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                            </div>
                            <div className="flex flex-1 flex-col text-xs">
                                <div className="flex flex-col">
                                    <h1>{orderItem.name}</h1>
                                </div>
                                <div className="flex flex-1 justify-between">
                                    <div className="flex flex-col">
                                        <h1 className="text-gray-600">Price</h1>
                                        <h1>{formatPrice(orderItem.price)}</h1>
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-gray-600">{orderItem.option_1Name}</h1>
                                        <h1>{orderItem.option_1Value}</h1>
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-gray-600">{orderItem.option_2Name}</h1>
                                        <h1>{orderItem.option_2Value}</h1>
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-gray-600">Quantity</h1>
                                        <h1>{orderItem.quantity}</h1>
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-gray-600">Total Price</h1>
                                        <h1>{formatPrice(orderItem.price, orderItem.quantity)}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-end">

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

export default EditOrder;