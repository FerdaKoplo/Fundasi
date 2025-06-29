import React, { useEffect, useState } from 'react'
import { MdArrowOutward } from "react-icons/md";
import { Link } from 'react-router-dom';
import { NavList } from '../../constant/landing-constant';

interface NavbarProps {
  navlist : Array<{key:string; label:string}>,
  onNavClick : (sectionKey: string) => void
}


const NavLanding : React.FC<NavbarProps> = ({navlist, onNavClick}) => {

    const [Header, setHeader] = useState(false)

    const scrollHeader = () => {
        if (window.scrollY >= 30) {
            setHeader(true)
        }
        else {
            setHeader(false)
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            scrollHeader()
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    })

    return (
        <nav className={`${Header ? 'transition-all p-5 bg-black shadow-lg z-50 fixed w-full top-0 start-0' : 'bg-transparent p-5'} px-32 flex justify-between p-5`}>
            <div>
                <h1 className="text-2xl font-bold green-gradient">Fundasi</h1>
            </div>
            <ul className='flex items-center justify-center text-white gap-7'>
                {NavList.map((i) => (
                    <li>
                        <button onClick={() => onNavClick(i.key)} className=''>
                            {i.label}
                        </button>
                    </li>
                ))}
            </ul>

            <Link to={"/login"}>
                <div className='flex gap-2 items-center text-white'>
                    <h1>Start Campaign</h1>
                    <p className='font-bold'><MdArrowOutward /></p>
                </div>
            </Link>
        </nav>
    )
}

export default NavLanding