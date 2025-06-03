'use client'
import React from 'react';
import {GetReviewsFillUserByProductIDRow} from "@/db/goqueries/query_sql";

type PropsType = {
    reviews: GetReviewsFillUserByProductIDRow[];
};

function Rating({ reviews }:PropsType){

    const calculateReviewData = (reviews: GetReviewsFillUserByProductIDRow[]) => {
        const data = {
            One: 0,
            Two: 0,
            Three: 0,
            Four: 0,
            Five: 0,
            All: reviews?.length ?? 0,
            Average: 0,
        };

        let totalRating = 0;

        reviews?.forEach((item) => {
            switch (item.rating) {
                case 1:
                    data.One++;
                    break;
                case 2:
                    data.Two++;
                    break;
                case 3:
                    data.Three++;
                    break;
                case 4:
                    data.Four++;
                    break;
                case 5:
                    data.Five++;
                    break;
                default:
                    break;
            }
            totalRating += item.rating;
        });

        if (data.All > 0) {
            data.Average = Math.round((totalRating / data.All) * 10) / 10;
        }

        return data;
    };

    const getPercentage = (specific:number, all:number) => {
        if (all > 0) {
            return (specific * 100) / all;
        }
        return 50;
    };
    const data = calculateReviewData(reviews);

    const renderStars = (index:number, filled:boolean) => {
        const stars = [];
        for (let i = 0; i < index; i++) {
            stars.push(
                <span
                    key={i}
                    className={`text-2xl ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
                >
          &#9733;
        </span>
            );
        }
        return stars;
    };

    const renderRatingBar = (starCount:number, value:number) => {
        const percentage = getPercentage(value, data.All);
        return (
            <div className="flex items-center justify-between text-gray-700">
                <span>{starCount} star</span>
                <div className="w-3/4 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="bg-yellow-400 h-full"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <span>{value}</span>
            </div>
        );
    };

    return (
        <div className="bg-white p-10 rounded-lg w-full border">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">User Rating</h2>
                <div className="flex space-x-1">
                    {renderStars(Math.round(data.Average), true)}
                    {renderStars(5 - Math.round(data.Average), false)}
                </div>
            </div>
            <p className="text-gray-600 mt-2">
                {data.Average.toFixed(1)} average based on {data.All} reviews.
            </p>
            <hr className="my-4 border-gray-300" />

            <div className="space-y-2">
                {renderRatingBar(5, data.Five)}
                {renderRatingBar(4, data.Four)}
                {renderRatingBar(3, data.Three)}
                {renderRatingBar(2, data.Two)}
                {renderRatingBar(1, data.One)}
            </div>

            <hr className="my-4 border-gray-300" />

            <div className="flex flex-col gap-4">
                <div className="font-bold text-2xl">Review this product</div>
                <div className="text-md">Share your thoughts with other customers</div>
                <button
                    className="rounded-full px-6 py-3 text-white bg-yellow-500 hover:text-white"
                    type="button"
                >
                    Write a customer review
                </button>
            </div>
        </div>
    );
};

export default Rating;