
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderClient from '../components/HeaderClient';
import FooterMain from '../components/FooterMain';
import Oeil from '../components/Oeil';
import { getDocumentation, DocumentationData } from '../services/airtable';
import { FileText, ExternalLink, X } from 'lucide-react';

function Documentation() {
    const navigate = useNavigate();
    const [docs, setDocs] = useState<DocumentationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<DocumentationData | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // If Student, pass ID to filter.
            // If the user role is 'Etudiant', we pass the ID.
            if (parsedUser.id) {
                getDocumentation(parsedUser.id).then(data => {
                    setDocs(data);
                    setLoading(false);
                });
            }
        } else {
            navigate('/connexion');
        }
    }, [navigate]);

    return (
        <>
            <HeaderClient />
            <div className="min-h-screen bg-gray-50 py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Documentation</h1>
                        <p className="text-gray-500 text-lg">Ressources et guides mis à votre disposition.</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500">Chargement des documents...</p>
                        </div>
                    ) : docs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">Aucune documentation disponible</h3>
                            <p className="text-gray-500 mt-2">Vous n'avez accès à aucun document pour le moment.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {docs.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col cursor-pointer group"
                                    onClick={() => setSelectedDoc(doc)}
                                >
                                    <div className="p-8 flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            {doc.lien && <ExternalLink className="w-5 h-5 text-gray-300" />}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {doc.titre}
                                        </h3>
                                        <p className="text-gray-500 leading-relaxed line-clamp-3">
                                            {doc.description}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                            Consulter
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal */}
                {selectedDoc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div
                            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 pr-8">
                                        {selectedDoc.titre}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedDoc(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="prose prose-blue max-w-none text-gray-700">
                                    {selectedDoc.description && (
                                        <div className="mb-6 text-lg text-gray-600 leading-relaxed border-b border-gray-100 pb-6">
                                            {selectedDoc.description}
                                        </div>
                                    )}

                                    {selectedDoc.contenu && (
                                        <div className="mb-8 whitespace-pre-wrap leading-relaxed">
                                            {selectedDoc.contenu}
                                        </div>
                                    )}

                                    {selectedDoc.lien && (
                                        <a
                                            href={selectedDoc.lien.startsWith('http') ? selectedDoc.lien : `https://${selectedDoc.lien}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Accéder à la ressource externe
                                        </a>
                                    )}

                                    {!selectedDoc.contenu && !selectedDoc.lien && (
                                        <p className="text-gray-400 italic">Aucun contenu supplémentaire disponible.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Oeil />
            </div>
            <FooterMain />
        </>
    );
}

export default Documentation;
