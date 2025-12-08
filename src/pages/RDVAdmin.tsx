import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Edit, X, CheckCircle } from 'lucide-react';
import HeaderAdmin from '../components/HeaderAdmin';
import FooterMain from '../components/FooterMain';
import Oeil from '../components/Oeil';

interface Appointment {
    id: number;
    studentName: string;
    type: string;
    date: string;
    time: string;
    status: 'confirmé' | 'en attente';
    counselor: string;
}

const RDVAdmin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
    const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);

    const [appointments, setAppointments] = useState<Appointment[]>([
        {
            id: 1,
            studentName: 'Marie Dubois',
            type: 'Suivi pédagogique',
            date: '2024-03-15',
            time: '14:00',
            status: 'confirmé',
            counselor: 'Myriam Lefèvre'
        },
        {
            id: 2,
            studentName: 'Pierre Martin',
            type: 'Orientation',
            date: '2024-03-15',
            time: '15:30',
            status: 'confirmé',
            counselor: 'Myriam Lefèvre'
        },
        {
            id: 3,
            studentName: 'Sophie Laurent',
            type: 'Aménagement examens',
            date: '2024-03-16',
            time: '18:00',
            status: 'en attente',
            counselor: 'Myriam Lefèvre'
        }
    ]);

    const [pastAppointments] = useState<Appointment[]>([
        {
            id: 4,
            studentName: 'Jean Dupont',
            type: 'Premier rendez-vous',
            date: '2024-03-10',
            time: '10:00',
            status: 'confirmé',
            counselor: 'Myriam Lefèvre'
        },
        {
            id: 5,
            studentName: 'Alice Martin',
            type: 'Suivi',
            date: '2024-03-08',
            time: '14:30',
            status: 'confirmé',
            counselor: 'Myriam Lefèvre'
        }
    ]);

    const [newAppointment, setNewAppointment] = useState({
        student: '',
        type: '',
        date: '',
        time: ''
    });

    const [editAppointment, setEditAppointment] = useState({
        student: '',
        type: '',
        date: '',
        time: ''
    });

    const [confirmedAppointment, setConfirmedAppointment] = useState({
        date: '',
        time: ''
    });

    const handleCreateAppointment = () => {
        if (newAppointment.student && newAppointment.type && newAppointment.date && newAppointment.time) {
            const appointment: Appointment = {
                id: appointments.length + 1,
                studentName: newAppointment.student,
                type: newAppointment.type,
                date: newAppointment.date,
                time: newAppointment.time,
                status: 'confirmé',
                counselor: 'Myriam Lefèvre'
            };
            setAppointments([...appointments, appointment]);
            setConfirmedAppointment({
                date: newAppointment.date,
                time: newAppointment.time
            });
            setNewAppointment({
                student: '',
                type: '',
                date: '',
                time: ''
            });
            setIsNewAppointmentModalOpen(false);
            setIsConfirmationModalOpen(true);
        }
    };

    const handleEditAppointment = () => {
        if (appointmentToEdit && editAppointment.student && editAppointment.type && editAppointment.date && editAppointment.time) {
            const updatedAppointments = appointments.map(apt =>
                apt.id === appointmentToEdit.id
                    ? {
                        ...apt,
                        studentName: editAppointment.student,
                        type: editAppointment.type,
                        date: editAppointment.date,
                        time: editAppointment.time
                    }
                    : apt
            );
            setAppointments(updatedAppointments);
            setIsEditAppointmentModalOpen(false);
            setAppointmentToEdit(null);
            setEditAppointment({
                student: '',
                type: '',
                date: '',
                time: ''
            });
        }
    };

    const openEditModal = (apt: Appointment) => {
        setAppointmentToEdit(apt);
        setEditAppointment({
            student: apt.studentName,
            type: apt.type,
            date: apt.date,
            time: apt.time
        });
        setIsEditAppointmentModalOpen(true);
    };

    const handleCancelAppointment = (id: number) => {
        setAppointments(appointments.filter(apt => apt.id !== id));
    };

    const upcomingCount = appointments.length;
    const pastCount = pastAppointments.length;

    // Simple calendar component
    const renderCalendar = () => {
        const currentMonth = selectedDate.getMonth();
        const currentYear = selectedDate.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === new Date().getDate() &&
                currentMonth === new Date().getMonth() &&
                currentYear === new Date().getFullYear();
            days.push(
                <div
                    key={day}
                    className={`p-2 text-center text-sm cursor-pointer rounded-lg transition-colors ${isToday
                        ? 'bg-brand text-white font-bold'
                        : 'hover:bg-gray-100'
                        }`}
                >
                    {day}
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Calendrier</h3>
                <p className="text-sm text-gray-500 mb-4">Sélectionner une date</p>

                <div className="mb-4 flex items-center justify-between">
                    <button className="p-1 hover:bg-gray-100 rounded">❮</button>
                    <span className="font-semibold text-gray-900">
                        {monthNames[currentMonth]} {currentYear}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded">❯</button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-500 p-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>
            </div>
        );
    };

    return (
        <>
            <HeaderAdmin />
            <div className="min-h-screen bg-gray-50 py-8 px-6">
                <div className="container mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Gestion des rendez-vous
                            </h1>
                            <p className="text-gray-500">
                                Planifier et gérer tous les rendez-vous
                            </p>
                        </div>
                        <button
                            onClick={() => setIsNewAppointmentModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-400 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Nouveau rendez-vous
                        </button>
                    </div>

                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Calendar */}
                        <div className="lg:col-span-1">
                            {renderCalendar()}
                        </div>

                        {/* Right Column - Appointments */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                {/* Tabs */}
                                <div className="flex border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveTab('upcoming')}
                                        className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'upcoming'
                                            ? 'text-brand border-b-2 border-brand'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        À venir ({upcomingCount})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('past')}
                                        className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'past'
                                            ? 'text-brand border-b-2 border-brand'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Passées ({pastCount})
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">Rendez-vous à venir</h2>
                                        <p className="text-sm text-gray-500">Rendez-vous confirmés et en attente</p>
                                    </div>

                                    <div className="space-y-4">
                                        {activeTab === 'upcoming' && appointments.map((apt) => (
                                            <div key={apt.id} className="border border-gray-200 rounded-lg p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="text-lg font-bold text-gray-900">{apt.studentName}</h3>
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${apt.status === 'confirmé'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                                    }`}
                                                            >
                                                                {apt.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3">{apt.type}</p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <div className="flex items-center gap-1">
                                                                <CalendarIcon className="w-4 h-4" />
                                                                {apt.date}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                {apt.time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                                    <button
                                                        onClick={() => openEditModal(apt)}
                                                        className="inline-flex items-center gap-1 text-gray-700 hover:text-brand font-medium text-sm transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelAppointment(apt.id)}
                                                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 font-medium text-sm transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Annuler
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {activeTab === 'past' && pastAppointments.map((apt) => (
                                            <div key={apt.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{apt.studentName}</h3>
                                                        <p className="text-sm text-gray-600 mb-3">{apt.type}</p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <div className="flex items-center gap-1">
                                                                <CalendarIcon className="w-4 h-4" />
                                                                {apt.date}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                {apt.time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accessibility Button */}
                <Oeil />
            </div>

            {/* New Appointment Modal */}
            {isNewAppointmentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Nouveau rendez-vous</h2>
                                <p className="text-sm text-gray-500 mt-1">Planifier un rendez-vous pour un étudiant</p>
                            </div>
                            <button
                                onClick={() => setIsNewAppointmentModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Étudiant
                                    </label>
                                    <select
                                        value={newAppointment.student}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, student: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    >
                                        <option value="">Sélectionner un étudiant</option>
                                        <option value="Marie Dubois">Marie Dubois</option>
                                        <option value="Pierre Martin">Pierre Martin</option>
                                        <option value="Sophie Laurent">Sophie Laurent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Type de rendez-vous
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Suivi pédagogique, Orientation..."
                                        value={newAppointment.type}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={newAppointment.date}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Heure
                                        </label>
                                        <input
                                            type="time"
                                            value={newAppointment.time}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setNewAppointment({
                                            student: '',
                                            type: '',
                                            date: '',
                                            time: ''
                                        });
                                        setIsNewAppointmentModalOpen(false);
                                    }}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleCreateAppointment}
                                    className="flex-1 py-3 bg-brand hover:bg-brand-400 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Créer le rendez-vous
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Appointment Modal */}
            {isEditAppointmentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Modifier le rendez-vous</h2>
                                <p className="text-sm text-gray-500 mt-1">Mettre à jour les informations du rendez-vous</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsEditAppointmentModalOpen(false);
                                    setAppointmentToEdit(null);
                                    setEditAppointment({
                                        student: '',
                                        type: '',
                                        date: '',
                                        time: ''
                                    });
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Étudiant
                                    </label>
                                    <select
                                        value={editAppointment.student}
                                        onChange={(e) => setEditAppointment({ ...editAppointment, student: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    >
                                        <option value="">Sélectionner un étudiant</option>
                                        <option value="Marie Dubois">Marie Dubois</option>
                                        <option value="Pierre Martin">Pierre Martin</option>
                                        <option value="Sophie Laurent">Sophie Laurent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Type de rendez-vous
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Suivi pédagogique, Orientation..."
                                        value={editAppointment.type}
                                        onChange={(e) => setEditAppointment({ ...editAppointment, type: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={editAppointment.date}
                                            onChange={(e) => setEditAppointment({ ...editAppointment, date: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Heure
                                        </label>
                                        <input
                                            type="time"
                                            value={editAppointment.time}
                                            onChange={(e) => setEditAppointment({ ...editAppointment, time: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setIsEditAppointmentModalOpen(false);
                                        setAppointmentToEdit(null);
                                        setEditAppointment({
                                            student: '',
                                            type: '',
                                            date: '',
                                            time: ''
                                        });
                                    }}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleEditAppointment}
                                    className="flex-1 py-3 bg-brand hover:bg-brand-400 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Confirmation Modal */}
            {isConfirmationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Rendez-vous confirmé !
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Votre premier rendez-vous a été programmé avec succès pour le
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-2">
                            <p className="font-bold text-gray-900 text-lg">
                                {confirmedAppointment.date ? new Date(confirmedAppointment.date).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }) : ''}
                            </p>
                            <p className="text-gray-600 mt-1">à</p>
                            <p className="font-bold text-gray-900 text-lg">{confirmedAppointment.time}</p>
                        </div>
                        <button
                            onClick={() => setIsConfirmationModalOpen(false)}
                            className="w-full py-3 bg-brand hover:bg-brand-400 text-white font-semibold rounded-lg transition-colors mt-4"
                        >
                            Retour à l'accueil
                        </button>
                        <p className="text-sm text-gray-500 mt-4">
                            Vous allez recevoir un email de confirmation avec tous les détails.
                        </p>
                    </div>
                </div>
            )}

            <FooterMain />
        </>
    );
};

export default RDVAdmin;
