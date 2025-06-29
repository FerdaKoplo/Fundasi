import React from 'react'
import  aboutimage  from '../../../public/images/about_landing_asset//about.png'

const AboutLanding = () => {
    return (
        <div className='min-h-screen flex flex-col justify-center px-32 items-center'>
            <div className='flex gap-10  flex-col items-center justify-center'>
                <h1 className='top-light-green-gradient text-7xl font-semibold'>About Us</h1>
                <p className='text-white w-3/4 text-center'>Fundasi is a Web3 microfunding platform where microbusiness raise community 
                    capital via NFTs. Contributions are recorded on-chain, with NFTs as proff and reward
                </p>
            </div>

            <div className='grid grid-cols-2'>
                <div className=' flex flex-col items-center justify-center gap-5 text-white'>
                    <h1 className='text-4xl font-semibold'>Why ?</h1>
                    <p className='w-3/5'>UMKM face funding challenges and lack support. Fundasi enables direct,
                        transparent community-driven support.
                    </p>
                </div>

                <div className='w-3/4'>
                    <img src={aboutimage} alt="" />
                </div>
            </div>
        </div>
    )
}

export default AboutLanding