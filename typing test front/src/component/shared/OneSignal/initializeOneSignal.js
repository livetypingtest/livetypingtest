
import OneSignal from 'react-onesignal';
import { USER_API_URL } from '../../../util/API_URL';

let isOneSignalInitialized = false;

function extractToken(url) {
    const regex = /fcm\/send\/([A-Za-z0-9\-_]+(:[A-Za-z0-9\-_]+)?)/; // Updated regex to capture token with the part after the colon
    const match = url.match(regex);

    if (match && match[1]) {
        return match[1]; // Return the entire extracted token
    } else {
        throw new Error('Token not found in the URL');
    }
}

const initializeOneSignal = async () => {
    if (!isOneSignalInitialized) {
        try {
            // Initialize OneSignal
            await OneSignal.init({
                appId: "b8fd727a-8b0a-4356-b717-5bac1ba4934d", // Replace with your OneSignal App ID
                safari_web_id: "web.onesignal.auto.3b8b9214-66ac-44d1-a7fb-a9dc856242cb", // Replace with your Safari web ID
                notifyButton: {
                    enable: true, // Enable notification button on the site
                },
                allowLocalhostAsSecureOrigin: true, // For localhost during development
                serviceWorkerParam: {
                    scope: "/",
                    workerPath: "../../../../public/OneSignalSDKWorker", // Ensure this path is correct
                },
            });
            
            console.log("OneSignal initialized successfully.");
            isOneSignalInitialized = true;
            
            // Proceed to handle push notifications
            console.log(OneSignal.User.PushSubscription.token)
            
            await saveUserToken(extractToken(OneSignal.User.PushSubscription.token))
            // await handlePushNotification();
        } catch (error) {
            console.error("Error initializing OneSignal:", error);
        }
    } else {
        console.log("OneSignal is already initialized.");
        await handlePushNotification();
    }
};

const saveUserToken = async (userId) => {
    try {
        await fetch(`${USER_API_URL}/save-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: userId, // OneSignal Player ID
                userId: localStorage.getItem('userToken') 
            }),
        });
    } catch (error) {
        console.error('Error saving user token:', error);
    }
};

const handlePushNotification = async () => {
    try {
        // Check notification permission status using the `Notification.permission` API
        const permission = Notification.permission;
        console.log("Notification permission status:", permission);

        if (permission === 'granted') {
            console.log("Push notifications are enabled!");
            // Attempt to show the OneSignal prompt
            try {
                await OneSignal.showSlidedownPrompt({
                    force: true, // Ensure the prompt is displayed
                });
            } catch (error) {
                console.error("Error showing the slidedown prompt:", error);
            }

            // Fetch the user ID
            await getUserId();
        } else {
            console.log("Push notifications are not enabled yet.");
        }
    } catch (error) {
        console.error("Error checking notification status:", error);
    }
};

const getUserId = async () => {
    try {
        const userId = await OneSignal.getUserId();
        if (userId) {
            console.log("User ID (Player ID):", userId);
            // Send the userId to your backend for further processing
        } else {
            console.log("User is not subscribed yet.");
        }
    } catch (error) {
        console.error("Error fetching User ID:", error);
    }
};


export default initializeOneSignal;

