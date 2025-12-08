import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import HeaderInscription from '../components/HeaderInscription';
import FooterOther from '../components/FooterOther';

function FirstRdv() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleContinue = () => {
        // Navigate to appointment selection page with email
        navigate('/premier-rdv/selection', { state: { email } });
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <>
            <div className="min-h-screen bg-accent-50 pt-6 pb-12 px-6 flex flex-col">
                <HeaderInscription />
                <div className="container mx-auto max-w-2xl flex-1 flex items-center justify-center py-8">
                    {/* Main Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Premier contact</h1>
                            <p className="text-gray-600 leading-relaxed">
                                Bienvenue ! Pour commencer votre accompagnement, nous devons d'abord planifier un premier rendez-vous.
                            </p>
                        </div>

                        {/* Email Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Vos coordonnées</h2>
                            </div>

                            <p className="text-gray-600 mb-4">
                                Veuillez nous indiquer votre addresse email pour poursuivre
                            </p>

                            <div className="mb-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Addresse email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@gmail.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                                />
                            </div>

                            <p className="text-sm text-gray-500">
                                Cette addresse sera utilisée pour vous envoyer la confirmation de votre rendez-vous
                            </p>
                        </div>

                        {/* Next Steps Section */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                            <h3 className="font-bold text-gray-900 mb-3">Prochaines étapes</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>Vous allez pouvoir choisir un créneau pour votre premier rendez-vous</li>
                                <li>Lors du rendez-vous, nous évaluerons vos besoins et créerons votre dossier</li>
                                <li>Vous recevrez ensuite vos identifiants pour accéder à votre espace personnel</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between gap-4">
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Retour
                            </button>
                            <button
                                onClick={handleContinue}
                                className="px-8 py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-600 transition-colors shadow-md flex items-center gap-2"
                            >
                                Continuer
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <FooterOther />
        </>
    );
}

export default FirstRdv;
