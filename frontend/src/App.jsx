import React, { useState } from 'react';

// Import the page components from your pages directory
import LandingPage from './pages/LandingPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import ThankYouPage from './pages/ThankYouPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

const App = () => {
    // State to manage which page is currently visible
    const [page, setPage] = useState('landing');

    // Function to change the current page
    const navigateTo = (newPage) => {
        setPage(newPage);
        window.scrollTo(0, 0); // Scroll to the top of the page on navigation
    };

    // Simple router to render the correct page component based on the state
    const renderPage = () => {
        switch (page) {
            case 'confirmEmail':
                return <ConfirmEmailPage navigateTo={navigateTo} />;
            case 'thankYou':
                return <ThankYouPage navigateTo={navigateTo} />;
            case 'privacyPolicy':
                return <PrivacyPolicyPage navigateTo={navigateTo} />;
            case 'landing':
            default:
                return <LandingPage navigateTo={navigateTo} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            {renderPage()}
        </div>
    );
};

export default App;
