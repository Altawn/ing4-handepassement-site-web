import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/nouvo-logo-handepassement.png';

const Header: React.FC = () => {
    return (
        <header className="w-full bg-brand py-4 px-6 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-accent transition-transform group-hover:scale-105">
                        <img
                            src={logo}
                            alt="Handepassement Logo"
                            className="w-10 h-10 object-contain"
                        />
                    </div>
                    <span className="text-3xl font-bold text-accent tracking-wide">
                        Handepassement
                    </span>
                </Link>

                {/* Navigation Section */}
                <nav className="flex items-center gap-8">
                    <Link to="/membres" className="text-white hover:text-accent transition-colors font-medium text-lg">
                        Membres
                    </Link>
                    <Link to="/documentation" className="text-white hover:text-accent transition-colors font-medium text-lg">
                        Documentation
                    </Link>
                    <Link to="/mon-espace" className="text-white hover:text-accent transition-colors font-medium text-lg">
                        Mon espace
                    </Link>
                    <Link to="/rdv" className="text-white hover:text-accent transition-colors font-medium text-lg">
                        RDV
                    </Link>

                    <button className="px-6 py-2 bg-accent text-brand font-bold rounded-full hover:bg-accent-400 transition-colors shadow-sm">
                        Déconnexion
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
