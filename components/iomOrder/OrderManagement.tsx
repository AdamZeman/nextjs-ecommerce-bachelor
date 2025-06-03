import React, { useState, useEffect } from 'react';
import EditOrder from "@/components/iomOrder/EditOrder";
import {GetOrdersFillUserByStatusRow} from "@/db/goqueries/query_sql";
import {formatPrice} from "@/lib/shared";
import Modal from "@/components/Modal";

function OrderManagement() {
    const [orders, setOrders] = useState<GetOrdersFillUserByStatusRow[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<GetOrdersFillUserByStatusRow | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);

    const fetchInitial = async () => {
        try {
            const res = await fetch('/api/iom/order/ShowOrders');
            const data = await res.json();
            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    useEffect(() => {
        fetchInitial();
    }, []);

    const handleRowClick = async (order:GetOrdersFillUserByStatusRow) => {
        setSelectedOrder(order);
        setShowEditForm(true);
    };
    return (
        <div className="relative flex flex-col flex-1 p-4 gap-4">
            {showEditForm && selectedOrder && (
                <div className="absolute right-0 top-0 z-10" id="addition">
                    <Modal isOpen={showEditForm} onClose={() => setShowEditForm(false)}>
                        <EditOrder
                            onClose={() => setShowEditForm(false)}
                            setOrders={setOrders}
                            order={selectedOrder}
                        />
                    </Modal>
                </div>
            )}

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-600">
                    <thead className="text-xs text-gray-100 uppercase bg-masala-950">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3">User Email</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Total Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr
                            key={order.id}
                            className="bg-white border-b hover:bg-masala-950 hover:border-gray-700 hover:text-white border-gray-200 transition duration-200 cursor-pointer"
                            onClick={() => handleRowClick(order)}
                        >
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
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">{formatPrice(order.totalPrice)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderManagement;