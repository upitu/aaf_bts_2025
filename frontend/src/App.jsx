import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Import the page components from your pages directory
import LandingPage from './pages/LandingPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import ThankYouPage from './pages/ThankYouPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

// Create a basic theme for your app
const theme = createTheme({
  palette: {
    primary: {
      main: '#5e35b1', // A nice purple
    },
    background: {
      default: '#f5f5f5' // A light grey background
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

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
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Resets CSS for consistency */}
            {renderPage()}
        </ThemeProvider>
    );
};

export default App;
