import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// This finds the <div id="root"></div> element in your index.html file.
const rootElement = document.getElementById('root');

// This creates the main React root, which is the entry point for your entire app.
const root = ReactDOM.createRoot(rootElement);

// This tells React to render your main <App /> component inside the root element.
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
