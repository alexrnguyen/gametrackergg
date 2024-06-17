import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [invalidLogin, setInvalidLogin] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        // Check if user with corresponding password is in the database
        const data = {username, password};
        const response = await fetch("http://localhost:5000/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("username", data.username);
            localStorage.setItem("userId", data.userId);
            navigate('/');
            window.location.reload();
        } else {
            console.log("Invalid login");
            setInvalidLogin(true);
            console.log(invalidLogin);
        }
    }

    return (
        <div className="grid place-content-center">
             <h1 className="text-center text-2xl font-bold m-4">Sign In</h1>
             <form onSubmit={handleSubmit} autoComplete="off">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-4">
                        <TextField
                            label='Username' 
                            size="medium" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                            required
                        />
                        <TextField
                            label='Password' 
                            type='password'
                            size="medium" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                        {invalidLogin ? <p id="signin-error" className="text-error">Invalid username or password</p> : null}
                        <p>Don&#39;t have an account? <Link className="font-bold" to="/sign-up">Sign Up</Link></p>
                    </div>
                    <Button type="submit" variant="contained" color="success">Sign In</Button>
                </div>
            </form>
        </div>
    )
}

export default SignIn;