import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Public Pages
import LandingPage from './pages/LandingPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import ThankYouPage from './pages/ThankYouPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

// Admin Pages and Components
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
    const [route, setRoute] = useState(window.location.pathname);
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
    const [adminPage, setAdminPage] = useState('dashboard');
    
    // State for the two-step login flow
    const [loginStep, setLoginStep] = useState('email'); // 'email' or 'otp'
    const [loginEmail, setLoginEmail] = useState('');

    const navigate = (path) => {
        window.history.pushState({}, '', path);
        setRoute(path);
    };

    useEffect(() => {
        const handlePopState = () => setRoute(window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleOtpRequestSuccess = (email) => {
        setLoginEmail(email);
        setLoginStep('otp');
    };

    const handleLoginSuccess = (token) => {
        localStorage.setItem('adminToken', token);
        setAdminToken(token);
        setLoginStep('email'); // Reset for next time
    };

    const renderAdminContent = () => {
        if (!adminToken) {
            if (loginStep === 'otp') {
                return <OtpPage email={loginEmail} onLoginSuccess={handleLoginSuccess} />;
            }
            return <LoginPage onOtpRequestSuccess={handleOtpRequestSuccess} />;
        }

        const renderAdminPage = () => {
            switch(adminPage) {
                case 'submissions':
                    return <SubmissionsPage token={adminToken} />;
                case 'winner':
                    return <WinnerPage token={adminToken} />;
                case 'dashboard':
                default:
                    return <DashboardPage token={adminToken} />;
            }
        };

        return (
            <AdminLayout onNavigate={setAdminPage}>
                {renderAdminPage()}
            </AdminLayout>
        );
    };

    // Main Router
    if (route.startsWith('/admin')) {
        return renderAdminContent();
    }

    // Default to public campaign pages
    switch (route) {
        case '/confirm-email':
            return <ConfirmEmailPage navigateTo={() => navigate('/')} />;
        case '/thank-you':
            return <ThankYouPage navigateTo={() => navigate('/')} />;
        case '/privacy-policy':
            return <PrivacyPolicyPage navigateTo={() => navigate('/')} />;
        case '/':
        default:
            return <LandingPage navigateTo={navigate} />;
    }
};

export default function Root() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
}
