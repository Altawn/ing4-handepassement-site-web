import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo-handepassement.png';

const HeaderInscription: React.FC = () => {
    return (
        <header className="w-auto max-w-[90%] lg:max-w-[80%] xl:w-[23%] bg-brand rounded-[2rem] lg:rounded-full px-4 lg:px-6 py-2 lg:py-3 md:mt-4 mb-6 mx-auto sticky top-2 z-50 flex items-center justify-center shadow-md">
            <Link to="/" className="flex items-center gap-3 lg:gap-4 group">
                <img
                    src={logo}
                    alt="Handepassement Logo"
                    className="w-[3rem] h-[3rem] lg:w-[4rem] lg:h-[4rem]"
                />
                <span className="hidden min-[400px]:block text-xl lg:text-2xl font-bold text-accent tracking-wide">
                    Handepassement
                </span>
            </Link>
        </header>
    );
};

export default HeaderInscription;
