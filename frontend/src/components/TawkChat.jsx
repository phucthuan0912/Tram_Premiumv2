import { useEffect } from 'react';

const TAWK_SCRIPT_ID = 'tawkto-live-chat';
const TAWK_SRC = 'https://embed.tawk.to/69cf69a5c710b01c3973db59/1jl939c52';

const TawkChat = () => {
    useEffect(() => {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return;
        }

        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        if (document.getElementById(TAWK_SCRIPT_ID)) {
            return;
        }

        const script = document.createElement('script');
        script.id = TAWK_SCRIPT_ID;
        script.async = true;
        script.src = TAWK_SRC;
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');

        const firstScript = document.getElementsByTagName('script')[0];

        if (firstScript?.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
        } else {
            document.body.appendChild(script);
        }
    }, []);

    return null;
};

export default TawkChat;
