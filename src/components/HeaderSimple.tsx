import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo-handepassement.png';

const HeaderSimple: React.FC = () => {
    return (
        <header className="w-[98%] bg-brand rounded-full px-6 shadow-md mt-4 mx-4">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-4 group">
                    <img
                        src={logo}
                        alt="Handepassement Logo"
                        className="w-[7rem] h-[7rem]"
                    />
                    <span className="text-4xl font-bold text-accent tracking-wide">
                        Handepassement
                    </span>
                </Link>
            </div>
        </header>
    );
};

export default HeaderSimple;
