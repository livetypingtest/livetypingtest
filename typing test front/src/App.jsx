import initializeOneSignal from './component/shared/OneSignal/initializeOneSignal';
import AllRoutes from './config/AllRoutes';
import { ChakraProvider } from '@chakra-ui/react';
import { ADMIN_API_URL } from './util/API_URL';
import axios from 'axios'
import { useEffect } from 'react';


const App = () => {  

  // initializeOneSignal()

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


  return (
    <ChakraProvider>
      <AllRoutes />
    </ChakraProvider>
  )
}

export default App