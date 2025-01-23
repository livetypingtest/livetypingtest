
import OneSignal from 'react-onesignal';

let isOneSignalInitialized = false;

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
                    workerPath: "/OneSignalSDKWorker.js", // Ensure this path is correct
                },
            });

            console.log("OneSignal initialized successfully.");
            isOneSignalInitialized = true;

            // Proceed to handle push notifications
            await handlePushNotification();
        } catch (error) {
            console.error("Error initializing OneSignal:", error);
        }
    } else {
        console.log("OneSignal is already initialized.");
        await handlePushNotification();
    }
};

const handlePushNotification = async () => {
    try {
        // Use `getNotificationPermission` to check notification permission status
        const permission = await OneSignal.getNotificationPermission();
        console.log("Notification permission status:", permission);

        if (permission === 'granted') {
            console.log("Push notifications are enabled!");
            try {
                await OneSignal.showSlidedownPrompt(); // Show subscription prompt
            } catch (error) {
                console.error("Slidedown Prompt Error:", error);
            }
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
        const userId = await OneSignal.getUserId(); // Fetch the User ID
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

