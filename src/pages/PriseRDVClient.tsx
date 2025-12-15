import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderClient from '../components/HeaderClient';
import FooterMain from '../components/FooterMain';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, MapPin, Video, CheckCircle, XCircle } from 'lucide-react';
import { createRdv, getAppointmentsForStudent, IncomingRdv, cancelRdv } from '../services/airtable';
import { sendRdvConfirmationEmail } from '../services/email';

const PriseRDVClient: React.FC = () => {
    const navigate = useNavigate();

    // User State
    const [user, setUser] = useState<any>(null);

    // Booking State
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [appointmentType, setAppointmentType] = useState<'presential' | 'video' | null>(null);
    const [comment, setComment] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // UI State
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessConfirmModal, setShowSuccessConfirmModal] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data State
    const [upcomingAppointments, setUpcomingAppointments] = useState<IncomingRdv[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchAppointments(parsedUser.id);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const fetchAppointments = async (studentId: string) => {
        const apps = await getAppointmentsForStudent(studentId);
        // Filter out past appointments or just show all sorted? User said "prochain rdv", usually implies future.
        // Let's filter client side for now to be safe, although API sorts them.
        const now = new Date();
        const futureApps = apps.filter(a => new Date(a.date) >= now);
        setUpcomingAppointments(futureApps);
    };

    const timeSlots = [
        "09:00", "09:30", "10:00", "10:30",
        "11:00", "11:30", "14:00", "14:30",
        "15:00", "15:30", "16:00", "16:30",
        "17:00"
    ];

    // Calendar Helpers (Same as FirstRdvStep2)
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
        return { daysInMonth, startingDayOfWeek };
    };

    const isSameDay = (date1: Date | null, date2: Date) => {
        if (!date1) return false;
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (isPastDate(newDate)) return;
        setSelectedDate(newDate);
        setSelectedTime(null);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleConfirmBooking = async () => {
        if (selectedDate && selectedTime && appointmentType && user) {
            setIsSubmitting(true);
            setError(null);

            try {
                // Parse time
                const [hours, minutes] = selectedTime.split(':').map(Number);
                const rdvDate = new Date(selectedDate);
                rdvDate.setHours(hours, minutes);

                const lienVisio = appointmentType === 'video' ? 'Lien Meet' : '';
                const lieu = appointmentType === 'presential' ? 'Bureau Handepassement' : '';

                await createRdv({
                    date: rdvDate,
                    type: appointmentType === 'presential' ? 'Présentiel' : 'Visio',
                    status: 'Attente de Validation',
                    lieu: lieu,
                    lienVisio: lienVisio,
                    commentaires: comment,
                    studentEmail: user['Adresse mail'],
                    admin: 'Myriam'
                });

                // Send Email
                const formattedDate = rdvDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                await sendRdvConfirmationEmail({
                    to_email: user['Adresse mail'],
                    to_name: user["Nom Complet"] || "Étudiant",
                    date: formattedDate,
                    time: selectedTime,
                    type: appointmentType === 'presential' ? 'Présentiel' : 'Visio',
                    location: appointmentType === 'presential' ? 'Bureau Handepassement' : 'Google Meet',
                    notes: comment
                });

                setShowSuccessConfirmModal(true);
                // Refresh list
                await fetchAppointments(user.id);

                // Reset selection
                setSelectedDate(null);
                setSelectedTime(null);
                setAppointmentType(null);
                setComment('');

            } catch (err) {
                console.error("Error booking rdv:", err);
                setError("Erreur lors de la réservation. Veuillez réessayer.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Calendar Generation
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    // Adjusted empty days for Mon-Sun start if needed, but sticking to Sun=0 standard for now
    // Actually, French calendar usually starts Monday. 
    // If startingDayOfWeek is 0 (Sunday), we need 6 empty slots if we start on Monday.
    // If startingDayOfWeek is 1 (Monday), we need 0 empty slots.
    // Let's standardise on Mon-Sun grid:
    // Columns: Lu, Ma, Me, Je, Ve, Sa, Di
    // Sun=0 -> needs 6 empty. Mon=1 -> needs 0. Tue=2 -> needs 1.
    const emptySlotsCount = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });


    return (
        <div className="min-h-screen bg-white font-sans">
            <HeaderClient />

            <main className="container mx-auto px-4 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Mes rendez-vous</h1>
                    <p className="text-gray-500">Gérez vos rendez-vous et planifiez en des nouveaux</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Booking */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Appointment Type Section */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold text-brand mb-2">Type de rendez-vous</h2>
                            <p className="text-gray-500 mb-6">Comment souhaitez-vous effectuer ce rendez-vous ?</p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setAppointmentType('presential')}
                                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${appointmentType === 'presential'
                                        ? 'border-brand bg-brand/5 ring-1 ring-brand'
                                        : 'border-gray-200 hover:border-brand/50'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${appointmentType === 'presential' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <span className={`block font-bold ${appointmentType === 'presential' ? 'text-brand' : 'text-gray-900'
                                            }`}>En présentiel</span>
                                        <span className="text-sm text-gray-500">Au bureau Handepassement</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setAppointmentType('video')}
                                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${appointmentType === 'video'
                                        ? 'border-brand bg-brand/5 ring-1 ring-brand'
                                        : 'border-gray-200 hover:border-brand/50'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${appointmentType === 'video' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        <Video className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <span className={`block font-bold ${appointmentType === 'video' ? 'text-brand' : 'text-gray-900'
                                            }`}>En visio</span>
                                        <span className="text-sm text-gray-500">Via Google Meet</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Calendar Section */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold text-brand mb-1">Sélectionner une date</h2>
                            <p className="text-gray-500 mb-6">Choisissez la date qui vous convient</p>

                            <div className="border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-lg capitalize">{monthName}</h3>
                                    <div className="flex gap-2">
                                        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20} /></button>
                                        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} /></button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                    {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => (
                                        <div key={d} className="py-2 font-medium text-gray-500">{d}</div>
                                    ))}
                                    {emptySlots.map((_, i) => <div key={`empty-${i}`} />)}
                                    {days.map(day => {
                                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                        const isSelected = isSameDay(selectedDate, date);
                                        const isToday = isSameDay(new Date(), date);
                                        const isPast = isPastDate(date);

                                        return (
                                            <button
                                                key={day}
                                                onClick={() => handleDateClick(day)}
                                                disabled={isPast}
                                                className={`py-2 rounded-full hover:bg-blue-50 relative ${isPast
                                                    ? 'text-gray-300 cursor-not-allowed hover:bg-transparent'
                                                    : isSelected
                                                        ? 'bg-brand text-white hover:bg-brand'
                                                        : 'text-gray-700'
                                                    }`}
                                            >
                                                {day}
                                                {isToday && !isSelected && !isPast && (
                                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand rounded-full"></div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Time Slots Section */}
                        {selectedDate && (
                            <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm animate-in fade-in slide-in-from-top-4">
                                <h2 className="text-2xl font-semibold text-brand mb-1">Créneaux disponibles</h2>
                                <p className="text-gray-500 mb-6">
                                    {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
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
                        )}

                        {/* Comment Section */}
                        {selectedTime && (
                            <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm animate-in fade-in slide-in-from-top-4">
                                <h2 className="text-2xl font-semibold text-brand mb-2">Message (Optionnel)</h2>
                                <p className="text-gray-500 mb-6">Avez-vous des précisions à nous apporter ?</p>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Bonjour, j'aimerais aborder..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent min-h-[100px] resize-y"
                                ></textarea>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Summary & Existing RDV */}
                    <div className="space-y-8 sticky top-4 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar">
                        {/* Recap Section */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold text-brand mb-6">Récapitulatif</h2>

                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-2 bg-blue-50 rounded-lg text-brand">
                                    <CalendarIcon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Date</p>
                                    <p className="font-bold text-gray-800 text-lg capitalize">
                                        {selectedDate ? selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                    </p>
                                    {selectedTime && (
                                        <p className="font-bold text-gray-800 text-lg mt-1">
                                            à {selectedTime}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-4 mb-8">
                                <div className="p-2 bg-blue-50 rounded-lg text-brand">
                                    {appointmentType === 'video' ? <Video size={24} /> : <MapPin size={24} />}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Type</p>
                                    <p className="font-bold text-gray-800 text-lg">
                                        {appointmentType === 'presential' ? 'En présentiel' : appointmentType === 'video' ? 'En visio' : '-'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmBooking}
                                disabled={!selectedDate || !selectedTime || !appointmentType || isSubmitting}
                                className={`w-full py-4 rounded-xl font-bold text-white transition-colors flex justify-center items-center ${selectedDate && selectedTime && appointmentType && !isSubmitting ? 'bg-brand hover:bg-brand-600' : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Confirmer le rendez-vous'
                                )}
                            </button>
                            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                        </div>

                        {/* Upcoming Appointments */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm h-fit">
                            <h2 className="text-2xl font-semibold text-brand mb-1">Prochains rdv</h2>
                            <p className="text-gray-500 mb-6">
                                {upcomingAppointments.length} rendez-vous à venir
                            </p>

                            <div className="space-y-4">
                                {upcomingAppointments.length === 0 ? (
                                    <p className="text-gray-400 italic text-center py-4">Aucun rendez-vous à venir</p>
                                ) : (
                                    upcomingAppointments.map((apt) => (
                                        <div key={apt.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                                            <h3 className="font-bold text-gray-800 mb-2">Rendez-vous {apt.type}</h3>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-3 text-gray-600 text-sm">
                                                    <CalendarIcon size={16} />
                                                    {/* Date string from Airtable is ISO. Let's format nicely if possible, or just display */}
                                                    <span>{new Date(apt.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-600 text-sm">
                                                    <Clock size={16} />
                                                    <span>
                                                        {(() => {
                                                            const d = new Date(apt.date);
                                                            // Use UTC to display exactly what is in Airtable (11:30Z -> 11:30)
                                                            return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
                                                        })()}
                                                    </span>
                                                </div>

                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${apt.status === 'Réalisé' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'Annulé' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                                {apt.status !== 'Annulé' && apt.status !== 'Réalisé' && (
                                                    <button
                                                        onClick={() => {
                                                            setAppointmentToCancel(apt.id);
                                                            setShowCancelModal(true);
                                                        }}
                                                        className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1 transition-colors"
                                                    >
                                                        <XCircle size={16} />
                                                        Annuler
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Success Modal */}
            {showSuccessConfirmModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                            <CheckCircle size={32} strokeWidth={3} />
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

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Annuler le rendez-vous ?</h3>
                        <p className="text-gray-600 mb-6">
                            Êtes-vous sûr de vouloir annuler ce rendez-vous ?<br />
                            Cette action est irréversible.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                            >
                                Retour
                            </button>
                            <button
                                onClick={async () => {
                                    if (appointmentToCancel) {
                                        setIsSubmitting(true);
                                        try {
                                            await cancelRdv(appointmentToCancel);
                                            await fetchAppointments(user.id); // Refresh
                                            setShowCancelModal(false);
                                            setAppointmentToCancel(null);
                                        } catch (e) {
                                            console.error(e);
                                            alert("Erreur lors de l'annulation");
                                        } finally {
                                            setIsSubmitting(false);
                                        }
                                    }
                                }}
                                disabled={isSubmitting}
                                className="flex-1 py-3 rounded-xl bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-colors flex justify-center items-center"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                                ) : (
                                    'Confirmer l\'annulation'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <FooterMain />
        </div>
    );
};

export default PriseRDVClient;
