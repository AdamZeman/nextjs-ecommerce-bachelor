import React from 'react';

function Footer() {
    return (
        <footer className={"lg:max-w-screen-xl mx-auto w-full"}>
            <div className={" p-10 rounded-lg bg-hawaiian-tan-200 "}>
                <div className={"grid grid-cols-2 lg:grid-cols-3 gap-4 justify-between"}>
                    {/*// <!-- About Section -->*/}
                    <div className={"w-full mb-8 md:mb-0"}>
                        <h3 className={"text-xl font-bold mb-4"}>About Us</h3>
                        <p className={"text-sm"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>

                    {/*// <!-- Quick Links -->*/}
                    <div className={"w-full mb-8 md:mb-0"}>
                        <h3 className={"text-xl font-bold mb-4"}>Quick Links</h3>
                        <ul className={"text-sm"}>
                            <li className={"mb-2 text-hawaiian-tan-800 font-bold hover:opacity-75"}>
                                <a href="/">Home</a>
                            </li>
                            <li className={"mb-2 text-hawaiian-tan-800 font-bold hover:opacity-75"}><a
                                href="/category">Products</a></li>
                            <li className={"mb-2 text-hawaiian-tan-800 font-bold hover:opacity-75"}><a
                                href="/contact">Contact</a></li>
                        </ul>
                    </div>

                    {/*// <!-- Social Media -->*/}
                    <div className={"w-full "}>
                        <h3 className={"text-xl font-bold mb-4"}>Follow Us</h3>
                        <div className={"flex space-x-4"}>
                            <a href="#" className={"text-white hover:text-red-300"}>

                                <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px"
                                     y="0px"
                                     viewBox="0,0,256,256"
                                >
                                    <g fillRule="nonzero" stroke="none" strokeWidth="1"
                                       strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10"
                                       strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none"
                                       fontSize="none">
                                        <g transform="scale(5.12,5.12)">
                                            <path
                                                d="M25,3c-12.15,0 -22,9.85 -22,22c0,11.03 8.125,20.137 18.712,21.728v-15.897h-5.443v-5.783h5.443v-3.848c0,-6.371 3.104,-9.168 8.399,-9.168c2.536,0 3.877,0.188 4.512,0.274v5.048h-3.612c-2.248,0 -3.033,2.131 -3.033,4.533v3.161h6.588l-0.894,5.783h-5.694v15.944c10.738,-1.457 19.022,-10.638 19.022,-21.775c0,-12.15 -9.85,-22 -22,-22z"></path>
                                        </g>
                                    </g>
                                </svg>


                            </a>
                            <a href="#" className={"text-white hover:text-red-300"}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="M22.23 5.924c-.806.358-1.67.6-2.577.708a4.515 4.515 0 001.98-2.49 9.037 9.037 0 01-2.86 1.09 4.507 4.507 0 00-7.68 4.108 12.8 12.8 0 01-9.29-4.71 4.507 4.507 0 001.395 6.014 4.48 4.48 0 01-2.04-.563v.057a4.507 4.507 0 003.617 4.416 4.52 4.52 0 01-2.034.077 4.507 4.507 0 004.21 3.13 9.038 9.038 0 01-5.6 1.93c-.364 0-.724-.02-1.08-.063a12.78 12.78 0 006.92 2.03c8.3 0 12.84-6.88 12.84-12.84 0-.195-.004-.39-.013-.583a9.172 9.172 0 002.26-2.34z"/>
                                </svg>
                            </a>
                            <a href="#" className={"text-white hover:text-red-300"}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/*// <!-- Copyright -->*/}
            <div className={"text-center py-8"}>
                <p className={"text-sm"}>© 2025 Adam Zeman. Bakalárska práca.</p>
            </div>
        </footer>
    );
}

export default Footer;