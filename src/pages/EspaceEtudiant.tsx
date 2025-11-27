import { Calendar, Clock } from 'lucide-react';
import HeaderClient from '../components/HeaderClient';
import FooterMain from '../components/FooterMain';
import Oeil from '../components/Oeil';

function EspaceEtudiant() {

    // Sample data
    const tasks = [
        {
            id: 1,
            title: "Garantie le certificat médical actualisé",
            date: "15 Nov 2025",
            completed: false
        },
        {
            id: 2,
            title: "Compléter le formulaire d'aménagement pour le semestre 2",
            date: "15 Nov 2025",
            completed: false
        },
        {
            id: 3,
            title: "Envoyer les documents requis au secrétariat",
            date: "15 Nov 2025",
            completed: true
        }
    ];

    const pastAppointments = [
        {
            id: 1,
            title: "Premier rendez-vous",
            date: "01 Sep 2025 - 14:30",
            notes: "Étudiant motivé, besoin d'accompagnement pour les examens écrits (dysgraphie). Prochaine étape : mise en place du plan d'accompagnement personnalisé."
        },
        {
            id: 2,
            title: "Suivi pédagogique - Mi-parcours",
            date: "15 Oct 2025 - 10:00",
            notes: "Bonne intégration dans les matières orales/pratiques. Difficultés persistantes en rédaction. Recommandation : session supplémentaire pour réviser les outils adaptés."
        },
        {
            id: 3,
            title: "Point additionnel",
            date: "22 Oct 2025 - 14:30",
            notes: "Bilan semi-semestriel complet. Aménagements validés par la commission. Début de l'accompagnement prévu pour la semaine prochaine."
        }
    ];

    const upcomingAppointments = [
        {
            id: 1,
            title: "Rendez-vous avec Myriam",
            date: "15 Nov 2025 - 14:30"
        }
    ];

    return (
        <>
            <HeaderClient />
            <div className="min-h-screen bg-accent-50 py-8 px-6">
                <div className="container mx-auto max-w-7xl">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                            Bonjour, Marie ! 👋
                        </h1>
                        <p className="text-gray-600">Espace personnel</p>
                    </div>

                    {/* Main Grid - Calendar and Tasks */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-8">
                        {/* Calendar Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Mon calendrier</h2>
                            <div className="space-y-4">
                                {/* Calendar placeholder - you can integrate a real calendar library later */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <button className="text-gray-600 hover:text-brand">←</button>
                                        <h3 className="font-semibold text-gray-900">Novembre 2025</h3>
                                        <button className="text-gray-600 hover:text-brand">→</button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                                        {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day) => (
                                            <div key={day} className="font-semibold text-gray-600 py-2">
                                                {day}
                                            </div>
                                        ))}
                                        {[...Array(30)].map((_, i) => {
                                            const day = i + 1;
                                            const isToday = day === 15;
                                            const hasEvent = [5, 15, 22].includes(day);
                                            return (
                                                <div
                                                    key={i}
                                                    className={`py-2 rounded-lg ${isToday
                                                        ? 'bg-brand text-white font-bold'
                                                        : hasEvent
                                                            ? 'bg-blue-100 text-brand font-semibold'
                                                            : 'text-gray-700'
                                                        }`}
                                                >
                                                    {day}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-3 h-3 bg-brand rounded"></div>
                                            <span className="text-gray-600">Rendez-vous à venir</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-3 h-3 bg-blue-100 rounded"></div>
                                            <span className="text-gray-600">Rendez-vous passé</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tasks Section */}
                        <div className="bg-white rounded-3xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Ma liste de tâches</h2>
                                <span className="text-sm text-gray-500">Actions à réaliser</span>
                            </div>
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            className="mt-1 w-5 h-5 text-brand rounded focus:ring-brand"
                                            readOnly
                                        />
                                        <div className="flex-1">
                                            <p
                                                className={`font-medium ${task.completed
                                                    ? 'text-gray-500 line-through'
                                                    : 'text-gray-900'
                                                    }`}
                                            >
                                                {task.title}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <Clock className="w-4 h-4" />
                                                {task.date}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Past Appointments Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Rendez-vous passés et compte rendu
                        </h2>
                        <div className="space-y-4">
                            {pastAppointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-brand"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {appointment.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <Calendar className="w-4 h-4" />
                                                {appointment.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <p className="text-sm font-semibold text-gray-900 mb-2">Notes:</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {appointment.notes}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Appointments Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Rendez-vous à venir
                            </h2>
                            <button className="text-brand hover:text-brand-600 font-semibold">
                                Voir tout
                            </button>
                        </div>
                        <div className="space-y-4">
                            {upcomingAppointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-400"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {appointment.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {appointment.date}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Accessibility Button */}
                <Oeil />
            </div>
            <FooterMain />
        </>
    );
}

export default EspaceEtudiant;
