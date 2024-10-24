import UserCard from "./UserCard";

const UserList = ({users}) => {
    
    return (
        <ul className="flex flex-col md:w-1/2 gap-4 mt-4 mx-4">
            {users.map(user => {
                return (
                    <UserCard key={user.username} user={user}/>
                )
            })}
        </ul>
    )
}

export default UserList;