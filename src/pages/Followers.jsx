import { useParams } from "react-router-dom";
import UserList from "../components/UserList";
import { useEffect, useState } from "react";

const Followers = () => {
    const { uid } = useParams();

    const [followers, setFollowers] = useState([]);
    
    useEffect(() => {
        async function getFollowers(userId) {
            const response = await fetch(`http://localhost:5000/api/users/${userId}/followers`);
            const data = await response.json();
            setFollowers(data);
        }

        getFollowers(uid);
    }, [uid]);

    return (
        <>
            <h1 className="text-2xl">Followers</h1>
            {followers.length === 0 ? <span>No results</span> : null}
            <UserList users={followers}/>
        </>
    )
}

export default Followers;