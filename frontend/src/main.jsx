import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider from './context/ShopContext';
import { LanguageProvider } from './context/LanguageContext';
import { PageTransitionProvider } from './context/PageTransitionContext';
import SharedElementTransition from './components/SharedElementTransition';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <LanguageProvider>
                <PageTransitionProvider>
                    <ShopContextProvider>
                        <App />
                        <SharedElementTransition />
                    </ShopContextProvider>
                </PageTransitionProvider>
            </LanguageProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
