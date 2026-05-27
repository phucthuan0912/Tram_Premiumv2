import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const PageTransitionContext = createContext(null);

export const usePageTransition = () => useContext(PageTransitionContext);

export const PageTransitionProvider = ({ children }) => {
    const [transitionData, setTransitionData] = useState(null);
    const timeoutRef = useRef(null);

    const startTransition = useCallback((data) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setTransitionData(data);

        // Auto-clear after 2s in case something goes wrong
        timeoutRef.current = setTimeout(() => {
            setTransitionData(null);
        }, 2000);
    }, []);

    const clearTransition = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setTransitionData(null);
    }, []);

    return (
        <PageTransitionContext.Provider value={{ transitionData, startTransition, clearTransition }}>
            {children}
        </PageTransitionContext.Provider>
    );
};
