'use client'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    toggleCategory,
    toggleSpecial,
    setPriceFrom,
    setPriceTo, filterState,
} from '@/redux/slices/filterSlice';
import {
    GetCategoriesRow,
    GetSpecialRow
} from "@/db/goqueries/query_sql";

type PropsType = {
    special: GetSpecialRow[];
    categories: GetCategoriesRow[];
};

function ProductFilter({special, categories}:PropsType) {
    const dispatch = useDispatch()
    const filters = useSelector(filterState)

    return (
        <div className="flex flex-col  p-6 rounded-lg gap-4  border-[1px] border-gray-300">

            {/*// <!-- Categories-->*/}
            <div>
                <h3 className="text-xl font-semibold  mb-4 text-black">
                    Categories
                </h3>

                <div className="flex flex-col gap-3">
                    {categories?.map((item, index) => (
                        <label
                            key={index}
                            className="flex-1 text-center sm:text-left px-4 py-3 bg-hawaiian-tan-50 text-sm cursor-pointer border-[1px] border-white rounded-lg transition-all duration-300 hover:border-hawaiian-tan-700  has-[input:checked]:border-hawaiian-tan-700 has-[input:checked]:text-hawaiian-tan-700"
                        >
                            <input name="category"
                                   type="checkbox"
                                   className="absolute opacity-0 h-0 w-0"
                                   onChange={() => dispatch(toggleCategory(item.id))}
                                   value={item.id}
                                   checked={filters.categories.includes(item.id)}
                            />
                            {item.name}
                        </label>
                    ))}

                </div>
            </div>

            {/*// <!-- Price-->*/}
            <div>
                <h3 className="text-xl font-semibold  mb-4 text-black">
                    Price
                </h3>

                <div>
                    <div className="grid grid-cols-2 gap-3">
                        <label className="col-span-1 flex gap-2 bg-white p-2  border border-hunter-green-50 rounded-lg" >
                            From:
                            <input
                                className="w-10 outline-0"
                                type="number"
                                name="price-from"
                                step="1"
                                min="0"
                                value={filters.price.from ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    dispatch(setPriceFrom(value ? parseInt(value, 10) : null));
                                }}

                            />
                        </label>

                        <label className="col-span-1 flex gap-2 bg-white p-2  border border-hunter-green-50 rounded-lg">
                            To:
                            <input
                                className="w-10 outline-0"
                                type="number"
                                name="price-to"
                                step="1"
                                min="0"
                                value={filters.price.to ?? ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    dispatch(setPriceTo(value ? parseInt(value, 10) : null));
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/*// <!-- Addition-->*/}
            <div>
                <h3 className="text-xl font-semibold  mb-4 text-black">
                Special
                </h3>

                <div className="flex flex-col gap-3">
                    {special?.map((item, index)=> (
                        <label
                            key={index}
                            className="flex-1 text-center sm:text-left px-4 py-3 bg-timber-green-50 text-sm cursor-pointer border-[1px] border-white rounded-lg transition-all duration-300 hover:border-timber-green-700  has-[input:checked]:border-timber-green-700 has-[input:checked]:text-timber-green-700"
                        >
                            <input
                                name="special"
                                type="checkbox"
                                className="absolute opacity-0 h-0 w-0"
                                onChange={() => dispatch(toggleSpecial(item.id))}
                                value={item.id}
                                checked={filters.special.includes(item.id)}
                            />
                            {item.name}
                        </label>
                    ))}
                </div>
            </div>


        </div>
    );
}

export default ProductFilter;