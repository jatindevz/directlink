import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import JobSearchProfiles from './components/JobSearchProfiles';
import LandingPage from './components/LandingPage';
import { supabase } from './supabase-client';

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Get the current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth state changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)

      // Navigate based on session
      if (session) {
        navigate('/dashboard')
      } else {
        navigate('/')
      }
    })

    // Cleanup listener on unmount
    return () => subscription.unsubscribe()
  }, [navigate])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
    } else {
      console.log('Signed out successfully')
    }
  }

  // Show loading state while checking session
  if (loading) {
    return (
      <div className="overflow-x-hidden bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-hidden bg-black min-h-screen flex items-center justify-center">
      {/* Sign Out Button */}
      {session && (
        <button
          onClick={handleSignOut}
          className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-500 transition duration-300 shadow-lg shadow-red-500/50 z-20"
        >
          Sign Out
        </button>
      )}

      {/* User Profile Badge */}
      {session && (
        <div className="absolute top-4 left-4 z-30">
          <div className="flex items-center space-x-3 p-2 pr-4 rounded-full bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-700/50 transition duration-300">
            {/* Profile Icon */}
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white uppercase flex-shrink-0">
              {session.user.user_metadata?.full_name
                ? session.user.user_metadata.full_name[0]
                : session.user.email[0]}
            </div>

            {/* User Name/Email */}
            <span className="text-white text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
              {session.user.user_metadata?.full_name || session.user.email}
            </span>
          </div>
        </div>
      )}

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            session ? <Navigate to="/dashboard" replace /> : <LandingPage />
          }
        />
        <Route
          path="/dashboard"
          element={
            session ? <JobSearchProfiles session={session} /> : <Navigate to="/" replace />
          }
        />
        {/* Catch all route */}
        <Route
          path="*"
          element={<Navigate to={session ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </div>
  );
}

export default App