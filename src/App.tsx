import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import FirstRdv from './pages/FirstRdv'
import FirstRdvStep2 from './pages/FirstRdvStep2'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import EspaceEtudiant from './pages/EspaceEtudiant'
import AdminHome from './pages/AdminHome'
import StudentManagement from './pages/StudentManagement'
import DetailEtudiant from './pages/DetailEtudiant'
import PriseRDVClient from './pages/PriseRDVClient'
import Documentation from './pages/Documentation'
import DocumentationAdmin from './pages/DocumentationAdmin'
import RDVAdmin from './pages/RDVAdmin'

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
                <Route path="/admin/etudiant/:id" element={<DetailEtudiant />} />
                <Route path="/admin/documentation" element={<DocumentationAdmin />} />
                <Route path="/admin/rdv" element={<RDVAdmin />} />
                <Route path="/prise-rdv" element={<PriseRDVClient />} />
                <Route path="/documentation" element={<Documentation />} />
            </Routes>
        </Router>
    )
}

export default App
