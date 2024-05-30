import UserCard from "./UserCard";

const UserGrid = ({users}) => {

    return (
        <>
            {users.map(user => {
                return (
                    <UserCard key={user.username} user={user}/>
                )
            })}
        </>
    )
}

export default UserGrid;