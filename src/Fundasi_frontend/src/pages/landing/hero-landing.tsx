import React from 'react'

const HeroLanding = () => {
    return (
        <div className='min-h-screen flex flex-col justify-center items-center gap-12'>
            <div className='flex flex-col items-center gap-2'>
                <h1 className='light-black-gradient-text text-9xl font-semibold '>Fundasi</h1>
                <p className='top-light-green-gradient font-medium text-xl'>Web3 Funding for Real-World Entrepreneurs</p>
            </div>
            <div className='grid grid-cols-2 gap-20'>
                <div className='text-white items-center gap-2 p-5 rounded-xl flex flex-col black-gradient'>
                    <span className='font-medium text-3xl'>5000+</span>
                    <span>Campaigns</span>
                </div>
                <div className='text-white flex items-center gap-2 p-5 rounded-xl flex-col black-gradient'>
                    <span className='text-3xl font-medium'>90%</span>
                    <span>Campaigns Funded</span>
                </div>
            </div>
            <div>
                <button className='black-gradient text-white px-10 py-1 rounded-full'>Get Started</button>
            </div>
        </div>
    )
}

export default HeroLanding