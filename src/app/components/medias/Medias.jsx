import React from 'react'
import Link from 'next/link'

export default function Medias() {
    return (
        <div className=' flex text-xl text-white font-semibold flex-row gap-4'>
            <Link target='_blank' className=' hover:text-[#1DA1F2] duration-200' href={'https://x.com/Aboubac48530295'}>Twitter</Link>
            <Link target='_blank' className='hover:text-[#1877F2] duration-200' href={'https://www.facebook.com/profile.php?id=100092315485742'}>Facebook</Link>
            <Link target='_blank' className='hover:text-[#0A66C2] duration-200' href={'https://www.linkedin.com/in/aboubacar-traore-495736252/'}>Linkedin</Link>
        </div>
    )
}
