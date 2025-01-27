import { useState } from "react";
import {ADMIN_API_URL} from '../../../util/API_URL';
import { dynamicToast } from '../../shared/Toast/DynamicToast'
import DynamicTitle from "../../shared/helmet/DynamicTitle";
import axios from 'axios'

const Notification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");

  const sendNotification = async () => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, message, url })
      });
      

      const data = await response.json();
      if (data.success) {
        dynamicToast({ message: `Notification sent successfully!`, timer : 5000, icon: 'success' })
        setTitle('')
        setUrl('')
        setMessage('')
      } else {
        dynamicToast({ message: `Error sending notification!`, timer : 5000, icon: 'error' })
        setTitle('')
        setUrl('')
        setMessage('')
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    }
  };

//   // Function to send the push notification via OneSignal
//           const sendPushNotification2 = async (notificationData) => {
//               try {
//                   const response = await axios.post(
//                       'https://onesignal.com/api/v1/notifications',
//                       {
//                           app_id: 'b8fd727a-8b0a-4356-b717-5bac1ba4934d', // Replace with your App ID
//                           headings: { en: notificationData.title }, // Notification title
//                           contents: { en: notificationData.message }, // Notification message
//                           include_player_ids: 'dAhSnDL0zro:APA91bFJxPgNLnPhdjqIfI3VUH6O_yYf7OuOTZtpwytQVGZCS9Ka_JluDQuohEUWlbDqnC7alWbH3uco-ry6pHQrdV8nQbiqA2CG6MrHCnHJu_Yg1gFOw-55iCl5SkXpWZdz_g4A4E0a',
//                           url: notificationData.url, // Clickable URL
//                       },
//                       {
//                           headers: {
//                               Authorization: `Basic os_v2_app_xd6xe6ulbjbvnnyxlowbxjetjukcwae4l2fezof2pwcoqxiwsk6wfje77wblxj3tdatpxsy6j27jizzdpptuk7swarr5k5cyy5dke2a`, // Replace with your REST API Key
//                               'Content-Type': 'application/json',
//                           },
//                       }
//                   );
  
//                   console.log('Notification sent:', response.data);
//                   return response.data;
//               } catch (error) {
//                   console.error('Error sending notification:', error);
//                   throw error; // Rethrow the error for the catch block in the route
//               }
//           };

//           const sendPushNotification = async (notificationData) => {
//             try {
//                 const response = await axios.post(
//                     'https://onesignal.com/api/v1/notifications',
//                     {
//                         app_id: 'b8fd727a-8b0a-4356-b717-5bac1ba4934d', // Replace with your App ID
//                         headings: { en: notificationData.title }, // Notification title
//                         contents: { en: notificationData.message }, // Notification message
//                         include_player_ids: 'dAhSnDL0zro:APA91bFJxPgNLnPhdjqIfI3VUH6O_yYf7OuOTZtpwytQVGZCS9Ka_JluDQuohEUWlbDqnC7alWbH3uco-ry6pHQrdV8nQbiqA2CG6MrHCnHJu_Yg1gFOw-55iCl5SkXpWZdz_g4A4E0a', // Target specific users by Player IDs
//                         url: notificationData.url, // Clickable URL
//                     },
//                     {
//                         headers: {
//                             Authorization: `Basic os_v2_app_xd6xe6ulbjbvnnyxlowbxjetjukcwae4l2fezof2pwcoqxiwsk6wfje77wblxj3tdatpxsy6j27jizzdpptuk7swarr5k5cyy5dke2a`, // Replace with your REST API Key
//                             'Content-Type': 'application/json',
//                         },
//                     }
//                 );
        
//                 console.log('Notification sent:', response.data);
//             } catch (error) {
//                 console.error('Error sending notification:', error);
//             }
//         };
          
//           const funct = async() => {
//             // Send the notification and collect analytics
//             const response = await sendPushNotification({title, message, url});
                
//             console.log(response)
//           }

  return (
        <>
    <DynamicTitle title={"Live Typing Test | Notification"} icon={"/assets/images/favicon.png"} description={"Live Typing Test | Notification"}  />

        <section>
            <div className="container pb-5 pt-7">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="notification-layout bg-theme">
                            <h2>Send Notification</h2>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Notification Title"
                            />
                            <input
                                type="url"
                                className="form-control"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Url"
                            />
                            <textarea
                                value={message}
                                className="form-control"
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Notification Message"
                            />
                            <button className="btn btn-primary" onClick={sendNotification}>Send Notification</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        </>
  );
};

export default Notification;
