import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { handleGetUserData, handleLocalDataCalling, resetState } from '../redux/UserDataSlice';
import PageDataLoader from '../component/shared/loader/PageDataLoader';
import { messaging } from '../firebaseConfig'
import { onMessage } from "firebase/messaging";
import { ADMIN_API_URL, USER_API_URL } from '../util/API_URL';
import { dynamicToast } from '../component/shared/Toast/DynamicToast';
import { handleGetAboutData, handleGetNotice, handleGetPrivacyData, handleGetTermData } from '../redux/DynamicPagesDataSlice';
import useDynamicTitle from '../component/shared/dynamicTitle/useDynamicTitle';
import { notificationToast } from '../component/shared/Toast/NotificationToats';


const UserModule = () => {

    useDynamicTitle()
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [pageLoader, setPageLoader] = useState(false)
    const userData = useSelector(state => state.UserDataSlice.userData)
    const isDataPending = useSelector(state => state.UserDataSlice.isDataPending)
    const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)

//  Notification Setup-----------------------------------------------------------------------------------
    const shownNotifications = new Set(); // To track shown notifications

    useEffect(() => {
        // Handle foreground messages
        onMessage(messaging, (payload) => {
            const notificationId = payload.messageId || payload.notification.title;

            // Skip if the notification has already been shown
            if (shownNotifications.has(notificationId)) {
                return;
            }

            // Display notification
            notificationToast({
                message: `${payload.notification.title}`,
                body: `${payload.notification.body}`,
                url: `${payload.data.url}`,
                timer: 5000,
                icon: 'info',
            });

            // Mark the notification as shown
            shownNotifications.add(notificationId);
        });

        if ("serviceWorker" in navigator) {
            // Only register if no service worker is registered yet
            navigator.serviceWorker.ready
                .then((registration) => {
                    if (!registration.active) {
                        return navigator.serviceWorker
                            .register("/firebase-messaging-sw.js")
                            .then((registration) => {
                                // console.log("Service Worker registered with scope:", registration.scope);
                            });
                    }
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });
        }
        
    }, []);

//  Notification Setup-----------------------------------------------------------------------------------


//  Google Analytics Setup-----------------------------------------------------------------------------------
    const getGooleAnalyticsId = async () => {
        const response = await axios.get(`${ADMIN_API_URL}/google-analytics`)
        const {trackingId} = response.data
        // console.log(trackingId)
        if (!trackingId) {
            return;
        }
        const scriptTag = document.createElement("script");
        scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        scriptTag.async = true;
    
        const inlineScript = document.createElement("script");
        inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}');
        `;
    
        document.head.appendChild(scriptTag);
        document.head.appendChild(inlineScript);
    
        return () => {
        // Cleanup scripts when component unmounts
        document.head.removeChild(scriptTag);
        document.head.removeChild(inlineScript);
        };
    }

    useEffect(() => {
        getGooleAnalyticsId();
    }, []);
//  Google Analytics Setup-----------------------------------------------------------------------------------



    useEffect(()=>{
        if(!localStorage.getItem('userToken')) {
            navigate(`/signin`)
        }
    }, [])

    useEffect(()=>{
        dispatch(handleLocalDataCalling())
    }, [])  

    useEffect(()=>{dispatch(handleGetNotice())}, [])
    
    useEffect(()=>{
        const ID = localStorage.getItem('userToken')
        dispatch(handleGetUserData(ID))
    }, [])

    useEffect(()=>{
        if(isDataPending) {
            setPageLoader(true)
            dispatch(resetState())
        }
    }, [isDataPending])

    useEffect(()=>{
        if(isFullfilled) {
            setPageLoader(false)
            dispatch(resetState())
        }
    }, [isFullfilled])
    
    useEffect(()=>{
        if(userData?.isblock) {
            navigate(`/signout/${'isBlocked'}`)
        }
    }, [userData])

    useEffect(()=>{dispatch(handleGetAboutData())}, [])
    // useEffect(()=>{dispatch(handleGetPrivacyData())}, [])
    useEffect(()=>{dispatch(handleGetTermData())}, [])

    return (
        <>
            <Outlet />
            {
                pageLoader && (<PageDataLoader />) 
            }
        </>
    )
}

export default UserModule