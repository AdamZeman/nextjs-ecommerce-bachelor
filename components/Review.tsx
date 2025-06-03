'use client'
import React from 'react';
import {GetReviewsFillUserByProductIDRow} from "@/db/goqueries/query_sql";
import Image from 'next/image';


type PropsType = {
    review: GetReviewsFillUserByProductIDRow;
};

const Review = ({ review }:PropsType) => {
    const renderStars = (index:number, filled:boolean) => {
        const stars = [];
        for (let i = 0; i < index; i++) {
            stars.push(
                <span
                    key={i}
                    className={`text-lg ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
                >
          &#9733;
        </span>
            );
        }
        return stars;
    };

    return (
        <div className="p-6 hover transition duration-300 ease-in-out hover:-translate-y-4 border rounded-lg">
            <div className="flex justify-between">
                <div className="flex gap-4 mb-4">
                    <Image
                        src={review.avatarUrl || ''}
                        className="w-full object-cover h-10 rounded-full"
                        alt="user avatar"
                        width={96}
                        height={96}
                    />
                    <div>
                        <div className="text-lg">{review.name}</div>
                        <div className="text-gray-500 text-sm">{review.email}</div>
                    </div>
                </div>
                <div className="flex">
                    {renderStars(review.rating, true)}
                    {renderStars(5 - review.rating, false)}
                </div>
            </div>

            <div className="text-gray-800 text-sm">
                {review.content}
            </div>
        </div>
    );
};

export default Review;