import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/images/logo-handepassement.png';
import { smoothScrollTo } from '../utils/smoothScroll';

const HeaderMain: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleConcernsClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (location.pathname === '/') {
            smoothScrollTo('concerns-section', 2000); // 2 secondes pour un scroll bien lent
        } else {
            navigate('/', { state: { scrollTo: 'concerns-section' } });
        }
        setIsMenuOpen(false);
    };

    return (
        <header className="w-[95%] lg:w-[98%] bg-brand rounded-[2rem] lg:rounded-full px-4 lg:px-8 mb-6 mx-auto lg:mx-4 relative z-50">
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between py-3 lg:py-2 gap-4 lg:gap-0">
                <div className="w-full lg:w-auto flex items-center justify-between">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 lg:gap-4 group" aria-label="Accueil - Handepassement">
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
                        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>

                {/* Navigation Section */}
                <nav
                    className={`${isMenuOpen ? 'flex' : 'hidden'} absolute top-full right-0 mt-4 w-64 bg-white rounded-2xl shadow-xl p-6 flex-col gap-4 lg:static lg:flex lg:flex-row lg:items-center lg:justify-end lg:gap-6 xl:gap-16 lg:w-auto lg:bg-transparent lg:shadow-none lg:p-0 lg:mt-0`}
                    aria-label="Navigation principale"
                >

                    <a href="/#concerns-section" onClick={handleConcernsClick} className="text-brand hover:text-accent transition-colors font-medium text-lg lg:text-white lg:text-base xl:text-xl cursor-pointer">
                        Êtes-vous concerné ?
                    </a>
                    <Link to="/connexion" className="text-brand hover:text-accent transition-colors font-medium text-lg lg:text-white lg:text-base xl:text-xl">
                        Connexion
                    </Link>

                    <Link to="/inscription" className="px-8 py-3 lg:px-6 lg:py-3 xl:px-10 xl:py-4 bg-accent text-brand text-lg lg:text-base xl:text-xl font-bold rounded-full hover:bg-accent-400 transition-colors shadow-sm inline-block text-center">
                        Inscription
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default HeaderMain;
