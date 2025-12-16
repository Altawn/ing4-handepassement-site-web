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

    let user;
    try {
        user = JSON.parse(userStr);
    } catch (e) {
        console.error("Auth Error:", e);
        user = null;
    }

    if (!user) {
        localStorage.removeItem('user');
        return <Navigate to="/connexion" replace />;
    }

    // Normalize role check
    // In Airtable we see "Statut" which can be "Admin", "Administrateur", "Etudiant"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (user as any)['Statut'];

    const hasPermission = allowedRoles.some(role => {
        if (role === 'Admin') {
            return userRole === 'Admin' || userRole === 'Administrateur';
        }
        if (role === 'Etudiant') {
            return userRole === 'Étudiant' || userRole === 'Etudiant';
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
};

export default ProtectedRoute;
