import { Alert, Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    const [errorMessage, setErrorMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const navigate = useNavigate();

    /**
     * 
     * @param {*} e 
     */
    async function handleSubmit(e) {
        e.preventDefault();

        if (password === passwordConfirm) {
            setPasswordsMatch(true);
            const data = {username, email, password};

            // TODO: Add user to the database
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.status === 201) {
                localStorage.setItem("username", username);
                setShowAlert(true);
                setErrorMessage("");
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();
                }, 2000);
            } else {
                // Something went wrong. Retrieve and display error message
                const data = await response.json();
                setErrorMessage(data.message);
            }
        } else {
            setPasswordsMatch(false);
            setErrorMessage("Passwords do not match!");
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
                        {errorMessage ? <p id="signup-error" className="text-error">{errorMessage}</p> : null}
                        <p>Already have an account? <Link className="font-bold" to="/sign-in">Sign In</Link></p>
                    </div>
                    <Button type="submit" variant="contained" color="success">Sign Up</Button>
                </div>
            </form>
            {showAlert ? <Alert severity="success" className="absolute bottom-5 left-5">Account successfully created!</Alert> : null}
        </div>
    )
}

export default SignUp;