import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../../util/API_URL';

const GoogleAds = () => {
    const adRef = useRef(null);
    const [adsClientID, setAdsClientID] = useState('');
    const [adSlot, setAdSlot] = useState('');

    useEffect(() => {
        // Function to load the ad after setting client ID
        const loadAds = () => {
            if (window.adsbygoogle && adRef.current) {
                // Check if the ad element hasn't already loaded to avoid duplicates
                if (!adRef.current.innerHTML) {
                    console.log("Pushing ad...");
                    window.adsbygoogle.push({});
                }
            }
        };

        // Fetch ad settings from the backend
        axios.get(`${ADMIN_API_URL}/ads`)
            .then(response => {
                const { adsClientID, adSlot } = response.data;

                // Set the client ID in state
                setAdsClientID(adsClientID);
                setAdSlot(adSlot)

                // Dynamically load the Google AdSense script with the client ID in the URL
                if (adsClientID && !document.querySelector(`script[data-adsbygoogle-client="${adsClientID}"]`)) {
                    const script = document.createElement('script');
                    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClientID}`;
                    script.async = true;
                    script.crossOrigin = 'anonymous';
                    script.setAttribute('data-adsbygoogle-client', adsClientID); // Avoid adding multiple scripts with the same client ID
                    script.onload = loadAds; // Load ads once the script is fully loaded
                    script.onerror = () => console.error('Failed to load adsbygoogle script');
                    document.body.appendChild(script);
                }
            })
            .catch(error => console.error('Error loading ad settings:', error));
    }, []);

    return (
        <div>
            {adsClientID && (
                <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client={adsClientID}
                    data-ad-slot={adSlot}  // You can set this dynamically if needed
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                ></ins>
            )}
        </div>
    );
};

export default GoogleAds;
