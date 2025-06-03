import React from 'react';

function Page() {
    return (
        <div className="p-6 flex flex-col items-center">
            {/* Hero Section */}
            <div className="flex flex-col gap-4 w-full text-center pb-12 ">
                <h1 className="text-5xl font-semibold ">Contact Us</h1>
                <p className="text-lg text-gray-600 mt-4">
                    tincidunt nulla, eget bibendum tellus dignissim nec. Praesent varius tempor viverra. Phasellus fermentum vestibulum mi eu varius. Nulla laoreet augue vel consectetur convallis. Pellentesque dictum ornare lorem nec pharetra. Aliquam sapien magna, vehicula ac lectus eu, tempus maximus ante. Donec eget sollicitudin lectus. N                </p>
            </div>

            {/* Contact Info */}
            <div className=" bg-hunter-green-200 rounded-2xl w-full  p-8 space-y-6">
                <div className="flex gap-4 items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-hunter-green-900">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                    </svg>
                    <p className="text-lg">+1 (202) 555-0136</p>
                </div>

                <div className="flex gap-4 items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-hunter-green-900">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                    </svg>
                    <p className="text-lg">laura.rangel740@exa.com</p>
                </div>

                <div className="flex gap-4 items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-hunter-green-900">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                    </svg>
                    <div>
                        <p className="text-lg">2457 Ridgeway Street</p>
                        <p className="text-lg">Seattle, WA 98101</p>
                        <p className="text-lg">USA</p>
                    </div>
                </div>
            </div>


            {/* Map Embed */}
            <div className="w-full mt-12 rounded-2xl overflow-hidden shadow-lg">
                <iframe
                    className="w-full h-80"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2689.539904071417!2d-122.33763438436945!3d47.61014997918451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54901545e49f0b27%3A0x66e567e9fef489f7!2s2457%20Ridgeway%20St%2C%20Seattle%2C%20WA%2098101%2C%20USA!5e0!3m2!1sen!2ssk!4v1717319617344"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Our Location"
                ></iframe>
            </div>
        </div>
    );
}

export default Page;
