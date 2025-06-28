import React from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps {
    text: string
    link?: string
    onClick?: () => void
}


const Button: React.FC<ButtonProps> = ({ text, link, onClick  }) => {
    if (link){
        return (
            <Link to={link}>
                <button className="text-white font-light black-gradient rounded-full py-3 px-8 ">
                    {text}
                </button>
            </Link>
        )
    }
    return (
        <button onClick={onClick} className="text-white font-light black-gradient rounded-full py-3 px-8 ">
            {text}
        </button>
    )
}

export default Button