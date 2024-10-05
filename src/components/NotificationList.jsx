import { useEffect, useState } from "react";

const NotificationList = ({uid}) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        async function getNotifications() {
            // Get notifcations for user with the given uid from the backend server
            const response = await fetch(`http://localhost:5000/api/users/${uid}/notifications`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            } else {
                // TODO: Handle errors
            }
        }

        getNotifications();
    }, [uid]);

    return (
        <div>
            {notifications.length === 0 && <span>No recent activity</span>}
            {notifications.map(notification => <span key={notification._id}>{notification.text}</span>)}
        </div>
    );
}

export default NotificationList;