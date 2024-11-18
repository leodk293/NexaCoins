import React from 'react'
import { Twitter, Facebook, Linkedin } from 'lucide-react'
import Link from 'next/link'

export default function Medias() {
    return (
        <div className=' flex text-xl text-white font-semibold flex-row gap-4'>
            {/* <Twitter size={32} color="#1DA1F2" strokeWidth={1.75} />
            <Facebook size={32} color="#1877F2" strokeWidth={1.75} />
            <Linkedin size={32} color="#0A66C2" strokeWidth={1.75} /> */}
            <Link className=' hover:text-[#1DA1F2] duration-200' href={'/'}>Twitter</Link>
            <Link className='hover:text-[#1877F2] duration-200' href={'/'}>Facebook</Link>
            <Link className='hover:text-[#0A66C2] duration-200' href={'/'}>Linkedin</Link>
        </div>
    )
}
