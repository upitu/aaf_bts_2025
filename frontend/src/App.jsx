import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import ThankYouPage from './pages/ThankYouPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

const App = () => {
    const [page, setPage] = useState('landing');

    const navigateTo = (newPage) => {
        setPage(newPage);
        window.scrollTo(0, 0);
    };

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