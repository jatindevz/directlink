import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRocket,
    faCode,
    faChartLine,
    faUserCheck,
    faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faHackerrank } from '@fortawesome/free-brands-svg-icons';
import LoginPage from './Loginpage';
import { supabase } from '../supabase-client';
import twosb from '../assets/twosb.png';
import onesb from '../assets/onesb.png';
// import DashboardScreenshot1 from './src/assets/onesb.png';
// import DashboardScreenshot2 from './src/assets/twosb.png'; 



const LandingPage = ({ session}) => {

    const [showLogin, setShowLogin] = useState(false);
    

  
        
    return (
        <div className="min-h-screen bg-gray-50 font-sans w-screen overflow-x-hidden">
       
            {/* 2. Hero Section */}
            <section className="bg-black text-white py-20 md:py-32 relative overflow-hidden">
                {/* Decorative Particles (Optional - uses a simple gradient/blur for effect)
                <div className="absolute top-0 left-0 w-screen h-full bg-gradient-to-br from-blue-900/30 via-green-500/50
                 to-yellow-900/50 opacity-50 z-0"></div> */}

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="font-extrabold leading-tight mb-4">
                        <span className="text-green-500 text-4xl md:text-6xl ">Track.     </span>  <span className='text-4xl md:text-6xl'>  Manage.</span> <span className="block my-2 text-3xl md:text-5xl">Stop Juggling Tabs. Start <span className="text-green-500 text-4xl md:text-6xl ">Curate.</span></span>
                    </h1>
                    <p className="text-xl md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        The ultimate dashboard for Users to organize Their Important Links in one place.
                    </p>

                    <a
                        onClick={() => setShowLogin(true)}
                        href="#"
                        className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-full hover:bg-green-500 transition duration-300 transform hover:scale-[1.03] shadow-lg shadow-green-500/50"
                    >
                        Get Started
                        <FontAwesomeIcon icon={faArrowRight} className="ml-3 text-lg" />
                    </a>

                    
                </div>

                <div className="container mx-auto px-4 relative z-10 mt-16 md:mt-24">
                    <div className="flex justify-center space-x-4 md:space-x-8">
                        <img
                            src={twosb}
                            alt="DevTrack Dashboard Screenshot 1"
                            className="w-1/2 md:w-5/12 rounded-xl shadow-2xl border-4 border-gray-700 transform rotate-[-3deg] transition-transform duration-500 "
                        />
                        <img
                            src={onesb}
                            alt="DevTrack Dashboard Screenshot 2"
                            className="w-1/2 md:w-5/12 rounded-xl shadow-2xl border-4 border-gray-700 transform rotate-[3deg] transition-transform duration-500  sm:block"
                        />
                    </div>
                </div>
            </section>


            {showLogin && (
                <LoginPage
                    onClose={() => setShowLogin(false)}
                    // onAddProfile={handleAddProfile}
                />
            )}

            
        </div>
    );
};

export default LandingPage;