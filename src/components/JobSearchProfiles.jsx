import React, { useEffect, useState, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileAlt,
    faUserTie,
    faBriefcase,
    faCoffee,
    faPaperPlane,
    faUtensils,
    faLaptopCode,
    faCode,
    faPlus,
    faSearch,
    faTimes,
    faLink,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import {
    faHackerrank,
    faGithub
} from '@fortawesome/free-brands-svg-icons';

import Addnew from './Addnew';
import { supabase } from '../supabase-client';

const JobSearchProfiles = ({ session }) => {
    const particlesContainerRef = useRef(null);
    const searchInputRef = useRef(null);

    const [showAddNew, setShowAddNew] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Particle effect
    useEffect(() => {
        const particlesContainer = particlesContainerRef.current;
        if (!particlesContainer) return;

        const particleCount = 150;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 20 + 10;
            const animationDelay = Math.random() * 20;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.animationDuration = `${animationDuration}s`;
            particle.style.animationDelay = `${animationDelay}s`;

            particlesContainer.appendChild(particle);
            particles.push(particle);
        }

        return () => {
            particles.forEach(particle => {
                if (particle.parentNode === particlesContainer) {
                    particlesContainer.removeChild(particle);
                }
            });
        };
    }, []);

    // Fetch profiles from Supabase
    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase
                    .from('Links')
                    .select('*')
                    .order('created_at', { ascending: false });
                    // .eq('email', session?.user?.email)

                if (error) {
                    console.error('Error fetching data:', error.message);
                    setError(error.message);
                } else {
                    console.log('Data fetched successfully:', data);
                    setProfiles(data || []);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    // Handle adding new profile
    const handleAddProfile = (newProfile) => {
        setProfiles(prev => [newProfile, ...prev]);
    };

    // Handle clearing search
    const handleClearSearch = () => {
        setSearchQuery('');
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const filteredProfiles = useMemo(() => {
        if (!searchQuery.trim()) return profiles;

        return profiles.filter(profile => {
            // Safety check: ensure Name exists and is a string
            const name = profile?.Name || profile?.name || '';
            return name.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [profiles, searchQuery]);

    // Get icon mapping
    const getIconForProfile = (profile) => {
        // You can expand this logic based on profile data
        const iconMap = {
            'overleaf': faFileAlt,
            'instahyre': faUserTie,
            'internshala': faBriefcase,
            'hiring': faCoffee,
            'telegram': faPaperPlane,
            'hackerrank': faHackerrank,
            'codechef': faUtensils,
            'geeksforgeeks': faLaptopCode,
            'github': faGithub,
            'leetcode': faCode,
        };

        const name = (profile?.Name || profile?.name || '').toLowerCase();

        for (const [key, icon] of Object.entries(iconMap)) {
            if (name.includes(key)) {
                return icon;
            }
        }

        return profile?.icon || faLink;
    };

    return (
        <section className="bg-black relative overflow-hidden w-screen min-h-screen py-12">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Your Important Links
                    </h2>
                    <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="text-gray-400"
                                />
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search profiles by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors duration-200 text-gray-800 placeholder-gray-400"
                                disabled={loading}
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    aria-label="Clear search"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            )}
                        </div>

                        {/* Search Results Counter */}
                        {searchQuery && !loading && (
                            <div className="mt-3 text-sm text-gray-300">
                                {filteredProfiles.length === 0 ? (
                                    <span>No profiles found matching "{searchQuery}"</span>
                                ) : (
                                    <span>
                                        Found {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className="text-green-500 text-5xl mb-4 animate-spin"
                            />
                            <p className="text-gray-400 text-lg">Loading your profiles...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-6 text-center">
                            <p className="text-red-200 text-lg mb-4">Failed to load profiles: {error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Profiles Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {filteredProfiles.map((profile, index) => (
                            <div
                                key={profile.id || index}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 profile-card border border-gray-200"
                            >
                                <div className="flex items-center p-6">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                                            <div className={`w-12 h-12 ${profile.color || 'bg-blue-500'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                <FontAwesomeIcon
                                                    icon={getIconForProfile(profile)}
                                                    className="text-white text-lg"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {profile.Name || profile.name || 'Untitled'}
                                                </h3>
                                            </div>
                                        </div>
                                        <a
                                            href={profile.Link || profile.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap ml-4"
                                        >
                                            Visit
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add New Card - Only show when not searching */}
                        {!searchQuery && (
                            <div
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 profile-card border-2 border-dashed border-gray-300 hover:border-green-400 group cursor-pointer w-44"
                                onClick={() => setShowAddNew(true)}
                            >
                                <div className="flex items-center justify-center min-h-[96px]">
                                    <div className="flex items-center gap-3 justify-center text-center p-4">
                                        <div className="w-12 h-12 bg-gray-100 group-hover:bg-green-100 rounded-full flex items-center justify-center transition-colors duration-300">
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className="text-gray-500 group-hover:text-green-600 text-xl transition-colors duration-300"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-green-700 transition-colors duration-300">
                                            Add New
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* No Results Message */}
                {searchQuery && filteredProfiles.length === 0 && !loading && !error && (
                    <div className="text-center mt-12">
                        <div className="inline-block p-8 bg-gray-800 rounded-xl">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="text-gray-500 text-4xl mb-4"
                            />
                            <p className="text-gray-400 text-lg mb-2">
                                No profiles found matching your search
                            </p>
                            <p className="text-gray-500 text-sm mb-4">
                                Try a different search term or add a new profile
                            </p>
                            <button
                                onClick={handleClearSearch}
                                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                Clear Search
                            </button>
                        </div>
                    </div>
                )}

              
            </div>

            {/* Add New Modal */}
            {showAddNew && (
                <Addnew
                    onClose={() => setShowAddNew(false)}
                    onAddProfile={handleAddProfile}
                    session={session}
                />
            )}

            {/* Particles Container */}
            <div
                ref={particlesContainerRef}
                className="absolute inset-0 z-0 h-full particles-container"
            />
        </section>
    );
};

export default JobSearchProfiles;