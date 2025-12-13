import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import HeaderClient from '../components/HeaderClient';
import FooterMain from '../components/FooterMain';
import Oeil from '../components/Oeil';
import { getTasksForStudent, updateTaskStatus, Task, getStudentRdvs, StudentRdv } from '../services/airtable';

function EspaceEtudiant() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [rdvs, setRdvs] = useState<StudentRdv[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(true);


    useEffect(() => {
        // Load user from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Load tasks for this student
            if (parsedUser.id) {
                // Fetch Tasks
                getTasksForStudent(parsedUser.id).then(fetchedTasks => {
                    setTasks(fetchedTasks);
                    setLoadingTasks(false);
                });

                // Fetch RDVs
                getStudentRdvs(parsedUser.id).then(fetchedRdvs => {
                    setRdvs(fetchedRdvs);
                });
            }
        } else {
            // Redirect to login if not logged in
            navigate('/connexion');
        }
    }, [navigate]);

    const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
        // Optimistic update
        setTasks(tasks.map(t =>
            t.id === taskId ? { ...t, completed: !currentStatus } : t
        ));

        try {
            await updateTaskStatus(taskId, !currentStatus);
        } catch (error) {
            console.error("Failed to update task", error);
            // Revert on error
            setTasks(tasks.map(t =>
                t.id === taskId ? { ...t, completed: currentStatus } : t
            ));
        }
    };




    const upcomingAppointments = rdvs.filter(r => !r.isPast).sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());
    const pastAppointments = rdvs.filter(r => r.isPast).sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

    return (
        <>
            <HeaderClient />
            <div className="min-h-screen bg-white py-8 px-6">
                <div className="container mx-auto max-w-7xl">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                            Bonjour, {user && user['Nom Complet'] ? user['Nom Complet'].split(' ')[0] : 'Etudiant'} ! 👋
                        </h1>
                        <p className="text-gray-500 font-medium">Espace personnel</p>
                    </div>

                    {/* Main Grid - Calendar and Tasks */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-10">
                        {/* Calendar Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Mon calendrier</h2>
                            <div className="space-y-4">
                                {/* Calendar placeholder - mimicking the visual from the image */}
                                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-md">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-gray-700">Calendar</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex bg-gray-100 rounded-md p-1">
                                                <button className="px-3 py-1 text-sm font-medium bg-white shadow-sm rounded-md text-gray-800">Month</button>
                                                <button className="px-3 py-1 text-sm font-medium text-gray-500">Week</button>
                                                <button className="px-3 py-1 text-sm font-medium text-gray-500">Day</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">January 2025</h3>
                                        <div className="flex gap-2">
                                            <button className="p-1 hover:bg-gray-100 rounded"><span className="text-gray-500">❮</span></button>
                                            <button className="p-1 hover:bg-gray-100 rounded"><span className="text-gray-500">❯</span></button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
                                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                                            <div key={day} className="font-semibold text-gray-400 py-2">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                                        {[...Array(31)].map((_, i) => {
                                            const day = i + 1;
                                            // Mocking the selection from the image (11th selected)
                                            const isSelected = day === 11;

                                            return (
                                                <div
                                                    key={i}
                                                    className={`h-10 w-10 mx-auto flex items-center justify-center rounded-full ${isSelected
                                                        ? 'bg-blue-600 text-white font-bold shadow-md'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {day}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tasks Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Ma liste de tâches</h2>
                                <p className="text-gray-500">Actions à réaliser</p>
                            </div>
                            <div className="space-y-4">
                                {loadingTasks ? (
                                    <p className="text-gray-500 text-sm">Chargement des tâches...</p>
                                ) : tasks.length === 0 ? (
                                    <p className="text-gray-500 text-sm">Aucune tâche à faire.</p>
                                ) : (
                                    tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="pt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={task.completed}
                                                    onChange={() => handleToggleTask(task.id, task.completed)}
                                                    className={`w-5 h-5 rounded border-gray-300 ${task.completed ? 'bg-slate-800 text-slate-800' : 'text-slate-800'} focus:ring-slate-800`}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p
                                                    className={`font-semibold text-base ${task.completed
                                                        ? 'text-gray-400 line-through'
                                                        : 'text-gray-800'
                                                        }`}
                                                >
                                                    {task.title}
                                                </p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-2 font-medium">
                                                    <Clock className="w-3 h-3" />
                                                    {task.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Past Appointments Section */}
                    <div className="mb-10 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-8">
                            Rendez-vous passés et compte rendu
                        </h2>
                        <div className="space-y-6">
                            {pastAppointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="bg-gray-50 rounded-xl p-6"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {appointment.type}
                                        </h3>
                                        <div className="flex items-center text-gray-500 text-sm font-medium">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {appointment.date}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="w-1 bg-slate-800 rounded-full shrink-0"></div>
                                        <div className="bg-blue-50/50 rounded-lg p-4 w-full">
                                            <p className="text-blue-600 font-semibold mb-1 text-sm">Notes :</p>
                                            <p className="text-slate-700 text-sm leading-relaxed">
                                                {appointment.notes}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Appointments Section */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold text-slate-800">
                                Rendez-vous à venir
                            </h2>
                            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                                Voir tout
                            </button>
                        </div>
                        <p className="text-gray-500 mb-6">Prochaines sessions</p>

                        <div className="space-y-4">
                            {upcomingAppointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="bg-gray-50 rounded-xl p-6 flex items-center justify-between"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {appointment.type}
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                                            <Calendar className="w-4 h-4" />
                                            {appointment.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Accessibility Button */}
                <Oeil />
            </div >
            <FooterMain />
        </>
    );
}

export default EspaceEtudiant;
