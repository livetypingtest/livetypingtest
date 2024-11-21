import  { useEffect, useState } from "react";

const NotificationToats = ({ title, body, url, imageUrl }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Hide the notification after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  return (
    <div className={`cs-notification ${isVisible ? "cs-notification-show" : ""}`}>
      <div className="cs-notification-content">
        <div className="cs-notification-text">
          <h3 className="cs-notification-title">{title}</h3>
          <p className="cs-notification-body">{body}</p>
          {url && <a href={url} className="cs-notification-url">View Details</a>}
        </div>
        {imageUrl && <img src={imageUrl} alt="notification" className="cs-notification-image" />}
      </div>
    </div>
  );
};

export default NotificationToats;
