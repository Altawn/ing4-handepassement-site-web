import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Clock, CheckCircle, X, MapPin, Video } from 'lucide-react';
import HeaderMain from '../components/HeaderMain';
import FooterOther from '../components/FooterOther';

function FirstRdvStep2() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    // State management
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [appointmentType, setAppointmentType] = useState<'presential' | 'video' | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Available time slots
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30',
        '17:00'
    ];

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    };

    const formatSelectedDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
        setSelectedTime(null); // Reset time when date changes
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTime && appointmentType) {
            setShowConfirmModal(true);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }, (_, i) => i);

    return (
        <>
            <HeaderMain />
            <div className="min-h-screen bg-accent-50 py-12 px-6">
                <div className="container mx-auto max-w-6xl">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-700 mb-6 hover:text-brand transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Retour</span>
                    </button>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Premier rendez-vous</h1>
                    <p className="text-gray-600 mb-8">Choisissez un créneau pour votre premier rendez-vous</p>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Appointment Type Section */}
                            <div className="bg-white rounded-3xl shadow-xl p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Type de rendez-vous</h2>
                                <p className="text-sm text-gray-600 mb-6">Comment souhaitez-vous effectuer ce rendez-vous ?</p>

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
                            <div className="bg-white rounded-3xl shadow-xl p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Sélectionner une date</h2>
                                <p className="text-sm text-gray-600 mb-6">Choisissez la date qui vous convient</p>

                                {/* Calendar */}
                                <div className="mb-8">
                                    {/* Calendar Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <button
                                            onClick={handlePrevMonth}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            ←
                                        </button>
                                        <h3 className="text-lg font-bold text-gray-900 capitalize">
                                            {formatMonthYear(currentMonth)}
                                        </h3>
                                        <button
                                            onClick={handleNextMonth}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            →
                                        </button>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        {/* Weekday Headers */}
                                        <div className="grid grid-cols-7 bg-gray-50">
                                            {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day) => (
                                                <div key={day} className="text-center py-2 text-sm font-semibold text-gray-700">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                        {/* Calendar Days */}
                                        <div className="grid grid-cols-7">
                                            {emptyDays.map((i) => (
                                                <div key={`empty-${i}`} className="aspect-square border border-gray-100"></div>
                                            ))}
                                            {days.map((day) => {
                                                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                                const isSelected = isSameDay(selectedDate, date);
                                                const isToday = isSameDay(new Date(), date);
                                                const isPast = isPastDate(date);

                                                return (
                                                    <button
                                                        key={day}
                                                        onClick={() => handleDateClick(day)}
                                                        disabled={isPast}
                                                        className={`aspect-square border border-gray-100 p-2 text-sm transition-colors relative ${isPast
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : isSelected
                                                                ? 'bg-brand text-white font-bold'
                                                                : isToday
                                                                    ? 'bg-blue-100 text-brand font-semibold hover:bg-blue-200'
                                                                    : 'hover:bg-gray-50'
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
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Créneaux disponibles</h3>
                                        <p className="text-sm text-gray-600 mb-4 capitalize">
                                            {formatSelectedDate(selectedDate)}
                                        </p>

                                        <div className="grid grid-cols-4 gap-3">
                                            {timeSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`px-4 py-3 rounded-lg border font-medium transition-colors flex items-center justify-center gap-2 ${selectedTime === time
                                                        ? 'bg-brand text-white border-brand'
                                                        : 'bg-white border-gray-300 text-gray-700 hover:border-brand hover:text-brand'
                                                        }`}
                                                >
                                                    <Clock className="w-4 h-4" />
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Section - Recap */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>

                                <div className="space-y-4 mb-6">
                                    {/* Date */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CalendarIcon className="w-5 h-5 text-brand" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Date</p>
                                            {selectedDate ? (
                                                <p className="font-bold text-gray-900 capitalize">
                                                    {formatSelectedDate(selectedDate)}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">Sélectionnez une date</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-brand" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Heure</p>
                                            {selectedTime ? (
                                                <p className="font-bold text-gray-900">{selectedTime}</p>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">Sélectionnez un créneau</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Appointment Type */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-brand" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Type de rendez-vous</p>
                                            {appointmentType ? (
                                                <p className="font-bold text-gray-900">
                                                    {appointmentType === 'presential' ? 'En présentiel' : 'En visio'}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">Sélectionnez un type</p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleConfirm}
                                        disabled={!selectedDate || !selectedTime || !appointmentType}
                                        className={`w-full py-3 rounded-lg font-bold transition-colors ${selectedDate && selectedTime && appointmentType
                                            ? 'bg-brand text-white hover:bg-brand-600'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        Confirmer le rendez-vous
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full relative animate-fade-in">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="text-center">
                            {/* Success Icon */}
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rendez-vous confirmé !</h2>

                            <p className="text-gray-600 mb-6">
                                Votre premier rendez-vous a été programmé avec succès pour le
                            </p>

                            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                                <div className="flex items-center gap-3 mb-3">
                                    <CalendarIcon className="w-5 h-5 text-brand" />
                                    <p className="font-bold text-gray-900 capitalize">
                                        {selectedDate && formatSelectedDate(selectedDate)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <Clock className="w-5 h-5 text-brand" />
                                    <p className="font-bold text-gray-900">{selectedTime}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {appointmentType === 'presential' ? (
                                        <MapPin className="w-5 h-5 text-brand" />
                                    ) : (
                                        <Video className="w-5 h-5 text-brand" />
                                    )}
                                    <p className="font-bold text-gray-900">
                                        {appointmentType === 'presential' ? 'En présentiel' : 'En visio'}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-8">
                                Vous allez recevoir un email de confirmation avec tous les détails.
                            </p>

                            <button
                                onClick={handleBackToHome}
                                className="w-full py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-600 transition-colors"
                            >
                                Retour à l'accueil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <FooterOther />
        </>
    );
}

export default FirstRdvStep2;
