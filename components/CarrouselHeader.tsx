'use client'
import React, { useRef } from 'react';


function CarrouselHeader ({ id }: {id:string}) {
    const initialized = useRef(false);

    const ArrowFuncHeader = (el:string, container:string, percentage:number) => {
        const element = document.getElementById(el);
        if (element) {
            element.addEventListener('click', function() {
                const containerEl = document.getElementById(container);
                if (containerEl) {
                    const displace = containerEl.offsetWidth * (percentage / 100);
                    containerEl.scrollBy({
                        left: displace,
                        behavior: 'smooth'
                    });
                }
            });
        }
    };

    React.useEffect(() => {
        if (!initialized.current) {
            ArrowFuncHeader(`left-arrow-${id}`, `scroll-container-${id}`, -100);
            ArrowFuncHeader(`right-arrow-${id}`, `scroll-container-${id}`, 100);
            initialized.current = true;
        }
    }, [id]);

    return (
        <div className="py-4">
            <div className="relative flex">
                <div
                    id={`scroll-container-${id}`}
                    className={`overflow-x-auto overflow-hidden whitespace-nowrap flex-1 scrollbar-hide h-[400px] rounded-3xl`}
                >
                    {['1', '2', '3'].map((el, index) => (
                        <div
                            key={el}
                            className={`inline-block h-[400px] w-full relative transition-transform duration-500 hover:scale-110 z-1 rounded-3xl`}
                        >
                            <div>
                                <img
                                    src={`https://picsum.photos/seed/${index+22}/1200/1200`}
                                    className="w-full object-cover h-[400px]"
                                    alt="image"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    id={`left-arrow-${id}`}
                    className="m-1 rounded-xl arrow p-4 text-white content-center absolute left-4 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 hover:opacity-100 opacity-50 bg-black/50 cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </div>

                <div
                    id={`right-arrow-${id}`}
                    className="m-1 rounded-xl arrow p-4 text-white content-center absolute right-4 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 hover:opacity-100 opacity-50 bg-black/50 cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default CarrouselHeader;