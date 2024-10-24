import { useParams } from "react-router-dom";
import UserGrid from "../components/UserList";
import { useEffect, useState } from "react";

const Following = () => {
    const { uid } = useParams();

    const [following, setFollowing] = useState([]);


    useEffect(() => {
        async function getFollowing(userId) {
            const response = await fetch(`http://localhost:5000/api/users/${userId}/following`);
            const data = await response.json();
            setFollowing(data);
        }

        getFollowing(uid);
    }, [uid])

    return (
        <>
            <h1 className="text-2xl">Following</h1>
            {following.length === 0 ? <span>No results</span> : null}
            <UserGrid users={following}/>
        </>
    )
}

export default Following;