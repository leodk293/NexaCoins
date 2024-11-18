import React from 'react'
import Logo from './logo/Logo'
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';
import { MessageSquare } from 'lucide-react';

export default function Footer() {
    const date = new Date();
    const year = date.getFullYear();
    return (
        <footer className="mt-[100px] flex flex-col gap-5 w-full relative bottom-0 bg-black py-5 px-10 text-white ">


            <div className='flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:justify-evenly'>

                <div className=' flex flex-col gap-3'>
                    <Logo />
                    <p className=' font-semibold'>© {year} <span className='font-extrabold'>NexaCoins</span>. All Rights Reserved.</p>
                </div>

                <div className=' flex flex-col gap-2'>
                    <p className=' font-bold text-xl'>Social networks</p>
                    <Link href={'/'} className=' pt-2'>Twitter</Link>
                    <Link href={'/'}>Facebook</Link>
                    <Link href={'/'}>Linkedin</Link>
                </div>

                <div className='flex flex-col gap-2'>
                    <p className=' font-bold text-xl'>Contact</p>

                    <div className=' pt-2 flex flex-row gap-1'>
                        <Mail color="#ffffff" />
                        <p className=' self-center'>aboubatrao04@gmail.com</p>
                    </div>

                    <div className=' flex flex-row gap-1'>
                        <Phone color="#ffffff" />
                        <p className=' self-center'>+212 0619965635</p>
                    </div>

                    <Link className=' flex flex-row gap-1' href={'/contact'}>
                        <MessageSquare color="#ffffff" />
                        <p className=' self-center'>Send a message</p>
                    </Link>


                </div>

            </div>

            <div className=' flex flex-col items-center pt-5 self-center gap-2'>
                <span className=' bg-[#ffffffd2] w-[23rem] rounded-[25px] h-[0.9px] md:w-[65rem]'></span>
                <p className=' italic text-center leading-5 text-[14px] md:w-[50rem] md:text-[15px]'>Nexacoins provides a fundamental analysis of the crypto market, in addition to tracking price, volume and market capitalisation.</p>
            </div>


        </footer>
    )
}
