import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/images/logo-handepassement.png';

const HeaderSimple: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <header className="w-[95%] lg:w-[98%] bg-brand rounded-[2rem] lg:rounded-full px-4 lg:px-6 md:mt-4 mb-6 mx-auto lg:mx-4 sticky top-2 z-50">
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between py-4 lg:py-0 gap-4 lg:gap-0">
                <div className="w-full lg:w-auto flex items-center justify-between">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 lg:gap-4 group">
                        <img
                            src={logo}
                            alt="Handepassement Logo"
                            className="w-[4rem] h-[4rem] lg:w-[5rem] lg:h-[5rem] xl:w-[7rem] xl:h-[7rem]"
                        />
                        <span className="hidden min-[400px]:block text-2xl lg:text-3xl xl:text-4xl font-bold text-accent tracking-wide">
                            Handepassement
                        </span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-yellow-500 hover:text-accent transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>

                {/* Navigation Section */}
                <nav className={`${isMenuOpen ? 'flex' : 'hidden'} absolute top-full right-0 mt-4 w-64 bg-white rounded-2xl shadow-xl p-6 flex-col gap-4 lg:hidden`}>
                    <Link to="/" className="text-brand hover:text-accent transition-colors font-medium text-lg">
                        Accueil
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default HeaderSimple;
