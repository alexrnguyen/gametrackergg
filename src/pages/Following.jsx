import { useParams } from "react-router-dom";
import UserGrid from "../components/UserGrid";

const Following = () => {
    const {uid} = useParams();
    
    // Temporary data
    const following = []

    return (
        <UserGrid users={following}/>
    )
}

export default Following;