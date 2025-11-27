import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo-handepassement.png';

const HeaderInscription: React.FC = () => {
    return (
        <header className="fixed top-4 left-4 z-50 w-fit xl:w-[23%]">
            <Link to="/" className="block">
                <div className="opacity-75 bg-brand/45 rounded-full py-3 px-4 shadow-lg flex items-center gap-8 hover:bg-brand/90 transition-colors">
                    <div className="relative flex-shrink-0">
                        <img
                            src={logo}
                            alt="Handepassement Logo"
                            className="w-[4.5rem] h-[4.5rem]"
                        />
                    </div>
                    <span className="hidden xl:block text-2xl font-bold text-accent tracking-wide truncate">
                        Handepassement
                    </span>
                </div>
            </Link>
        </header>
    );
};

export default HeaderInscription;
