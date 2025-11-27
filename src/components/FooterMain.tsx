import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo-handepassement.png';
import instagram from '../assets/images/logo-instagram.png';
import linkedin from '../assets/images/logo-linkedin.png';
import whatsapp from '../assets/images/logo-whatsapp.png';

const FooterMain: React.FC = () => {
    return (
        <footer className="w-full bg-brand text-white py-8 mt-auto">
            <div className="container mx-auto px-6">
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-8">
                    {/* Left: Logo & Contact */}
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <img
                            src={logo}
                            alt="Handepassement Logo"
                            className="w-[5rem] h-[5rem] lg:w-[7rem] lg:h-[7rem]"
                        />
                        <div className="flex flex-col gap-1">
                            <p className="text-base lg:text-lg">
                                <span className="font-semibold">Email :</span> <a href="mailto:associationhandepassement@gmail.com" className="hover:text-accent transition-colors break-all md:break-normal">associationhandepassement@gmail.com</a>
                            </p>
                            <p className="text-base lg:text-lg">
                                <span className="font-semibold">Tel :</span> <a href="tel:+33781865744" className="hover:text-accent transition-colors">+33 7 81 86 57 44</a>
                            </p>
                        </div>
                    </div>

                    {/* Right: Social Icons */}
                    <div className="flex items-center gap-6">
                        <a href="#">
                            <img src={instagram} alt="Instagram" className="w-[3rem] h-[3rem] lg:w-[5rem] lg:h-[5rem] object-contain" />
                        </a>
                        <a href="#">
                            <img src={linkedin} alt="LinkedIn" className="w-[3rem] h-[3rem] lg:w-[5rem] lg:h-[5rem] object-contain" />
                        </a>
                        <a href="#">
                            <img src={whatsapp} alt="WhatsApp" className="w-[3rem] h-[3rem] lg:w-[5rem] lg:h-[5rem] object-contain" />
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/20 my-6"></div>

                {/* Bottom Section */}
                <div className="flex flex-col lg:flex-row items-center justify-between text-xs lg:text-sm text-gray-300 gap-4 text-center lg:text-left">
                    <p>© 2025 Handepassement. Tous droits réservés.</p>
                    <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6">
                        <Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
                        <span className="hidden lg:inline">•</span>
                        <Link to="/politique-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link>
                        <span className="hidden lg:inline">•</span>
                        <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterMain;
