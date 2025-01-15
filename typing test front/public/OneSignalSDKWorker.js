importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

//change sw.js to the name of your previous service worker file
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      if (registration.active.scriptURL.includes("sw.js")) {
        registration.unregister();
      }
    } 
});
}
  