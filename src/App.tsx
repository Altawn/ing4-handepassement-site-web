import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import FirstRdv from './pages/FirstRdv'
import FirstRdvStep2 from './pages/FirstRdvStep2'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import EspaceEtudiant from './pages/EspaceEtudiant'
import AdminHome from './pages/AdminHome'
import StudentManagement from './pages/StudentManagement'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/premier-rdv" element={<FirstRdv />} />
                <Route path="/premier-rdv/selection" element={<FirstRdvStep2 />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/mon-espace" element={<EspaceEtudiant />} />
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/admin/gestion-etudiants" element={<StudentManagement />} />
            </Routes>
        </Router>
    )
}

export default App
