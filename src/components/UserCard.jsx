const UserCard = ({user}) => {
    console.log(user);
    return (
        <a href={`/profile/${user._id}`} className="flex flex-col gap-4">
            <hr />
            <div className="flex gap-4 items-center">
                <div className="rounded-full w-12 h-12 border-black border-2 overflow-hidden">
                    <img src={user.profile_image_url} alt="Profile Picture" />
                </div>
                <h1>{user.username}</h1>
            </div>
            <hr />
        </a>
    )
}

export default UserCard;