import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderMain from '../components/HeaderMain';
import FooterOther from '../components/FooterOther';
import Oeil from '../components/Oeil';
import { verifyStudent } from '../services/airtable';

function Connexion() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await verifyStudent(email, password);

            if (result.success) {
                // Store user info in local storage
                console.log('Login successful:', result.student);
                localStorage.setItem('user', JSON.stringify(result.student));

                // Check status for redirection
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const studentData = result.student as any;
                const status = studentData['Statut'];
                if (status === 'Admin' || status === 'Administrateur') {
                    navigate('/admin');
                } else {
                    navigate('/mon-espace');
                }
            } else {
                setError(result.message || "Erreur lors de la connexion");
            }
        } catch {
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-accent-50 flex flex-col pt-6">
            <HeaderMain />
            <div className="flex-1 flex items-center justify-center py-12 px-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
                        <p className="text-gray-600">Connectez-vous à votre espace personnel</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}
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
                            disabled={isLoading}
                            className={`w-full py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-600 transition-colors shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600 text-sm">
                            Pas encore de compte ?{' '}
                            <Link to="/inscription" className="text-brand hover:text-brand-600 font-semibold">
                                S&apos;inscrire
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
            <Oeil />
            <FooterOther />
        </div>
    );
}

export default Connexion;
