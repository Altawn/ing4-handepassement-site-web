const [error, setError] = useState<string | null>(null);
const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    university: '',
    fieldOfStudy: '',
    studyLevel: '',
    disabilityTypes: [] as string[], // Changed to array
    needsDescription: '',
    acceptTerms: false
});

const nextStep = () => setStep(step + 1);
const prevStep = () => setStep(step - 1);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
};

const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
};

const handleDisabilityChange = (value: string) => {
    setFormData(prev => {
        const current = prev.disabilityTypes;
        if (current.includes(value)) {
            return { ...prev, disabilityTypes: current.filter(item => item !== value) };
        } else {
            return { ...prev, disabilityTypes: [...current, value] };
        }
    });
};

const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
        await createStudent(formData);
        nextStep(); // Go to success step
    } catch (err) {
        console.error(err);
        setError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    } finally {
        setIsLoading(false);
    }
};

const disabilityOptions = [
    "TDAH",
    "Autisme",
    "Dyslexie",
    "Dyscaculie",
    "Dysgraphie",
    "Phobie social",
    "Autre"
];

return (
    <div className="page-container-background font-sans">
        <HeaderInscription />
        <div className="flex flex-col items-center w-full max-w-[600px]">

            {/* Stepper - Moved outside card */}
            {step <= 3 && (
                <div className="stepper-container w-full mb-6">
                    <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`line ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`step-circle ${step >= 3 ? 'active' : ''}`}>3</div>
                </div>
            )}

            <div className="white-card">
                {/* STEP 1: Informations personnelles */}
                {step === 1 && (
                    <div className="step-content animate-fade-in">
                        <h2 className="text-xl font-bold text-neutral-800 mb-1">Informations personnelles</h2>
                        <p className="text-sm text-neutral-500 mb-4">Étape 1 sur 3</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div className="form-group">
                                <label className="block text-xs font-medium text-neutral-700 mb-1">Prénom *</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition text-sm"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    placeholder="Votre prénom"
                                />
                            </div>
                            <div className="form-group">
                                <label className="block text-xs font-medium text-neutral-700 mb-1">Nom *</label>
                                <input
                                    type="text"
                                    name="nom"
                                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition text-sm"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    placeholder="Votre nom"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Email *</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition text-sm"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="exemple@email.com"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Téléphone (facultatif)</label>
                            <input
                                type="tel"
                                name="phone"
                                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition text-sm"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="06 12 34 56 78"
                            />
                        </div>

                        <div className="mb-3 relative">
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Mot de passe *</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition text-sm"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 caractères"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Confirmer le mot de passe *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition text-sm"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirmez votre mot de passe"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button className="flex items-center gap-2 bg-brand text-white px-5 py-2 rounded-lg hover:bg-brand-400 transition text-sm" onClick={nextStep}>
                                Suivant <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Informations académiques */}
                {step === 2 && (
                    <div className="step-content animate-fade-in">
                        <h2 className="text-xl font-bold text-neutral-800 mb-1">Informations académiques</h2>
                        <p className="text-sm text-neutral-500 mb-4">Étape 2 sur 3</p>

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Université / École *</label>
                            <input
                                type="text"
                                name="university"
                                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition text-sm"
                                value={formData.university}
                                onChange={handleChange}
                                placeholder="Nom de votre établissement"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Domaine d'études *</label>
                            <select
                                name="fieldOfStudy"
                                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition bg-white text-sm"
                                value={formData.fieldOfStudy}
                                onChange={handleChange}
                            >
                                <option value="">Sélectionnez un domaine</option>
                                <option value="sciences">Sciences & Technologies</option>
                                <option value="lettres">Lettres & Langues</option>
                                <option value="droit">Droit & Économie</option>
                                <option value="sante">Santé</option>
                                <option value="arts">Arts & Design</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Niveau d'études *</label>
                            <select
                                name="studyLevel"
                                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition bg-white text-sm"
                                value={formData.studyLevel}
                                onChange={handleChange}
                            >
                                <option value="">Sélectionnez votre niveau</option>
                                <option value="1ère année">Licence 1</option>
                                <option value="2ème année">Licence 2</option>
                                <option value="3ème année">Licence 3</option>
                                <option value="4ème année">Master 1</option>
                                <option value="5ème année">Master 2</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        <div className="flex justify-between">
                            <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 px-4 py-2 transition text-sm" onClick={prevStep}>
                                <ChevronLeft size={18} /> Précédent
                            </button>
                            <button className="flex items-center gap-2 bg-brand text-white px-5 py-2 rounded-lg hover:bg-brand-400 transition text-sm" onClick={nextStep}>
                                Suivant <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Besoins spécifiques */}
                {step === 3 && (
                    <div className="step-content animate-fade-in">
                        <h2 className="text-xl font-bold text-neutral-800 mb-1">Besoins spécifiques</h2>
                        <p className="text-sm text-neutral-500 mb-4">Étape 3 sur 3</p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="block text-xs font-medium text-neutral-700 mb-2">Type de handicap ou trouble (plusieurs choix possibles)</label>
                            <div className="grid grid-cols-2 gap-2">
                                {disabilityOptions.map((option) => (
                                    <label key={option} className={`flex items-center p-2 border rounded-lg cursor-pointer transition text-sm ${formData.disabilityTypes.includes(option) ? 'border-brand bg-brand-50 text-brand-900' : 'border-neutral-200 hover:border-brand-200'}`}>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-brand border-neutral-300 rounded focus:ring-brand-400 mr-2"
                                            checked={formData.disabilityTypes.includes(option)}
                                            onChange={() => handleDisabilityChange(option)}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-medium text-neutral-700 mb-1">Besoins d'accompagnement (facultatif)</label>
                            <textarea
                                name="needsDescription"
                                rows={3}
                                className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition resize-none text-sm"
                                value={formData.needsDescription}
                                onChange={handleChange}
                                placeholder="Décrivez vos besoins particuliers..."
                            />
                        </div>

                        <div className="mb-6 flex items-start gap-2">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                id="acceptTerms"
                                className="mt-0.5 w-3.5 h-3.5 text-brand border-neutral-300 rounded focus:ring-brand-400"
                                checked={formData.acceptTerms}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor="acceptTerms" className="text-xs text-neutral-600">
                                J'accepte les conditions générales d'utilisation et la politique de confidentialité. *
                            </label>
                        </div>

                        <div className="flex justify-between">
                            <button
                                className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 px-4 py-2 transition text-sm"
                                onClick={prevStep}
                                disabled={isLoading}
                            >
                                <ChevronLeft size={18} /> Précédent
                            </button>
                            <button
                                className={`flex items-center gap-2 bg-brand text-white px-5 py-2 rounded-lg hover:bg-brand-400 transition text-sm ${(!formData.acceptTerms || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleSubmit}
                                disabled={!formData.acceptTerms || isLoading}
                            >
                                {isLoading ? (
                                    <>Inscription en cours <Loader2 size={18} className="animate-spin" /></>
                                ) : (
                                    <>Terminer l'inscription <Check size={18} /></>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {step === 4 && (
                    <div className="text-center py-8 animate-fade-in">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-800 mb-3">Inscription réussie !</h2>
                        <p className="text-neutral-600 mb-6 max-w-md mx-auto text-sm">
                            Votre compte a été créé avec succès. Vous pouvez maintenant accéder à votre tableau de bord.
                        </p>
                        <button className="bg-brand text-white px-6 py-2.5 rounded-lg hover:bg-brand-400 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm">
                            Accéder au tableau de bord
                        </button>
                    </div>
                )}

                <div className="text-center mt-6 text-sm text-neutral-500">
                    Déjà inscrit ? <a href="/mon-espace" className="text-brand font-semibold hover:underline">Se connecter</a>
                </div>

            </div>
        </div>
    </div>
);
}