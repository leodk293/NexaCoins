'use client'
import React, { useState } from 'react'
import { PhoneCall } from 'lucide-react';

export default function Page() {
    const [result, setResult] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending....");
        const formData = new FormData(event.target);

        formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_API_KEY);

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setResult("Form Submitted Successfully");
            event.target.reset();
        } else {
            console.log("Error", data);
            setResult(data.message);
        }
    };
    return (
        <main className=" m-auto w-auto md:w-[40rem]">

            <div className=' mt-10 flex flex-col border border-transparent p-5 rounded-[5px] bg-[#0000008c]'>

                <div className=' flex flex-row gap-2'>
                    <h1 className='text-center text-2xl font-bold text-white md:text-left md:text-3xl'>Contact us</h1>
                    <PhoneCall size={36} className=' self-center' color="#ffffff" />
                </div>

                <form className=' mt-10 flex flex-col gap-1' onSubmit={onSubmit}>
                    <label className=' text-white font-bold' htmlFor="name">Name</label>
                    <input placeholder='Enter Your Name...' className=' pt-1 placeholder:text-white capitalize bg-transparent border border-white text-white text-xl outline-none rounded-[5px] p-2' type="text" id='name' name="name" required />
                    <label className=' text-white font-bold mt-4' htmlFor="email">Email</label>
                    <input placeholder='Enter Your Email...' className='pt-1 placeholder:text-white  capitalize bg-transparent border border-white text-white text-xl outline-none rounded-[5px] p-2' type="email" id='email' name="email" required />
                    <label className=' text-white font-bold mt-4' htmlFor="msg">Message</label>
                    <textarea placeholder='Write Your Message...' className='pt-1 placeholder:text-white  capitalize bg-transparent border border-white text-white text-xl outline-none rounded-[5px] p-2' id='msg' name="message" required></textarea>

                    <button className=' mt-5 border border-transparent text-xl font-semibold rounded-[5px] bg-indigo-950 text-white py-2 w-[150px] hover:translate-x-2 duration-300' type="submit">Send</button>

                </form>
                <span className={`pt-2 font-semibold ${result ? 'text-green-700' : 'text-red-700'}`}>{result}</span>
            </div>

        </main>
    )
}
