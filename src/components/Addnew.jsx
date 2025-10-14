import React, { useState } from 'react';
import {
    faPlus,
    faTimes,
    faLink,
    faTag,
    faBriefcase,
    faUser,
    faCode,
    faLaptop,
    faFileAlt,
    faCoffee
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from '../supabase-client';

const Addnew = ({ onClose, onAddProfile, session }) => {
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        color: 'bg-blue-500',
        
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const colorOptions = [
        { value: 'bg-blue-500', label: 'Blue', color: '#3b82f6' },
        { value: 'bg-green-500', label: 'Green', color: '#10b981' },
        { value: 'bg-red-500', label: 'Red', color: '#ef4444' },
        { value: 'bg-yellow-500', label: 'Yellow', color: '#eab308' },
        { value: 'bg-purple-500', label: 'Purple', color: '#8b5cf6' },
        { value: 'bg-pink-500', label: 'Pink', color: '#ec4899' },
        { value: 'bg-indigo-500', label: 'Indigo', color: '#6366f1' },
        { value: 'bg-gray-500', label: 'Gray', color: '#6b7280' }
    ];


    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.url.trim()) {
            newErrors.url = 'URL is required';
        } else {
            try {
                const url = new URL(formData.url);
                if (!url.protocol.startsWith('http')) {
                    newErrors.url = 'URL must start with http:// or https://';
                }
            } catch {
                newErrors.url = 'Please enter a valid URL (include http:// or https://)';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const { data, error } = await supabase.from('Links').insert([
                {
                    Name: formData.name.trim(),
                    Link: formData.url.trim(),
                    color: formData.color,
                    user_id: session?.user?.id
                }
            ]).select();

            if (error) {
                console.error('Supabase error:', error);
                setSubmitError(`Failed to add profile: ${error.message}`);
                setIsSubmitting(false);
                return;
            }

            // Create the new profile object to pass back
            const newProfile = {
                name: formData.name.trim(),
                url: formData.url.trim(),
                color: formData.color,
                icon: formData.icon
            };

            // Call the callback with the new profile
            if (onAddProfile) {
                onAddProfile(newProfile);
            }

            // Close the modal after successful submission
            onClose();

        } catch (error) {
            console.error('Error adding profile:', error);
            setSubmitError('An unexpected error occurred. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            {/* Backdrop click to close */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                        type="button"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error Message */}
                    {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                            <span className="text-sm">{submitError}</span>
                        </div>
                    )}

                    {/* Name Field */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <FontAwesomeIcon icon={faTag} className="mr-2 text-gray-400" />
                            Profile Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g., LinkedIn, Indeed, Glassdoor"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* URL Field */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <FontAwesomeIcon icon={faLink} className="mr-2 text-gray-400" />
                            Profile URL
                        </label>
                        <input
                            type="text"
                            value={formData.url}
                            onChange={(e) => handleChange('url', e.target.value)}
                            placeholder="https://example.com/profile"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.url ? 'border-red-500' : 'border-gray-300'
                                }`}
                            disabled={isSubmitting}
                        />
                        {errors.url && (
                            <p className="text-red-500 text-sm mt-1">{errors.url}</p>
                        )}
                    </div>


                    {/* Color Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Color Theme
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => handleChange('color', color.value)}
                                    className={`h-10 rounded-lg border-2 transition-all ${formData.color === color.value
                                            ? 'border-gray-800 ring-2 ring-gray-200 scale-105'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    style={{ backgroundColor: color.color }}
                                    disabled={isSubmitting}
                                    title={color.label}
                                >
                                    <span className="sr-only">{color.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    Add Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Addnew;