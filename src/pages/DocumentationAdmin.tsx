
import { useState, useEffect } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import FooterMain from '../components/FooterMain';
import Oeil from '../components/Oeil';
import {
    getDocumentation,
    createDocumentation,
    deleteDocumentation,
    getAllStudents,
    DocumentationData
} from '../services/airtable';
import { Trash2, Plus, ExternalLink, Check, Search, X } from 'lucide-react';

function DocumentationAdmin() {
    const [docs, setDocs] = useState<DocumentationData[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [students, setStudents] = useState<any[]>([]); // Using any for student structure based on service
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [newDoc, setNewDoc] = useState({
        titre: '',
        description: '',
        contenu: '',
        lien: '',
        sharedWithIds: [] as string[],
        shareMode: 'all' as 'all' | 'select'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [fetchedDocs, fetchedStudents] = await Promise.all([
                getDocumentation(), // Fetch all docs for admin
                getAllStudents()
            ]);
            setDocs(fetchedDocs);
            setStudents(fetchedStudents);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
            try {
                await deleteDocumentation(id);
                setDocs(docs.filter(d => d.id !== id));
            } catch {
                alert("Erreur lors de la suppression");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const sharedIds = newDoc.shareMode === 'all' ? [] : newDoc.sharedWithIds;

            await createDocumentation({
                titre: newDoc.titre,
                description: newDoc.description,
                contenu: newDoc.contenu,
                lien: newDoc.lien,
                sharedWithIds: sharedIds,
                adminName: "Admin" // Simple default, could be dynamic
            });

            setIsModalOpen(false);
            setNewDoc({
                titre: '',
                description: '',
                contenu: '',
                lien: '',
                sharedWithIds: [],
                shareMode: 'all'
            });
            fetchData(); // Refresh list
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Create detailed error:", error);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const msg = error?.error || error?.message || JSON.stringify(error);
            alert("Erreur lors de la création: " + msg);
        }
    };

    const toggleStudentSelection = (studentId: string) => {
        setNewDoc(prev => {
            const exists = prev.sharedWithIds.includes(studentId);
            if (exists) {
                return { ...prev, sharedWithIds: prev.sharedWithIds.filter(id => id !== studentId) };
            } else {
                return { ...prev, sharedWithIds: [...prev.sharedWithIds, studentId] };
            }
        });
    };



    const filteredStudents = students.filter(s =>
        s.nomComplet.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <HeaderAdmin />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestion de la Documentation</h1>
                        <p className="text-gray-500 mt-1">Gérez les ressources partagées avec les étudiants</p>
                    </div>
                    <div className="flex gap-3">

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Ajouter
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Titre</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Description</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Visibilité</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Lien</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Chargement...</td>
                                    </tr>
                                ) : docs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Aucun document trouvé.</td>
                                    </tr>
                                ) : (
                                    docs.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{doc.titre}</td>
                                            <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{doc.description}</td>
                                            <td className="px-6 py-4">
                                                {doc.sharedWithIds.length === 0 ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Tout le monde
                                                    </span>
                                                ) : (
                                                    <div className="flex flex-col gap-1">
                                                        {doc.sharedWithIds.map(id => {
                                                            const student = students.find(s => s.id === id);
                                                            return (
                                                                <span key={id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                                                                    {student ? student.nomComplet : 'Etudiant inconnu'}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {doc.lien && (
                                                    <a href={doc.lien} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Nouveau Document</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    value={newDoc.titre}
                                    onChange={e => setNewDoc({ ...newDoc, titre: e.target.value })}
                                    placeholder="Ex: TDAH - Comprendre les symptômes"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Courte)</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    value={newDoc.description}
                                    onChange={e => setNewDoc({ ...newDoc, description: e.target.value })}
                                    placeholder="Une brève description pour l'aperçu..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (Détaillé)</label>
                                <textarea
                                    rows={6}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    value={newDoc.contenu}
                                    onChange={e => setNewDoc({ ...newDoc, contenu: e.target.value })}
                                    placeholder="Le contenu complet du document..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lien externe</label>
                                <div className="relative">
                                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        value={newDoc.lien}
                                        onChange={e => setNewDoc({ ...newDoc, lien: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Partager avec</label>

                                <div className="flex gap-4 mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="shareMode"
                                            checked={newDoc.shareMode === 'all'}
                                            onChange={() => setNewDoc({ ...newDoc, shareMode: 'all' })}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">Tous les étudiants</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="shareMode"
                                            checked={newDoc.shareMode === 'select'}
                                            onChange={() => setNewDoc({ ...newDoc, shareMode: 'select' })}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">Sélectionner des étudiants</span>
                                    </label>
                                </div>

                                {newDoc.shareMode === 'select' && (
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                            <Search className="w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Rechercher un étudiant..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="bg-transparent border-none focus:outline-none text-sm w-full"
                                            />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                                            {filteredStudents.length === 0 ? (
                                                <p className="text-sm text-gray-400 text-center py-2">Aucun étudiant trouvé.</p>
                                            ) : (
                                                filteredStudents.map(student => (
                                                    <label key={student.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newDoc.sharedWithIds.includes(student.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'
                                                            }`}>
                                                            {newDoc.sharedWithIds.includes(student.id) && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={newDoc.sharedWithIds.includes(student.id)}
                                                            onChange={() => toggleStudentSelection(student.id)}
                                                        />
                                                        <span className="text-sm text-gray-700">{student.nomComplet}</span>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                >
                                    Créer le document
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Oeil />
            <FooterMain />
        </div>
    );
}

export default DocumentationAdmin;
