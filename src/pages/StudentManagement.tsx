import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderAdmin from '../components/HeaderAdmin';
import FooterMain from '../components/FooterMain';
import { getAllStudents } from '../services/airtable';
import { Eye, Search, Mail, Phone } from 'lucide-react';

interface Student {
    id: string;
    nomComplet: string;
    email: string;
    phone: string;
    handicaps: string[];
    inscription: string;
    dernierRdv: string;
}

function StudentManagement() {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getAllStudents();
                setStudents(data);
            } catch (error) {
                console.error("Failed to fetch students", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <HeaderAdmin />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Gestion des étudiants
                    </h1>
                    <p className="text-gray-500">
                        Liste et détails de tous les étudiants inscrits
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header with Search */}
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-brand">Liste des étudiants</h2>
                            <p className="text-sm text-gray-500">{filteredStudents.length} étudiants trouvés</p>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Rechercher"
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Nom</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Type de handicap</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Inscription</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Dernier RDV</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Chargement des étudiants...
                                        </td>
                                    </tr>
                                ) : filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Aucun étudiant trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{student.nomComplet}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Mail className="w-3 h-3 mr-2" />
                                                        {student.email}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Phone className="w-3 h-3 mr-2" />
                                                        {student.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {student.handicaps.map((handicap, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                                        >
                                                            {handicap}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {/* Empty as requested */}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {/* Empty as requested */}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    to={`/admin/etudiant/${student.id}`}
                                                    className="text-gray-400 hover:text-brand transition-colors flex items-center justify-end gap-2 ml-auto"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                    <span>Détail</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <FooterMain />
        </div>
    );
}

export default StudentManagement;
