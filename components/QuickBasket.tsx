'use client'
import React from 'react';
import {GetBasketItemsByUserIdRow} from "@/db/goqueries/query_sql";
import {formatPrice} from "@/lib/shared";

type PropsType = {
    basketItems: GetBasketItemsByUserIdRow[];
};

function QuickBasket({ basketItems = []}:PropsType) {

    return (
        <div className="flex flex-1 gap-4 flex-col">
            {basketItems.length === 0 ? (
                <div className="text-gray-500">Empty basket</div>
            ) : (
                basketItems.map((basketItem) => (
                    <div
                        key={`basketItem-${basketItem.id}`}
                        className="flex gap-4 p-4 border border-gray-400 rounded-xl"
                    >
                        <div className="w-16">
                            <img
                                src={`https://picsum.photos/seed/${basketItem.productId}/200/200`}
                                alt={basketItem.sku}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                        </div>
                        <div className="flex flex-1 flex-col text-xs">
                            <div className="flex flex-col">
                                <h1 className="font-medium">{basketItem.name}</h1>
                            </div>
                            <div className="flex flex-1 justify-between">
                                <div className="flex flex-col">
                                    <h1 className="text-gray-400">Price</h1>
                                    <h1>{formatPrice(basketItem.price)}</h1>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-gray-400">{basketItem.option_1Name}</h1>
                                    <h1>{basketItem.option_1Value}</h1>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-gray-400">{basketItem.option_2Name}</h1>
                                    <h1>{basketItem.option_2Value}</h1>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-gray-400">Quantity</h1>
                                    <h1>{basketItem.quantity}</h1>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-gray-400">Total Price</h1>
                                    <h1>{formatPrice(basketItem.quantity * basketItem.price)}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default QuickBasket;