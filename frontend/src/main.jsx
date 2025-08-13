import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import App from './App.jsx';
import theme from './theme.js';
import './i18n';
import './index.css';

// const theme = createTheme({
//     palette: { primary: { main: '#5e35b1' }, background: { default: '#f5f5f5' } },
//     typography: { fontFamily: 'Inter, sans-serif' },
// });

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// This tells React to render your main <App /> component inside the root element.
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
