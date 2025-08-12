import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// --- Import All Page Components ---
// Public Pages
import VideoLandingPage from './pages/VideoLandingPage';
import HomePage from './pages/HomePage';
import SuperheroesPage from './pages/SuperheroesPage';
import SuperheroDetailPage from './pages/SuperheroDetailPage';
import { superheroesData } from './superheroData'; // Make sure this path is correct
import RegistrationPage from './pages/RegistrationPage';
import TermsPage from './pages/TermsPage';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import OtpPage from './pages/admin/OtpPage';
import DashboardPage from './pages/admin/DashboardPage';
import SubmissionsPage from './pages/admin/SubmissionsPage';
import WinnerPage from './pages/admin/WinnerPage';


const theme = createTheme({
    palette: {
        primary: { main: '#5e35b1' },
        background: { default: '#f5f5f5' }
    },
    typography: { fontFamily: 'Inter, sans-serif' },
});

const App = () => {
    // --- State Management ---
    const [showVideo, setShowVideo] = useState(true);
    const [route, setRoute] = useState(window.location.pathname);
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
    const [adminPage, setAdminPage] = useState('dashboard');
    const [loginStep, setLoginStep] = useState('email');
    const [loginEmail, setLoginEmail] = useState('');

    // --- Navigation and Routing ---
    const navigate = (path) => {
        window.history.pushState({}, '', path);
        setRoute(path);
    };

    useEffect(() => {
        const handlePopState = () => setRoute(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleVideoEnd = () => {
        setShowVideo(false);
        navigate('/'); // Go to the homepage after the video
    };

    // --- Admin Logic ---
    const handleOtpRequestSuccess = (email) => {
        setLoginEmail(email);
        setLoginStep('otp');
    };

    const handleLoginSuccess = (token) => {
        localStorage.setItem('adminToken', token);
        setAdminToken(token);
        setLoginStep('email');
    };

    const renderAdminContent = () => {
        if (!adminToken) {
            if (loginStep === 'otp') {
                return <OtpPage email={loginEmail} onLoginSuccess={handleLoginSuccess} />;
            }
            return <LoginPage onOtpRequestSuccess={handleOtpRequestSuccess} />;
        }

        const renderAdminPage = () => {
            switch (adminPage) {
                case 'submissions': return <SubmissionsPage token={adminToken} />;
                case 'winner': return <WinnerPage token={adminToken} />;
                case 'dashboard':
                default: return <DashboardPage token={adminToken} />;
            }
        };

        return (
            <AdminLayout onNavigate={setAdminPage}>
                {renderAdminPage()}
            </AdminLayout>
        );
    };

    // --- Main Render Logic ---
    const renderContent = () => {
        if (showVideo) {
            return <VideoLandingPage onVideoEnd={handleVideoEnd} />;
        }

        if (route.startsWith('/admin')) {
            return renderAdminContent();
        }

        // --- UNIFIED PUBLIC ROUTER ---
        if (route.startsWith('/superhero/')) {
            const heroName = route.split('/')[2];
            const heroData = superheroesData[heroName];
            return <SuperheroDetailPage hero={heroData} navigate={navigate} />;
        }

        switch (route) {
            case '/superheroes': return <SuperheroesPage navigate={navigate} />;
            case '/registration': return <RegistrationPage navigate={navigate} />;
            case '/terms': return <TermsPage navigate={navigate} />;
            case '/':
            default: return <HomePage navigate={navigate} />;
        }
    };
    
    return renderContent();
};

// This Root component is best practice for wrapping the App with providers
export default function Root() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
}
