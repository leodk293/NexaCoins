import React from 'react'
import Logo from './logo/Logo'
import Medias from './medias/Medias'
import Link from 'next/link'

export default function Nav() {
    return (
        <header
            className=' flex flex-wrap border border-transparent shadow-white bg-black gap-10 justify-center py-4 md:justify-evenly md:gap-0'
        >
            <Logo />

            <div className=' self-center'>
                <Medias />
            </div>

            <div className=' self-center flex flex-wrap gap-2'>
                <button
                    className=' self-center border border-transparent text-white px-5 py-2 bg-red-900 rounded-[25px]'
                >
                    Signin to leave us a comment
                </button>
                <Link
                    className=' self-center text-white'
                    href={'/contact'}
                >
                    <button className='border border-transparent px-5 py-2 bg-blue-950 rounded-[25px]'>Contact us</button>
                </Link>
            </div>


        </header>
    )
}
