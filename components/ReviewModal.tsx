import React, { useState } from 'react';

interface ReviewModalProps {
    productID: number;
    onClose: () => void;
}

function ReviewModal ({ productID, onClose}:ReviewModalProps) {
    const [rating, setRating] = useState('5');
    const [content, setContent] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/api/orders/AddReview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: productID,
                rating: rating,
                content: content,
            }),
        });

        if (res.ok){
            onClose()
        }
    };
    return (
        <div className="bg-white p-8 shadow-md max-w-2xl w-[600px] rounded-xl">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Add Review</h2>
                <button
                    onClick={onClose}
                    className="flex p-5 bg-masala-950 transition-all duration-300 overflow-hidden rounded-full relative justify-center items-center text-white hover:opacity-75"
                >
                    <span className="absolute font-normal text-lg">X</span>
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    id="product-id"
                    name="product-id"
                    value={productID}
                    hidden
                    readOnly
                />

                <div className="flex gap-3 items-center w-full text-sm font-medium rounded-lg sm:flex mb-4">
                    {['1', '2', '3', '4', '5'].map((item) => (
                        <label
                            key={item}
                            className={`flex items-center justify-center p-5 w-full bg-orange-200 text-orange-900 text-sm cursor-pointer border-[1px] border-white rounded-2xl transition-all duration-300 hover:border-orange-900 ${
                                rating === item ? 'border-orange-900' : ''
                            }`}
                        >
                            <input
                                id={`radio-${item}`}
                                type="radio"
                                value={item}
                                checked={rating === item}
                                onChange={() => setRating(item)}
                                required
                                className="absolute opacity-0 h-0 w-0"
                            />
                            {item}
                        </label>
                    ))}
                </div>

                <div className="mb-6">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-[300px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter Review"
                        required
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-hunter-green-400 text-hunter-green-950 font-medium px-6 py-2 hover:opacity-80 transition duration-200 rounded-lg"
                    >
                        Create review
                    </button>
                </div>
            </form>
        </div>

    );
};

export default ReviewModal;