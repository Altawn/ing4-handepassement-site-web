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
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/premier-rdv" element={<FirstRdv />} />
                <Route path="/premier-rdv/selection" element={<FirstRdvStep2 />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/inscription" element={<Inscription />} />

                {/* Espace Étudiant */}
                <Route path="/mon-espace" element={
                    <ProtectedRoute allowedRoles={['Etudiant']}>
                        <EspaceEtudiant />
                    </ProtectedRoute>
                } />
                <Route path="/prise-rdv" element={
                    <ProtectedRoute allowedRoles={['Etudiant']}>
                        <PriseRDVClient />
                    </ProtectedRoute>
                } />
                <Route path="/documentation" element={
                    <ProtectedRoute allowedRoles={['Etudiant']}>
                        <Documentation />
                    </ProtectedRoute>
                } />

                {/* Espace Admin */}
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <AdminHome />
                    </ProtectedRoute>
                } />
                <Route path="/admin/gestion-etudiants" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <StudentManagement />
                    </ProtectedRoute>
                } />
                <Route path="/admin/etudiant/:id" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <DetailEtudiant />
                    </ProtectedRoute>
                } />
                <Route path="/admin/documentation" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <DocumentationAdmin />
                    </ProtectedRoute>
                } />
                <Route path="/admin/rdv" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <RDVAdmin />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    )
}

export default App
