import { useState } from "react";
import {ADMIN_API_URL} from '../../../util/API_URL';
import { dynamicToast } from '../../shared/Toast/DynamicToast'

const Notification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const sendNotification = async () => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, message })
      });

      const data = await response.json();
      if (data.success) {
        dynamicToast({ message: `Notification sent successfully!`, timer : 5000, icon: 'success' })
      } else {
        dynamicToast({ message: `Error sending notification!`, timer : 5000, icon: 'error' })
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    }
  };

  return (
        <>

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
