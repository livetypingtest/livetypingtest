import { useState } from "react";
import {ADMIN_API_URL} from '../../../util/API_URL';
import { dynamicToast } from '../../shared/Toast/DynamicToast'
import DynamicTitle from "../../shared/helmet/DynamicTitle";

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
