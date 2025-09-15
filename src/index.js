import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import './styles/theme.css';
import './styles/components.css';
import './styles/pages.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
