import OneSignal from 'react-onesignal';

let isOneSignalInitialized = false;

const initializeOneSignal = () => {
    if(!isOneSignalInitialized) {
        if (window.OneSignal && !OneSignal.initialized) {
            OneSignal.init({
                appId: "b8fd727a-8b0a-4356-b717-5bac1ba4934d", // Replace with your OneSignal App ID
                safari_web_id: "web.onesignal.auto.3b8b9214-66ac-44d1-a7fb-a9dc856242cb",
                notifyButton: {
                    enable: true, // Enable notification button on the site
                },
                allowLocalhostAsSecureOrigin: true, // For localhost during development
                serviceWorkerParam: {
                    scope: "/",
                    workerPath: "../../../../public/OneSignalSDKWorker.js",
                },
            })
                .then(() => {
                    console.log("OneSignal initialized successfully.");
                    isOneSignalInitialized = true; // Mark as initialized
                    getUserId();
                    handlePushNotification();
                })
                .catch((error) => {
                    console.error("Error initializing OneSignal:", error);
                });
        } else {
            console.log("OneSignal already initialized.");
            handlePushNotification();
        }
    }
};

const handlePushNotification = () => {
    console.log(OneSignal === 'undefined')
    OneSignal.push(() => {
        OneSignal.isPushNotificationsEnabled()
            .then((isEnabled) => {
                if (isEnabled) {
                    console.log("Push notifications are enabled!");
                    OneSignal.showSlidedownPrompt().catch((err) => {
                        console.error("Slidedown Prompt Error:", err);
                    });
                    getUserId();
                } else {
                    console.log("Push notifications are not enabled yet.");
                }
            })
            .catch((error) => {
                console.error("Error checking notification status:", error);
            });
    });
};

const getUserId = async() => {
    const userID = await OneSignal.getUserId()
    console.log("User ID (Player ID):", userID);
    OneSignal.getUserId()
    .then((userId) => {
            console.log("User ID (Player ID):", userId);
            if (userId) {
                // Send the userId to your backend for further processing
            } else {
                console.log("User is not subscribed yet.");
            }
        })
        .catch((error) => {
            console.error("Error fetching User ID:", error);
        });
};

export default initializeOneSignal;
