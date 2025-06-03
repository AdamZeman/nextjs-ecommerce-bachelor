'use client'
import React, { useState, useEffect } from 'react';
import {GetOrdersFillUserConvByStatusRow} from "@/db/goqueries/query_sql";
import {formatPrice} from "@/lib/shared";
import {useSession} from "next-auth/react";


function PendingOrderManagement() {
    const [orders, setOrders] = useState<GetOrdersFillUserConvByStatusRow[]>([]);
    const { data: session } = useSession();
    const user = session?.user ;

    const fetchInitial = async () => {
        try {
            const res = await fetch('/api/iom/pendingOrder/ShowOrder');
            const data = await res.json();
            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleMarkAsDone = async (orderId:number) => {
        try {
            const response = await fetch('/api/iom/pendingOrder/EditOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: orderId })
            });

            if (response.ok) {
                setOrders(orders.filter(order => order.id !== orderId));
            }
        } catch (error) {
            console.error('Error marking order as done:', error);
        }
    };

    const handleOpenIssue = async (orderId:number) => {
        try {
            const res = await fetch('/api/orders/OpenIssue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: orderId,
                    userId: user?.id
                }),
            });
            if (res.ok) {
                setOrders(orders.filter(order => order.id !== orderId));
            }

        } catch (error) {
            console.error('Error marking order as done:', error);
        }
    };


    useEffect(() => {
        fetchInitial();
    }, []);

    return (
        <div className="relative flex flex-col flex-1 p-4 gap-4">
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-600">
                    <thead className="text-xs text-gray-100 uppercase bg-masala-950">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3">User Email</th>
                        <th scope="col" className="px-6 py-3">Total Price</th>
                        <th scope="col" className="px-6 py-3">Mark as Done</th>
                        <th scope="col" className="px-6 py-3">Open Issue</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders?.map((order) => (
                        <tr key={order.id} className="bg-white border-b border-gray-200 transition duration-200">
                            <input
                                type="hidden"
                                id={`id-${order.id}`}
                                name="id"
                                value={order.id}
                            />

                            <th scope="row" className="px-6 py-4 font-medium">
                                {order.id}
                            </th>
                            <td className="px-6 py-4">{order.email}</td>
                            <td className="px-6 py-4">{formatPrice(order.totalPrice)}</td>

                            <td className="px-6 py-4">
                                <button
                                    type="button"
                                    className="bg-masala-950 text-white px-6 py-2 hover:opacity-80 transition duration-200"
                                    onClick={() => handleMarkAsDone(order.id)}
                                >
                                    Mark as Done
                                </button>
                            </td>

                            <td className="px-6 py-4">
                                {order.status !== 'issue' ? (
                                    <button
                                        type="button"
                                        className="rounded-full px-2 py-1 bg-masala-950 text-white hover:opacity-80 cursor-pointer"
                                        onClick={() => handleOpenIssue(order.id)}
                                    >
                                        Open Issue
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        disabled
                                        className="rounded-full px-2 py-1 bg-yellow-600 text-white hover:opacity-80"
                                    >
                                        Issue Opened
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PendingOrderManagement;