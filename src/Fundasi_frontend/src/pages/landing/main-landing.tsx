import React from 'react'
import NavLanding from './nav-landing'
import HeroLanding from './hero-landing'
import AboutLanding from './about-landing'
import { useSectionRefs } from '../../hooks/useSection'
import { NavList } from '../../constant/landing-constant'

const MainLanding = () => {

    const sectionRefs = useSectionRefs(NavList)

    const scrollToSection = (sectionkey: string) => {
        const sectionRef = sectionRefs[sectionkey]

        if (sectionkey && sectionRef.current) {
            sectionRef.current.scrollIntoView(({
                behavior: 'smooth',
                block: 'start'
            }))

        }
    }

    return (
        <div className='bg-black space-y-10'>

            <NavLanding onNavClick={scrollToSection} navlist={NavList} />
            <div ref={sectionRefs['home']} id='home'>
                <HeroLanding />
            </div>

            <div ref={sectionRefs['about']} id='about'>
                <AboutLanding />
            </div>
        </div>
    )
}

export default MainLanding