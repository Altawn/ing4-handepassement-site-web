import React, { useState } from 'react';
import HeaderClient from '../components/HeaderClient';
import FooterMain from '../components/FooterMain';
import { Calendar as CalendarIcon, Clock, User, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const PriseRDVClient: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2025, 10, 5)); // Nov 5, 2025
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessCancelModal, setShowSuccessCancelModal] = useState(false);
    const [showSuccessConfirmModal, setShowSuccessConfirmModal] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null);

    // Mock data
    const timeSlots = [
        "09:00", "09:30", "10:00", "10:30",
        "11:00", "11:30", "14:00", "14:30",
        "15:00", "15:30", "16:00", "16:30",
        "17:00"
    ];

    const upcomingAppointments = [
        {
            id: 1,
            title: "Rendez-vous avec Myriam",
            date: "Sam 15 Novembre",
            time: "14:00",
            person: "M. Dupont",
            status: "Confirmé"
        }
    ];

    const handleDateClick = (day: number) => {
        setSelectedDate(new Date(2025, 10, day));
        setSelectedTime(null);
    };

    const handleTimeClick = (time: string) => {
        setSelectedTime(time);
    };

    const handleConfirmClick = () => {
        if (selectedDate && selectedTime) {
            // Logic to confirm
            setShowSuccessConfirmModal(true);
            setTimeout(() => setShowSuccessConfirmModal(false), 3000);
        }
    };

    const handleCancelClick = (id: number) => {
        setAppointmentToCancel(id);
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        // Logic to cancel
        if (appointmentToCancel) {
            console.log("Cancelling appointment", appointmentToCancel);
        }
        setShowCancelModal(false);
        setShowSuccessCancelModal(true);
        setTimeout(() => setShowSuccessCancelModal(false), 3000);
    };

    // Calendar generation helper (simplified for Nov 2025)
    const renderCalendar = () => {
        const days = [];
        for (let i = 1; i <= 30; i++) {
            days.push(i);
        }
        // Nov 1 2025 is Saturday (6)
        const emptySlots = Array(6).fill(null);

        return (
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => (
                    <div key={d} className="py-2 font-medium text-gray-500">{d}</div>
                ))}
                {emptySlots.map((_, i) => <div key={`empty-${i}`} />)}
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => handleDateClick(day)}
                        className={`py-2 rounded-full hover:bg-blue-50 ${selectedDate?.getDate() === day
                            ? 'bg-brand text-white hover:bg-brand'
                            : 'text-gray-700'
                            }`}
                    >
                        {day}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <HeaderClient />

            <main className="container mx-auto px-4 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Mes rendez-vous</h1>
                    <p className="text-gray-500">Gérez vos rendez-vous et planifiez en des nouveaux</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Calendar Section */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold text-brand mb-1">Sélectionner une date</h2>
                            <p className="text-gray-500 mb-6">Choisissez la date qui vous convient</p>

                            {/* Simplified Calendar UI mimicking the image */}
                            <div className="border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-lg">Novembre 2025</h3>
                                    <div className="flex gap-2">
                                        <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20} /></button>
                                        <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} /></button>
                                    </div>
                                </div>
                                {renderCalendar()}
                            </div>
                        </div>

                        {/* Time Slots Section */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold text-brand mb-1">Créneaux disponibles</h2>
                            <p className="text-gray-500 mb-6">
                                {selectedDate ? selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Sélectionnez une date'}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => handleTimeClick(time)}
                                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${selectedTime === time
                                            ? 'bg-brand text-white border-brand'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-brand hover:text-brand'
                                            }`}
                                    >
                                        <Clock size={16} />
                                        <span className="font-semibold">{time}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Recap Section */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm h-fit">
                            <h2 className="text-2xl font-semibold text-brand mb-6">Récapitulatif</h2>

                            <div className="flex items-start gap-4 mb-8">
                                <div className="p-2 bg-blue-50 rounded-lg text-brand">
                                    <CalendarIcon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Date</p>
                                    <p className="font-bold text-gray-800 text-lg">
                                        {selectedDate ? selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                    </p>
                                    {selectedTime && (
                                        <p className="font-bold text-gray-800 text-lg mt-1">
                                            à {selectedTime}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmClick}
                                disabled={!selectedTime}
                                className={`w-full py-4 rounded-xl font-bold text-white transition-colors ${selectedTime ? 'bg-slate-500 hover:bg-slate-600' : 'bg-slate-300 cursor-not-allowed'
                                    }`}
                            >
                                Confirmer le rendez-vous
                            </button>
                        </div>

                        {/* Upcoming Appointments */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm h-fit">
                            <h2 className="text-2xl font-semibold text-brand mb-1">Prochains rdv</h2>
                            <p className="text-gray-500 mb-6">{upcomingAppointments.length} rendez-vous à venir</p>

                            <div className="space-y-4">
                                {upcomingAppointments.map((apt) => (
                                    <div key={apt.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                                        <h3 className="font-bold text-gray-800 mb-4">{apt.title}</h3>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-3 text-gray-600 text-sm">
                                                <CalendarIcon size={16} />
                                                <span>{apt.date}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600 text-sm">
                                                <Clock size={16} />
                                                <span>{apt.time}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600 text-sm">
                                                <User size={16} />
                                                <span>{apt.person}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                {apt.status}
                                            </span>
                                            <button
                                                onClick={() => handleCancelClick(apt.id)}
                                                className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-bold uppercase tracking-wider transition-colors"
                                            >
                                                <X size={14} />
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals */}

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-brand mb-2">Annuler le rendez-vous</h3>
                        <p className="text-gray-600 mb-8">
                            Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action est irréversible.
                        </p>
                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-6 py-2 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Non, garder
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="px-6 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                            >
                                Oui, annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Cancel Modal */}
            {showSuccessCancelModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-bold text-brand mb-2">Rendez-vous annulé avec succès</h3>
                        <p className="text-gray-600 mb-6">
                            Votre rendez-vous a été annulé.<br />
                            Vous pouvez planifier un nouveau rendez-vous à tout moment.
                        </p>
                        <button
                            onClick={() => setShowSuccessCancelModal(false)}
                            className="w-full py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}

            {/* Success Confirm Modal */}
            {showSuccessConfirmModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-bold text-brand mb-2">Rendez-vous confirmé !</h3>
                        <p className="text-gray-600 mb-6">
                            Votre rendez-vous a été programmé avec succès.<br />
                            Vous recevrez un email de confirmation prochainement.
                        </p>
                        <button
                            onClick={() => setShowSuccessConfirmModal(false)}
                            className="w-full py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
            <FooterMain />
        </div>
    );
};

export default PriseRDVClient;
