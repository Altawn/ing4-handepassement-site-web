import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderAdmin from '../components/HeaderAdmin';
import FooterMain from '../components/FooterMain';
import Oeil from '../components/Oeil';
import { Users, Calendar, FileText, Clock } from 'lucide-react';
import { getStudentCount, getDashboardStats, getUpcomingAppointments, IncomingRdv } from '../services/airtable';

function AdminHome() {

    const [studentCount, setStudentCount] = useState<number | null>(null);
    const [stats, setStats] = useState({ appointmentsThisMonth: 0, pendingValidations: 0 });
    const [upcomingRdvs, setUpcomingRdvs] = useState<IncomingRdv[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [count, dashboardStats, upcoming] = await Promise.all([
                    getStudentCount(),
                    getDashboardStats(),
                    getUpcomingAppointments(3)
                ]);

                setStudentCount(count);
                setStats(dashboardStats);
                setUpcomingRdvs(upcoming);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
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
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {isLoading ? '...' : stats.appointmentsThisMonth}
                                </h2>
                                <p className="text-xs text-gray-500 mt-2">Ce mois-ci</p>
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
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {isLoading ? '...' : stats.pendingValidations}
                                </h2>
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
                        <Link to="/admin/rdv" className="text-sm font-medium text-brand hover:text-brand-600">
                            Voir tout
                        </Link>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {isLoading ? (
                            <div className="p-6 text-center text-gray-500">Chargement...</div>
                        ) : upcomingRdvs.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">Aucun rendez-vous à venir</div>
                        ) : (
                            upcomingRdvs.map((rdv) => (
                                <div key={rdv.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{rdv.studentName}</h3>
                                            <p className="text-sm text-gray-500">{rdv.type}</p>
                                            <div className="flex items-center mt-2 text-xs text-gray-400">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                <span className="mr-3">
                                                    {new Date(rdv.date).toLocaleDateString()}
                                                </span>
                                                <Clock className="w-3 h-3 mr-1" />
                                                <span>
                                                    {new Date(rdv.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${rdv.status === 'Réalisé' ? 'text-green-700 bg-green-100' :
                                            rdv.status === 'Attente de Validation' ? 'text-yellow-700 bg-yellow-100' :
                                                'text-blue-700 bg-blue-100'
                                            }`}>
                                            {rdv.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <Oeil />
            <FooterMain />
        </div>
    );
}

export default AdminHome;
