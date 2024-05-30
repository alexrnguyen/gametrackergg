import { useParams } from "react-router-dom";
import UserGrid from "../components/UserGrid";

const Followers = () => {
    const {uid} = useParams();
    
    // Temporary data
    const followers = []

    return (
        <UserGrid users={followers}/>
    )
}

export default Followers;