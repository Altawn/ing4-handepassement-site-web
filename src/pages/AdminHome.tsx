import { useState, useEffect } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import FooterMain from '../components/FooterMain';
import Oeil from '../components/Oeil';
import { Users, Calendar, FileText, Clock } from 'lucide-react';
import { getStudentCount } from '../services/airtable';

function AdminHome() {
    const [studentCount, setStudentCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const count = await getStudentCount();
                setStudentCount(count);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <HeaderAdmin />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Tableau de bord administrateur
                </h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Active Students Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Étudiants actifs</p>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {isLoading ? '...' : studentCount}
                                </h2>
                                <p className="text-xs text-gray-500 mt-2">+12 ce mois</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Appointments Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Rendez-vous ce mois</p>
                                <h2 className="text-3xl font-bold text-gray-900">19</h2>
                                <p className="text-xs text-gray-500 mt-2">+5 cette semaine</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Actions à valider</p>
                                <h2 className="text-3xl font-bold text-gray-900">23</h2>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <FileText className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-brand">Rendez-vous à venir</h2>
                            <p className="text-sm text-gray-500">Prochains rendez-vous planifiés</p>
                        </div>
                        <button className="text-sm font-medium text-brand hover:text-brand-600">
                            Voir tout
                        </button>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {/* Appointment Item 1 */}
                        <div className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Marie Dubois</h3>
                                    <p className="text-sm text-gray-500">Suivi aménagement</p>
                                    <div className="flex items-center mt-2 text-xs text-gray-400">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        <span className="mr-3">2024-03-15</span>
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span>14:00</span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                    confirmé
                                </span>
                            </div>
                        </div>

                        {/* Appointment Item 2 */}
                        <div className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Pierre Martin</h3>
                                    <p className="text-sm text-gray-500">Premier Rendez-vous</p>
                                    <div className="flex items-center mt-2 text-xs text-gray-400">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        <span className="mr-3">2024-03-15</span>
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span>15:30</span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                    confirmé
                                </span>
                            </div>
                        </div>

                        {/* Appointment Item 3 */}
                        <div className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Sophie Laurent</h3>
                                    <p className="text-sm text-gray-500">Premier Rendez-vous</p>
                                    <div className="flex items-center mt-2 text-xs text-gray-400">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        <span className="mr-3">2024-03-16</span>
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span>10:00</span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                                    en attente
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Oeil />
            <FooterMain />
        </div>
    );
}

export default AdminHome;
