import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, BookOpen, Heart, CheckCircle, Eye } from 'lucide-react';
import heroImage from '../assets/images/image-accueil.png';
import HeaderMain from '../components/HeaderMain'
import FooterOther from '../components/FooterOther'

function Home() {
    const [showEye, setShowEye] = useState(true);

    // Ensure eye button is always visible
    useEffect(() => {
        const handleScroll = () => {
            setShowEye(true);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const services = [
        {
            icon: <Calendar className="w-6 h-6 text-brand" />,
            title: "Prise de rendez-vous",
            description: "Planifiez facilement vos rendez-vous"
        },
        {
            icon: <Users className="w-6 h-6 text-brand" />,
            title: "Accompagnement personnalisé",
            description: "Un suivi adapté à vos besoins spécifiques tout au long de votre parcours"
        },
        {
            icon: <BookOpen className="w-6 h-6 text-brand" />,
            title: "Documentation",
            description: "Informations sur les différents types de handicaps et les aménagements disponibles"
        },
        {
            icon: <Heart className="w-6 h-6 text-brand" />,
            title: "Outil de compensation",
            description: "Les outils disponibles pour compenser un handicap"
        }
    ];

    const concerns = [
        "Dyslexie", "TDAH", "Autisme",
        "Phobie scolaire", "Handicap moteur", "Dyscalculie",
        "Déficience visuelle", "Déficience auditive", "Dysgraphie"
    ];

    return (
        <>
            <div className="min-h-screen bg-accent-50 font-sans relative">
                {/* Hero Section */}
                <section className="bg-brand text-white pb-24 px-6 relative overflow-hidden rounded-b-[3rem]">
                    <HeaderMain />
                    <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center pb-12">
                        <div className="space-y-8 z-10">
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-accent">
                                Des Études Supérieures Sans Obstacles. On Handiscute ?
                            </h1>
                            <Link to="/premier-rdv" className="inline-block px-8 py-3 bg-accent text-brand font-bold rounded-lg hover:bg-accent-400 transition-colors shadow-lg">
                                Prendre un premier rendez-vous
                            </Link>
                        </div>
                        <div className="relative z-10 flex justify-center md:justify-end">
                            {/* Image container with specific styling to match design */}
                            <img
                                src={heroImage}
                                alt="Étudiants diplômés"
                                className="max-w-full h-auto object-contain"
                                style={{ maxHeight: '400px' }}
                            />
                        </div>
                    </div>

                    {/* Text below hero, centered, overlapping slightly or just below */}
                    <div className="container mx-auto mt-16 text-center max-w-4xl">
                        <p className="text-brand text-xl leading-relaxed font-medium">
                            Accompagner les jeunes porteurs de handicap à partir du lycée et leur famille pour mieux les insérer dans l'enseignement supérieur et leur permettre la réussite de leurs études à travers de la sensibilisation et de la mise à disposition d'outils numériques
                        </p>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-16 px-6">
                    <div className="container mx-auto">
                        <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-gray-100">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-brand mb-4">Nos services</h2>
                                <p className="text-gray-500">Tous nos services sont accessibles aux adhérents de l'association</p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {services.map((service, index) => (
                                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                                        <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-6">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Concerns Section */}
                <section className="py-8 px-6 pb-24">
                    <div className="container mx-auto">
                        <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-gray-100">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-brand mb-4">Êtes-vous concerné ?</h2>
                                <p className="text-gray-500 max-w-2xl mx-auto text-sm">
                                    Notre association accompagne les étudiants présentant différents types de handicaps et de troubles pour garantir leur réussite dans l'enseignement supérieur.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                {concerns.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-brand/30 bg-white hover:bg-gray-50 transition-colors">
                                        <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                                        <span className="font-bold text-gray-800">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-12">
                                <p className="text-xl font-bold text-gray-800">Et plein d'autres...</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="py-12 px-6 pb-24">
                    <div className="container mx-auto">
                        <div className="bg-brand rounded-[4rem] p-16 text-center shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4">
                                    Prenez votre premier rendez-vous !
                                </h2>
                                <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
                                    Commencez dès aujourd'hui et bénéficiez d'un accompagnement sur mesure pour votre réussite
                                </p>
                                <Link to="/premier-rdv" className="inline-block px-8 py-3 bg-accent text-brand font-bold rounded-full hover:bg-accent-400 transition-colors shadow-lg">
                                    Prendre rendez-vous maintenant
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fixed Eye Button */}
                {showEye && (
                    <button className="fixed bottom-8 right-8 w-14 h-14 bg-brand rounded-full flex items-center justify-center shadow-2xl hover:bg-brand-600 transition-colors z-50 border-2 border-white">
                        <Eye className="w-6 h-6 text-white" />
                    </button>
                )}
            </div>
            <FooterOther />
        </>
    );
}

export default Home;
