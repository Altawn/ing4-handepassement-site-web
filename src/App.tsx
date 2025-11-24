import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import FirstRdv from './pages/FirstRdv'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/premier-rdv" element={<FirstRdv />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/inscription" element={<Inscription />} />
            </Routes>
        </Router>
    )
}

export default App
