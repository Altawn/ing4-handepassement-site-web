import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Calendar, Trash2, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import HeaderAdmin from '../components/HeaderAdmin';
import FooterMain from '../components/FooterMain';
import Oeil from '../components/Oeil';
import { getStudent, getTasksForStudent, createTask, updateTaskStatus, Task, getStudentRdvs, StudentRdv, updateRdvSummary } from '../services/airtable';



const DetailEtudiant: React.FC = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'historique' | 'nouveau'>('historique');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Student info
    const [studentInfo, setStudentInfo] = useState({
        fullName: '',
        birthDate: '',
        email: '',
        phone: '',
        address: '',
        university: '',
        filiere: '',
        handicapType: '',
        inscriptionDate: '',
        status: ''
    });

    // Tasks
    const [tasks, setTasks] = useState<Task[]>([]);

    // RDVs
    const [rdvs, setRdvs] = useState<StudentRdv[]>([]);
    const [selectedRdvId, setSelectedRdvId] = useState('');
    const [summaryContent, setSummaryContent] = useState('');
    const [isSubmittingSummary, setIsSubmittingSummary] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const student = await getStudent(id);
                if (student) {
                    setStudentInfo({
                        fullName: `${student.prenom} ${student.nom}`,
                        birthDate: "01/01/2000", // Placeholder or fetch if available
                        email: student.email,
                        phone: student.phone,
                        address: "Adresse non renseignée", // Placeholder
                        university: student.university,
                        filiere: student.fieldOfStudy + " " + student.studyLevel,
                        handicapType: student.disabilityTypes.join(', '),
                        inscriptionDate: "01/09/2023", // Placeholder
                        status: student.statut || ''
                    });
                }
                const fetchedTasks = await getTasksForStudent(id);
                setTasks(fetchedTasks);

                const fetchedRdvs = await getStudentRdvs(id);
                setRdvs(fetchedRdvs);
            } catch (error) {
                console.error("Error loading data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const [newTask, setNewTask] = useState({
        title: '',
        date: ''
    });

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleAddTask = async () => {
        if (newTask.title && newTask.date && id) {
            try {
                await createTask(newTask.title, newTask.date, id);
                // Refresh tasks with a slight delay
                setTimeout(async () => {
                    const fetchedTasks = await getTasksForStudent(id);
                    setTasks(fetchedTasks);
                }, 500);

                setNewTask({ title: '', date: '' });
                setIsNewTaskModalOpen(false);
            } catch (error) {
                console.error("Failed to create task", error);
            }
        }
    };

    // Form logic
    const handleSaveSummary = async () => {
        if (!selectedRdvId || !summaryContent) return;

        setIsSubmittingSummary(true);
        try {
            await updateRdvSummary(selectedRdvId, summaryContent);

            // Refresh data
            if (id) {
                const fetchedRdvs = await getStudentRdvs(id);
                setRdvs(fetchedRdvs);
            }

            setSummaryContent('');
            setSelectedRdvId('');
            setActiveTab('historique');
        } catch (error) {
            console.error("Failed to save summary", error);
            alert("Erreur lors de l'enregistrement du compte-rendu.");
        } finally {
            setIsSubmittingSummary(false);
        }
    };

    const activeTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;

    return (
        <>
            <HeaderAdmin />
            <div className="min-h-screen bg-white py-8 px-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
                    </div>
                ) : (
                    <div className="container mx-auto max-w-7xl">
                        {/* Header with Back Button */}
                        <div className="mb-6">
                            <Link
                                to="/admin/gestion-etudiants"
                                className="inline-flex items-center text-brand hover:text-brand-400 transition-colors mb-4"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                <span className="font-medium">Retour</span>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Profil de {studentInfo.fullName}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-gray-500 font-medium">Gestion complète du dossier étudiant</p>
                                    {studentInfo.status && (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${studentInfo.status === 'validation' ? 'bg-green-100 text-green-700' :
                                            studentInfo.status === 'Étudiant' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {studentInfo.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Grid */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Left Column - Student Info */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Personal Information */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-brand mb-1">Informations personnelles</h2>
                                            <p className="text-sm text-gray-500">Détails et coordonnées de l'étudiant</p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Modifier
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Nom complet</label>
                                            <p className="text-base text-gray-900 mt-1">{studentInfo.fullName}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Date de naissance</label>
                                            <p className="text-base text-gray-900 mt-1">{studentInfo.birthDate}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Email</label>
                                            <p className="text-base text-gray-900 mt-1">{studentInfo.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Téléphone</label>
                                            <p className="text-base text-gray-900 mt-1">{studentInfo.phone}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-600">Adresse</label>
                                            <p className="text-base text-gray-900 mt-1">{studentInfo.address}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Université</label>
                                            <p className="text-base text-gray-900 mt-1">{studentInfo.university}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Filière</label>
                                            <p className="text-base text-gray-900 mt-1">{studentInfo.filiere}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Type de handicap</label>
                                            <p className="inline-block px-3 py-1 bg-blue-50 text-brand rounded-full text-sm font-medium mt-1">
                                                {studentInfo.handicapType}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Date d'inscription</label>
                                            <p className="text-base text-gray-900 mt-1">{studentInfo.inscriptionDate}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-brand mb-1">Notes des rendez-vous</h2>
                                        <p className="text-sm text-gray-500">Historique et comptes-rendus des rendez-vous passés</p>
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex items-center gap-4 border-b border-gray-200 mb-6">
                                        <button
                                            onClick={() => setActiveTab('historique')}
                                            className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'historique'
                                                ? 'text-brand border-b-2 border-brand'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Historique
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('nouveau')}
                                            className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'nouveau'
                                                ? 'text-brand border-b-2 border-brand'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Nouveau compte-rendu
                                        </button>
                                    </div>

                                    {/* Tab Content */}
                                    {activeTab === 'historique' && (
                                        <div className="space-y-5">
                                            {rdvs.filter(r => r.status === 'Réalisé' || r.isPast).length === 0 ? (
                                                <p className="text-gray-500 text-center py-4">Aucun rendez-vous passé ou réalisé.</p>
                                            ) : (
                                                rdvs.filter(r => r.status === 'Réalisé' || r.isPast).map((rdv) => (
                                                    <div key={rdv.id} className="border border-gray-200 rounded-xl p-5">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                                    <Calendar className="w-5 h-5 text-brand" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-900">{rdv.date}</p>
                                                                    <p className="text-sm text-gray-500">{rdv.type}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700 leading-relaxed mb-3">
                                                            <span className="font-semibold block mb-1">Résumé :</span>
                                                            {rdv.notes}
                                                        </p>
                                                        <p className="text-xs text-gray-400">Lieu: {rdv.lieu}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'nouveau' && (
                                        <div className="space-y-5">
                                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                                                <p className="text-sm text-blue-800">
                                                    Sélectionnez un rendez-vous pour ajouter ou modifier son compte-rendu.
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Rendez-vous concerné
                                                </label>
                                                <select
                                                    value={selectedRdvId}
                                                    onChange={(e) => {
                                                        const rId = e.target.value;
                                                        setSelectedRdvId(rId);
                                                        if (rId) {
                                                            const r = rdvs.find(rd => rd.id === rId);
                                                            setSummaryContent(r?.notes === "Aucun compte-rendu disponible." ? "" : r?.notes || "");
                                                        } else {
                                                            setSummaryContent("");
                                                        }
                                                    }}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent bg-white"
                                                >
                                                    <option value="">Sélectionner un rendez-vous...</option>
                                                    {rdvs.map(r => (
                                                        <option key={r.id} value={r.id}>
                                                            {r.date} - {r.type} ({r.status})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Compte-rendu du rendez-vous
                                                </label>
                                                <textarea
                                                    rows={6}
                                                    placeholder="Décrivez le déroulement du rendez-vous..."
                                                    value={summaryContent}
                                                    onChange={(e) => setSummaryContent(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                                                />
                                            </div>
                                            <button
                                                onClick={handleSaveSummary}
                                                disabled={!selectedRdvId || !summaryContent || isSubmittingSummary}
                                                className={`w-full py-3 font-semibold rounded-lg transition-colors ${!selectedRdvId || !summaryContent || isSubmittingSummary
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-brand hover:bg-brand-400 text-white'
                                                    }`}
                                            >
                                                {isSubmittingSummary ? 'Enregistrement...' : 'Enregistrer le compte-rendu'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Tasks */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-8">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-brand mb-1">Liste de tâches</h2>
                                        <p className="text-sm text-gray-500">Suivi des actions à entreprendre</p>
                                    </div>

                                    {/* New Task Button */}
                                    <button
                                        onClick={() => setIsNewTaskModalOpen(true)}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-400 text-brand font-semibold rounded-lg transition-colors mb-6"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Nouvelle tâche
                                    </button>

                                    {/* Task Stats */}
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Tâches actives</p>
                                            <p className="text-2xl font-bold text-brand">{activeTasks}</p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Tâches terminées</p>
                                            <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                                        </div>
                                    </div>

                                    {/* Tasks List */}
                                    <div className="space-y-4">
                                        {tasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className={`p-4 border rounded-xl transition-all ${task.completed
                                                    ? 'border-green-200 bg-green-50'
                                                    : 'border-gray-200 bg-white hover:shadow-md'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={task.completed}
                                                            onChange={async () => {
                                                                // Optimistic
                                                                const newStatus = !task.completed;
                                                                setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: newStatus } : t));
                                                                try {
                                                                    await updateTaskStatus(task.id, newStatus);
                                                                } catch (e) {
                                                                    // Revert
                                                                    setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !newStatus } : t));
                                                                }
                                                            }}
                                                            className="mt-1 w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
                                                        />
                                                        <div className="flex-1">
                                                            <p
                                                                className={`font-medium text-sm ${task.completed
                                                                    ? 'text-gray-400 line-through'
                                                                    : 'text-gray-900'
                                                                    }`}
                                                            >
                                                                {task.title}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">{task.date}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Accessibility Button */}
                <Oeil />
            </div>

            {/* Edit Student Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-brand">Informations personnelles</h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-5 py-2 bg-brand text-white font-semibold rounded-lg hover:bg-brand-400 transition-colors"
                                >
                                    Enregistrer
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-5 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            <p className="text-sm text-gray-500 mb-6">Détails et coordonnées de l'étudiant</p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nom complet
                                    </label>
                                    <input
                                        type="text"
                                        value={studentInfo.fullName}
                                        onChange={(e) => setStudentInfo({ ...studentInfo, fullName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date de naissance
                                    </label>
                                    <input
                                        type="text"
                                        value={studentInfo.birthDate}
                                        onChange={(e) => setStudentInfo({ ...studentInfo, birthDate: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={studentInfo.email}
                                        onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        value={studentInfo.phone}
                                        onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        value={studentInfo.address}
                                        onChange={(e) => setStudentInfo({ ...studentInfo, address: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Université
                                    </label>
                                    <input
                                        type="text"
                                        value={studentInfo.university}
                                        onChange={(e) => setStudentInfo({ ...studentInfo, university: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Filière
                                    </label>
                                    <input
                                        type="text"
                                        value={studentInfo.filiere}
                                        onChange={(e) => setStudentInfo({ ...studentInfo, filiere: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Type de handicap
                                    </label>
                                    <input
                                        type="text"
                                        value={studentInfo.handicapType}
                                        onChange={(e) => setStudentInfo({ ...studentInfo, handicapType: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date d'inscription
                                    </label>
                                    <input
                                        type="text"
                                        value={studentInfo.inscriptionDate}
                                        onChange={(e) => setStudentInfo({ ...studentInfo, inscriptionDate: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Task Modal */}
            {isNewTaskModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-brand">Nouvelle tâche</h2>
                            <button
                                onClick={() => setIsNewTaskModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Titre de la tâche
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Renouveler le certificat MDPH"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date d'échéance
                                    </label>
                                    <input
                                        type="date"
                                        value={newTask.date}
                                        onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleAddTask}
                                    className="flex-1 py-3 bg-brand hover:bg-brand-400 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Ajouter
                                </button>
                                <button
                                    onClick={() => {
                                        setNewTask({ title: '', date: '' });
                                        setIsNewTaskModalOpen(false);
                                    }}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <FooterMain />
        </>
    );
};

export default DetailEtudiant;
