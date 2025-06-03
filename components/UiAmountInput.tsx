'use client';
import React from 'react';

type PropsType = {
    amount: number;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
};

function UiAmountInput({amount, setAmount}:PropsType) {

    const changeQuantity = (delta: number) => {
        setAmount(prev => {
            const newVal = prev + delta;
            return newVal >= 1 ? newVal : 1;
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 1;
        setAmount(value < 1 ? 1 : value);
    };

    return (
        <div className="w-1/2 flex flex-col gap-2">
            <h1 className="text-gray-600">Amount</h1>
            <div className="flex items-center">
                <button
                    type="button"
                    className="w-8 h-8 bg-white border border-gray-800 text-gray-800 text-lg font-bold flex justify-center items-center hover:opacity-80"
                    onClick={() => changeQuantity(-1)}
                >
                    -
                </button>

                <input
                    type="number"
                    name="amount"
                    className="w-12 h-8 bg-white text-center text-lg border border-white"
                    value={amount}
                    min={1}
                    onChange={handleInputChange}
                />

                <button
                    type="button"
                    className="w-8 h-8 bg-white border border-gray-800 text-gray-800 text-lg font-bold flex justify-center items-center hover:opacity-80"
                    onClick={() => changeQuantity(+1)}
                >
                    +
                </button>
            </div>
        </div>
    );
}

export default UiAmountInput
