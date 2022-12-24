import React, { useEffect, useState } from 'react'
import { useNavigate, Link, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const api_base = "https://chat-me-chatterbox.vercel.app";
// const api_base = "http://localhost:3001"


function Register() {

    const navigate = useNavigate();

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const setChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }


    const isValidInfo = () => {

        const { password, confirmPassword, username, email } = values;
        if (password !== confirmPassword) {
            toast.error("Password and confirm password should be same.", toastOptions);
            return false;
        }
        else if (username.length < 3) {
            toast.error("Username should be greater than 3 characters.", toastOptions);
            return false;
        }
        else if (password.length < 8) {
            toast.error("Password should be equal or greater than 8 characters.", toastOptions);
            return false;
        }
        else if (email === "") {
            toast.error("Email is required.", toastOptions);
            return false;
        }
        
        return true;
    };
    
    const submitForm = async (e) => {
        
        e.preventDefault();
        
        if (isValidInfo()) 
        {
            let resp;
            const { email, username, password } = values;
            let url = api_base + "/api/v1/isValid/" + username + "/" + email;
            // console.log(url);
            await fetch(url)
            .then((res) => res.json())
            .then(data => resp = data)
            .catch((err) => console.error("Not connected"));
            
            // console.log(resp.status);

            if (resp.status !== true) {
                // console.log("jelklerjfer");
                toast.error(resp.msg, toastOptions);
                return;
            }
            
            const data = {
                username: username,
                email: email,
                password: password
            }

            fetch(api_base + '/api/v1/addUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .catch((err) => console.error("Not connected"));
                
            navigate("/");
        }

    }

    return (
        <div>
            <div className='registerLeft'>
                <div className='heading'>Chatter-BOX</div>
                <div className='registerForm'>                    
                    <div style={{fontSize: "22px", fontFamily: "cursive", fontStyle: "italic", textAlign: "center", margin: "5px"}}>Register Here</div>
                    <form onSubmit={submitForm} method = "POST" className='formRegister'>
                        Enter Username<br />
                        <input type="text" placeholder="Enter Username" name="username" onChange={(e) => setChanges(e)} className = "input"/>
                        <br/>Enter Email<br />
                        <input type="email" placeholder="Enter Email" name="email" onChange={(e) => setChanges(e)} className = "input"/>
                        <br/>Enter Password<br/>
                        <input type="password" placeholder="Enter Password" name="password" onChange={(e) => setChanges(e)} className = "input"/>
                        <br/>Confirm Password<br/>
                        <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={(e) => setChanges(e)} className = "input"/>
                        <button type = "submit" className='registerBtn'>Create New User</button>
                        <div>Already have an account ? <Link to="/login">Login</Link></div>
                    </form>
                </div>
            </div>
            <div>
                <img className='registerImg' src={require('../Images/register.webp')} />
            </div>
            <ToastContainer />
        </div>
    )
}

export default Register