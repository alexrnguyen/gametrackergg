import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * 
 * @returns 
 */
const SignUp = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [passwordsMatch, setPasswordsMatch] = useState(true);

    /**
     * 
     * @param {*} e 
     */
    function handleSubmit(e) {
        e.preventDefault();

        if (password === passwordConfirm) {
            document.getElementById("password-mismatch").classList.add("hidden");
            setPasswordsMatch(true);
            console.log(username, email, password);

            // TODO: Add user to the database

            console.log("User Registered!");
        } else {
            document.getElementById("password-mismatch").classList.remove("hidden");
            setPasswordsMatch(false);
        }
    }

    // TODO: Retrieve values from TextFields when Submit button is clicked
    return (
        <div className="grid place-content-center">
            <h1 className="text-center text-2xl font-bold m-4">Sign Up</h1>
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
                            label='Email' 
                            type="email" 
                            size="medium" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                        <TextField 
                            label='Password' 
                            type="password" 
                            size="medium" 
                            autoComplete="off"
                            error={!passwordsMatch}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                        <TextField 
                            label='Confirm Password' 
                            type="password" 
                            size="medium" 
                            autoComplete="off"
                            error={!passwordsMatch}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)} 
                            required
                        />
                        <p id="password-mismatch" className="text-error hidden">Passwords do not match</p>
                        <p>Already have an account? <Link className="font-bold" to="/sign-in">Sign In</Link></p>
                    </div>
                    <Button type="submit" variant="contained" color="success">Sign Up</Button>
                </div>
            </form>
        </div>
    )
}

export default SignUp;