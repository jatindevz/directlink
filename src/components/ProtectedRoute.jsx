// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../supabase-client'; // Your client setup

// This component expects children or uses <Outlet /> if using newer React Router versions

const ProtectedRoute = () => {
    // A function to check if the user is currently logged in
    // In a real app, you would use a global state or hook to store the session.
    const getSession = () => {
        // NOTE: A real implementation uses a hook (like useAuth)
        // to get the *current* session state, but for a simplified example, 
        // we check the global client (which might be async depending on implementation)
        const { data } = supabase.auth.getSession();
        return data.session;
    };

    const session = getSession();

    // ----------------------------------------------------
    // IMPORTANT: For a production app, this check must be synchronized
    // with your authentication state/loading state.
    // You should wait until the session is fully loaded before rendering anything.
    // ----------------------------------------------------

    if (!session) {
        // If the user is NOT logged in, redirect them to the login page
        return <Navigate to="/login" replace />;
    }

    // If the user IS logged in, render the child route/content
    return <Outlet />;
};

export default ProtectedRoute;