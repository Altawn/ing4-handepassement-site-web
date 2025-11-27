import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderMain from '../components/HeaderMain';
import FooterOther from '../components/FooterOther';
import Oeil from '../components/Oeil';

function Connexion() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login attempt:', { email, password });
        // Redirect to student dashboard
        navigate('/espace-etudiant');
    };

    return (
        <div className="min-h-screen bg-accent-50">
            <HeaderMain />
            <div className=" py-12 px-6 flex items-center justify-center">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
                        <p className="text-gray-600">Connectez-vous à votre espace personnel</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-gray-50"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="········"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-gray-50"
                                required
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-left">
                            <Link to="/mot-de-passe-oublie" className="text-brand hover:text-brand-600 text-sm font-medium">
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-600 transition-colors shadow-md"
                        >
                            Se connecter
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600 text-sm">
                            Pas encore de compte ?{' '}
                            <Link to="/inscription" className="text-brand hover:text-brand-600 font-semibold">
                                S'inscrire
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Accessibility Button */}
                <Oeil />
            </div>
            <FooterOther />
        </div>
    );
}

export default Connexion;
