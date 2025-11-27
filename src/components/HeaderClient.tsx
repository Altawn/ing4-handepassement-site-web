import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo-handepassement.png';

const HeaderClient: React.FC = () => {
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

                {/* Navigation Section */}
                <nav className="flex items-center justify-end gap-16">
                    <Link to="/" className="text-white hover:text-accent transition-colors font-medium text-xl">
                        Documentation
                    </Link>
                    <Link to="/" className="text-white hover:text-accent transition-colors font-medium text-xl">
                        Mon Espace
                    </Link>
                    <Link to="/" className="text-white hover:text-accent transition-colors font-medium text-xl">
                        RDV
                    </Link>

                    <button className="px-10 py-4 bg-accent text-brand text-xl font-bold rounded-full hover:bg-accent-400 transition-colors shadow-sm">
                        Déconnexion
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default HeaderClient;
