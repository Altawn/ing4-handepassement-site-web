import React, { useState } from 'react';
import { FileText, Plus, ExternalLink, Search, Edit, Trash2, CheckCircle } from 'lucide-react';
import HeaderAdmin from '../components/HeaderAdmin';
import FooterMain from '../components/FooterMain';
import Oeil from '../components/Oeil';

interface Documentation {
    id: number;
    title: string;
    description: string;
    link: string;
    lastModified: string;
}

const DocumentationAdmin: React.FC = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
    const [documentToEdit, setDocumentToEdit] = useState<Documentation | null>(null);

    const [documents, setDocuments] = useState<Documentation[]>([
        {
            id: 1,
            title: "Guide pour accompagner la dyslexie dans l'enseignement",
            description: "Ressources et stratégies pédagogiques",
            link: "https://example.com/dyslexie",
            lastModified: "2024-03-10"
        },
        {
            id: 2,
            title: "Aménagements pour le TDAH et ses aménagements",
            description: "Techniques et outils pratiques",
            link: "https://example.com/tdah",
            lastModified: "2024-03-10"
        },
        {
            id: 3,
            title: "Accompagnement des étudiants autistes",
            description: "Adaptation et inclusion",
            link: "https://example.com/autisme",
            lastModified: "2024-03-10"
        }
    ]);

    const [newDocument, setNewDocument] = useState({
        title: '',
        description: '',
        link: ''
    });

    const [editDocument, setEditDocument] = useState({
        title: '',
        description: '',
        link: ''
    });

    const handleAddDocument = () => {
        if (newDocument.title && newDocument.description && newDocument.link) {
            const doc: Documentation = {
                id: documents.length + 1,
                title: newDocument.title,
                description: newDocument.description,
                link: newDocument.link,
                lastModified: new Date().toISOString().split('T')[0]
            };
            setDocuments([...documents, doc]);
            setNewDocument({ title: '', description: '', link: '' });
            setIsAddModalOpen(false);
        }
    };

    const handleEditDocument = () => {
        if (documentToEdit && editDocument.title && editDocument.description && editDocument.link) {
            const updatedDocuments = documents.map(doc =>
                doc.id === documentToEdit.id
                    ? {
                        ...doc,
                        title: editDocument.title,
                        description: editDocument.description,
                        link: editDocument.link,
                        lastModified: new Date().toISOString().split('T')[0]
                    }
                    : doc
            );
            setDocuments(updatedDocuments);
            setIsEditModalOpen(false);
            setDocumentToEdit(null);
            setEditDocument({ title: '', description: '', link: '' });
        }
    };

    const handleDeleteDocument = () => {
        if (documentToDelete !== null) {
            setDocuments(documents.filter(doc => doc.id !== documentToDelete));
            setIsDeleteModalOpen(false);
            setIsSuccessModalOpen(true);
            setDocumentToDelete(null);
        }
    };

    const openDeleteModal = (id: number) => {
        setDocumentToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const openEditModal = (doc: Documentation) => {
        setDocumentToEdit(doc);
        setEditDocument({
            title: doc.title,
            description: doc.description,
            link: doc.link
        });
        setIsEditModalOpen(true);
    };

    const filteredDocuments = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <HeaderAdmin />
            <div className="min-h-screen bg-gray-50 py-8 px-6">
                <div className="container mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Gestion de la documentation
                        </h1>
                        <p className="text-gray-500">
                            Gérer les ressources et informations sur les différents types de handicaps
                        </p>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <FileText className="w-6 h-6 text-brand" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
                                <p className="text-sm text-gray-500">Ressources documentaires</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-400 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Ajouter une documentation
                        </button>
                    </div>

                    {/* Documents List */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Liste des documentations</h2>
                                    <p className="text-sm text-gray-500">Gérer les ressources disponibles pour les étudiants</p>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Rechercher"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                            Lien
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                            Dernière modification
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredDocuments.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="mb-1">
                                                    <p className="font-medium text-gray-900">{doc.title}</p>
                                                    <p className="text-sm text-gray-500">{doc.description}</p>
                                                </div>
                                                <a
                                                    href={doc.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-brand hover:text-brand-400 text-sm font-medium transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    Voir le lien
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {doc.lastModified}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => openEditModal(doc)}
                                                        className="inline-flex items-center gap-1 text-brand hover:text-brand-400 font-medium text-sm transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(doc.id)}
                                                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 font-medium text-sm transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Accessibility Button */}
                <Oeil />
            </div>

            {/* Add Document Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Ajouter un document</h2>
                                <p className="text-sm text-gray-500 mt-1">Ajouter un nouveau document sur le site</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Titre
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Sélectionner un titre"
                                        value={newDocument.title}
                                        onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Courte Description..."
                                        value={newDocument.description}
                                        onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Lien du document
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="PDF, Notion, Google Docs..."
                                        value={newDocument.link}
                                        onChange={(e) => setNewDocument({ ...newDocument, link: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setNewDocument({ title: '', description: '', link: '' });
                                        setIsAddModalOpen(false);
                                    }}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleAddDocument}
                                    className="flex-1 py-3 bg-brand hover:bg-brand-400 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Ajouter le document
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Document Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Modifier le document</h2>
                                <p className="text-sm text-gray-500 mt-1">Mettre à jour les informations du document</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsEditModalOpen(false);
                                    setDocumentToEdit(null);
                                    setEditDocument({ title: '', description: '', link: '' });
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Titre
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Sélectionner un titre"
                                        value={editDocument.title}
                                        onChange={(e) => setEditDocument({ ...editDocument, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Courte Description..."
                                        value={editDocument.description}
                                        onChange={(e) => setEditDocument({ ...editDocument, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Lien du document
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="PDF, Notion, Google Docs..."
                                        value={editDocument.link}
                                        onChange={(e) => setEditDocument({ ...editDocument, link: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setDocumentToEdit(null);
                                        setEditDocument({ title: '', description: '', link: '' });
                                    }}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleEditDocument}
                                    className="flex-1 py-3 bg-brand hover:bg-brand-400 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Supprimer la documentation
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Êtes-vous sûr de vouloir supprimer cette documentation ? Cette action est irréversible et la ressource ne sera plus accessible aux étudiants.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setDocumentToDelete(null);
                                }}
                                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Non, garder
                            </button>
                            <button
                                onClick={handleDeleteDocument}
                                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                Oui, supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Documentation supprimée avec succès
                        </h2>
                        <p className="text-gray-600 mb-6">
                            La documentation a été supprimée avec succès.
                        </p>
                        <button
                            onClick={() => setIsSuccessModalOpen(false)}
                            className="w-full py-3 bg-brand hover:bg-brand-400 text-white font-semibold rounded-lg transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}

            <FooterMain />
        </>
    );
};

export default DocumentationAdmin;
