import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [invalidLogin, setInvalidLogin] = useState(false);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        // TODO: Check if username/password is in the database
        localStorage.setItem("username", username);
        navigate('/');
        window.location.reload();
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
                        <p id="signin-error" className="text-error hidden">Invalid username or password</p>
                        <p>Don&#39;t have an account? <Link className="font-bold" to="/sign-up">Sign Up</Link></p>
                    </div>
                    <Button type="submit" variant="contained" color="success">Sign In</Button>
                </div>
            </form>
        </div>
    )
}

export default SignIn;