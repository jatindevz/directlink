import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faLock,
    faSignInAlt
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../supabase-client';

const LoginPage = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                // Sign up flow
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password
                });

                if (error) {
                    setMessage(`Sign up error: ${error.message}`);
                    console.error('Sign up error:', error);
                } else {
                    setMessage('Sign up successful! Please check your email to verify your account.');
                    console.log('Sign up successful:', data);
                    // Optionally close after a delay
                    setTimeout(() => {
                        onClose();
                    }, 2000);
                }
            } else {
                // Sign in flow
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    setMessage(`Sign in error: ${error.message}`);
                    console.error('Sign in error:', error);
                } else {
                    setMessage('Sign in successful!');
                    console.log('Sign in successful:', data);
                    // Close modal on success
                    setTimeout(() => {
                        onClose();
                    }, 1000);
                }
            }
        } catch (err) {
            setMessage(`An unexpected error occurred: ${err.message}`);
            console.error('Unexpected error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div onClick={onClose} className="absolute top-0 left-0 w-screen h-full bg-black opacity-50 -z-10"></div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-white mb-2">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-400">
                        {isSignUp
                            ? 'Sign up to create your Job Search Dashboard account.'
                            : 'Sign in to access your Job Search Dashboard.'}
                    </p>
                    <div className="w-16 h-1 bg-green-500 mx-auto mt-4"></div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-2xl p-8 space-y-6 border border-gray-700"
                >
                    {/* Message Display */}
                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.includes('successful')
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}>
                            {message}
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        </span>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500 focus:ring-1 transition duration-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                        </span>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500 focus:ring-1 transition duration-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center space-x-2 px-4 py-3 text-lg font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 transition duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={faSignInAlt} />
                        <span>{isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}</span>
                    </button>

                    {/* Toggle between Sign In and Sign Up */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setMessage('');
                            }}
                            disabled={isLoading}
                            className="text-green-600 hover:text-green-700 font-medium transition duration-200 disabled:opacity-50"
                        >
                            {isSignUp
                                ? 'Already have an account? Sign In'
                                : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default LoginPage;