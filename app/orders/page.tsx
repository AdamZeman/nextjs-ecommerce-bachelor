'use client'
import React, {useEffect, useState} from 'react';
import {OrderFilled} from "@/types/next-auth";
import Modal from "@/components/Modal";
import ReviewModal from "@/components/ReviewModal";
import {GetOrderItemsByUserIdRow} from "@/db/goqueries/query_sql";
import {useSession} from "next-auth/react";
import {setBasketItems} from "@/redux/slices/basketSlice";
import {useDispatch} from "react-redux";

function OrdersPage() {
    const [orders, setOrders] = useState<OrderFilled[]>()
    const [showAddReview, setShowAddReview] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState< GetOrderItemsByUserIdRow>();
    const { data: session } = useSession();
    const user = session?.user ;
    const dispatch = useDispatch();


    const handleOpenAddReview = (order:GetOrderItemsByUserIdRow) =>{
        setSelectedOrder(order)
        setShowAddReview(true)
    }

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
                const data = await res.json();
                if (data.change) {
                    setOrders((prevState) =>
                        prevState?.map((orderFilled) => {
                            if (orderFilled.order.id === orderId) {
                                return {
                                    ...orderFilled,
                                    order: {
                                        ...orderFilled.order,
                                        status: 'issue',
                                    },
                                };
                            }
                            return orderFilled;
                        })
                    );
                }
            }
        } catch (error) {
            console.error('Error opening issue:', error);
        }
    };
    const fetchInitial = async () => {
        const res = await fetch(`/api/orders/ShowOrders`, {
            method: 'GET'
        });
        const data = await res.json();
        setOrders(data.ordersFilled)
    };

    const fetchBasket = async () => {
        const res = await fetch(`/api/basket/ShowBasket`, {
            method: 'GET'
        });
        const data = await res.json();
        if (res.ok) {
            dispatch(setBasketItems(data.basketItems))
        }
    };

    useEffect(() => {
        fetchInitial()
        fetchBasket();
    }, []);


    return (
        <div className="pb-4">

            <Modal isOpen={showAddReview} onClose={() => setShowAddReview(false)}>
                <ReviewModal productID={selectedOrder?.productId ?? 0}
                             onClose={() => setShowAddReview(false)}/>
            </Modal>

            <div className="flex gap-4 pb-6">
                <a
                    href="/orders"
                    className="w-1/3 font-bold text-gray-800 border-gray-800 border-b-2 pb-4 text-center hover:opacity-80 transition-all duration-300"
                >
                    Orders
                </a>
                <a
                    href="/favourites"
                    className="w-1/3 border-gray-200 border-b-2 pb-4 text-center hover:border-gray-800 transition-all duration-300"
                >
                    Favourites
                </a>
                <a
                    href="/rooms"
                    className="w-1/3 border-gray-200 border-b-2 pb-4 text-center hover:border-gray-800 transition-all duration-300"
                >
                    Messenger
                </a>
            </div>
            <div className="text-3xl font-bold pb-10">Orders</div>
            <div className="my-4 border-gray-200 border w-full"></div>
            <div className="flex gap-8 flex-wrap">
                {orders?.map((orderFilled) => {
                    const order = orderFilled.order;
                    const orderItems = orderFilled.orderItems;

                    return (
                        <div key={`order-${order.id}`} className="flex flex-col gap-4 p-4 border border-gray-200 rounded-xl">
                            <div className="flex gap-10">
                                <div className="text-xl text-gray-600">{`#${order.id}`}</div>
                                <div className="text-lg">{`$${(order.totalPrice / 100).toFixed(2)}`}</div>

                                {order.status !== "issue" ? (
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
                            </div>

                            <div className="flex flex-1 gap-4 flex-wrap">
                                {orderItems.map((orderItem, index) => (
                                    <div key={index}
                                         className="flex w-[500px] gap-4 p-4 border border-gray-200 rounded-xl">

                                        <div className="w-24 h-24">
                                            <img
                                                src={`https://picsum.photos/seed/${orderItem.productId}/200/200`}
                                                alt={orderItem.name}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col gap-4">
                                            <div className="flex justify-between">
                                                <a href={"/products/" + orderItem.productId}>
                                                    <h1 className="font-semibold">{orderItem.name}</h1>
                                                </a>

                                                <div className="group relative w-fit">
                                                    <div
                                                        className="bg-orange-200 text-orange-900 rounded-full p-1 text-xs max-w-6 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-xs group-hover:rounded-xl">
                                                        <button
                                                            onClick={() => handleOpenAddReview(orderItem)}
                                                            className="inline-block transition-opacity duration-300 group-hover:opacity-100 opacity-0 cursor-pointer">
                                                            Add Review
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="flex flex-1 justify-between">
                                                <div className="flex flex-col">
                                                    <h1 className="text-gray-600">Price</h1>
                                                    <h1>{`$${(orderItem.price / 100).toFixed(2)}`}</h1>
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
                                                    <h1>{`$${(orderItem.quantity * orderItem.price / 100).toFixed(2)}`}</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                                </div>
                                );
                            })}
            </div>
        </div>
    );
}

export default OrdersPage;