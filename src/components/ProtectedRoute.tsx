import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactElement;
    allowedRoles: string[]; // e.g., ['Admin', 'Etudiant']
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const userStr = localStorage.getItem('user');

    if (!userStr) {
        return <Navigate to="/connexion" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        // Normalize role check
        // In Airtable we see "Statut" which can be "Admin", "Administrateur", "Etudiant"
        const userRole = user['Statut'];

        const hasPermission = allowedRoles.some(role => {
            if (role === 'Admin') {
                return userRole === 'Admin' || userRole === 'Administrateur';
            }
            return userRole === role;
        });

        if (!hasPermission) {
            // User is logged in but doesn't have the right role.
            // Redirect to their appropriate home based on their actual role
            if (userRole === 'Admin' || userRole === 'Administrateur') {
                return <Navigate to="/admin" replace />;
            } else {
                return <Navigate to="/mon-espace" replace />;
            }
        }

        return children;
    } catch (e) {
        console.error("Auth Error:", e);
        localStorage.removeItem('user');
        return <Navigate to="/connexion" replace />;
    }
};

export default ProtectedRoute;
