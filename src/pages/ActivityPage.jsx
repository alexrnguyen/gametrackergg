import Cookies from "js-cookie";
import NotificationList from "../components/NotificationList";

const ActivityPage = () => {
    const currentUserId = Cookies.get("userId");


    return (
        <div className="py-4">
            <h1 className="text-2xl mb-2">Activity</h1>
            <NotificationList uid={currentUserId} />
        </div>
    )
};

export default ActivityPage;