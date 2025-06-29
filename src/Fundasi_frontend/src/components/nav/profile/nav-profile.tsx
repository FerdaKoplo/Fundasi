import React from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const NavbarProfile = () => {
    return (
        <nav className="flex items-center justify-between p-6 relative">
            <Link to={"/campaigns"}>
                <h1 className="text-2xl font-bold green-gradient">Fundasi</h1>
            </Link>
            <Link to={"/user-profile"}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#398267] to-[#A5CC86] flex items-center justify-center">
                    <div className="text-[#A5CC86] text-xs bg-black w-6 h-6 rounded-full flex justify-center items-center">
                        <FaUser />
                    </div>
                </div>
            </Link>
        </nav>
    )
}

export default NavbarProfile