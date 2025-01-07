import { getToken } from "firebase/messaging";
import { useEffect } from "react";
import { messaging } from '../../../firebaseConfig'
import { USER_API_URL } from "../../../util/API_URL";


const requestPermission = async () => {
    try {
        const token = await getToken(messaging, { vapidKey: "BOU19idOtLs9r2PE7MlijvtivcxdL4lEBU_r3wMt0VTA1thHhytEGAlTk2LDBsPDsV9A2yOX7PyBJnSKJ0BOfGM" });
        if (token) {
        // Save the token to the server
        await fetch(`${USER_API_URL}/save-token`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, userId: localStorage.getItem('userToken') }) // Replace with dynamic user ID
        });
        // console.log("Token saved:", token);
        } else {
        console.log("No registration token available. Request permission to generate one.");
        }
    } catch (error) {
        console.error("An error occurred while retrieving token:", error);
    }
    };

export {requestPermission}