import React from 'react'
import logo from './bitcoin.png'
import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
    return (
        <Link href={'/'}>
            <div className=' flex flex-row gap-1'>
                <h1 className=' text-3xl text-yellow-600 font-extrabold self-center'>NexaCoins</h1>
                <Image
                    src={logo}
                    width={35}
                    height={25}
                    alt='NexaCoins LOGO'
                    className=' self-center object-cover'
                />
            </div>
        </Link>
    )
}
