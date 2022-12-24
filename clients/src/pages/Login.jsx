import React, { useEffect, useState } from 'react'
import { useNavigate, Link, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const api_base = "https://chat-me-chatterbox.onrender.com"


function Login() {

  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [values, setValues] = useState({
    username: "",
    password: ""
  });

  const setChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const isValidInfo = () => {

    const { username, password } = values;
    
    if (username.length < 3) {
      toast.error("Username should be greater than 3 characters.", toastOptions);
      return false;
    }
    else if (password.length < 8) {
      toast.error("Password should be equal or greater than 8 characters.", toastOptions);
      return false;
    }
    return true;
  };


  const submitForm = async (e) => {

    e.preventDefault();

    if(isValidInfo())
    {
      let resp;
      const { username, password } = values;
      let url = api_base + "/api/v1/login/" + username + "/" + password;
      
      await fetch(url)
      .then((res) => res.json())
      .then(data => resp = data)
      .catch((err) => console.error("Not connected"));
            
      console.log(resp._id);
      if (resp.status !== true) {
        // console.log("jelklerjfer");
        toast.error(resp.msg, toastOptions);
        return;
      }
      // console.log("matched password and username");
      navigate(`/chat/${resp._id}`);
    }
  }

  return (

    <div>
      <div className='loginLeft'>
        <div className='heading'>Chatter-BOX</div>
        <div className='loginForm'>
          <div style={{fontSize: "22px", fontFamily: "cursive", fontStyle: "italic", textAlign: "center", margin: "10px"}}>Login to the chat </div>
          <form onSubmit={submitForm} className="formLogin">
            Enter Username<br/>
            <input type="text" placeholder="Enter username" name="username" onChange={(e) => setChanges(e)} className="input"></input>
            <br/>Enter Password<br/>
            <input type="password" placeholder="Enter password" name="password" onChange={(e) => setChanges(e)} className="input"></input>
            <button type="submit" className='loginBtn'>Login</button>
            <div style={{margin: "10px"}}>Not already registered?  
              <Link to = "/register"> Register here </Link></div>
          </form>
        </div>
      </div>
      <div>
        <img className='loginImg' src={require('../Images/login.webp')} />
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login