import React, { useEffect, useState, useRef } from "react";
import { useDeferredValue } from "react";
import { Link, useNavigate } from "react-router-dom";
import Contacts from '../components/Contacts'
import ChatContainer from "../components/ChatContainer";
import { io } from 'socket.io-client'
const api_base = "https://chat-me-chatterbox.vercel.app";

function Chat() {

  const socket = useRef();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [found, setFound] = useState(0);
  const [searchUser, setSearchUser] = useState("");
  const [showContacts, setShowContacts] = useState(true);

  useEffect(() => {
    getuser();
    // console.log(currentUser);
  }, []);

  useEffect(() => {

    if(currentUser)
    {
      socket.current = io(api_base);
      socket.current.emit("add-user", currentUser._id);
    }

  }, [currentUser])
  
  const getuser = () => {
    
    let currentURL = window.location.pathname;
    let id = currentURL.substring(6);
    
    fetch(api_base + "/getuserdetail/" + id)
    .then(res => res.json())
    .then((data) => {
      setCurrentUser(data)
      getcontacts();
      
    })
    .catch((err) => console.error("Not connected"));
  }
  
  const getcontacts = () =>{
    
    // console.log(found);
    // setFound(true);
    let currentURL = window.location.pathname;
    let id = currentURL.substring(6);
    // console.log(api_base + "/getcontacts/" + id + "/" + searchUser);
    fetch(api_base + "/getcontacts/" + id + "/" + searchUser)
    .then(res => res.json())
    .then((data) => { 
        setContacts([]);
        data.map((val, idx) => {
          setContacts((oldList) => {
            return [...oldList, val];
          })
        })
        // console.log(contacts.length);
      })
      .catch((err) => console.error("Not connected"));
  }

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  useEffect(() => {
    // console.log(searchUser);
    getcontacts();
  }, [searchUser])

  const changeUserSearch = (e)=>{

    setSearchUser(e.target.value);
    // getcontacts();
  }

  const showHideCont = () => {
    setShowContacts(!showContacts);
    setFound(1);
    if(showContacts)
    document.getElementsByClassName("showChat")[0].innerHTML = "Show All Contacts";
    else
    document.getElementsByClassName("showChat")[0].innerHTML = "Show Chat";
    
  }

  return (
    <div>
      <div className='heading' style = {{marginTop: "10px"}}>Chatter-BOX</div>
      <div>
        <Link to = "/login">
          <img className='logout' src={require('../Images/logout.jpg')} />
        </Link>
      </div>
      <button onClick={showHideCont} className="showChat">Show Chat</button>
      {/* {console.log(showContacts)} */}

      <div className='Container'>
        <div className="contactsBar" style ={{display: showContacts===false? "none": "inline"}}>
          <div style={{fontFamily: "cursive", fontSize: "16px", textAlign: "center", padding: "10px"}}>All Users</div><hr />
          <input type = "text" placeholder="Search User" onChange={(e) => changeUserSearch(e)} className="search" />
          <Contacts contacts={contacts} changeChat={handleChatChange} className="contact"/>
          {currentUser !== undefined ? (<div className="myselfDesc">YOU- {currentUser.username}</div>):<div /> }
        </div>
        <div className="chatContainer" style ={{display: ((showContacts===false)|| (window.innerWidth > 750))? "inline": "none"}}>
          {currentChat === undefined ? <div style={{textAlign: "center"}}>
              <img  src={require('../Images/welcome.gif')} className="welcome"/></div> :
            <ChatContainer myself = {currentUser} currentChat = {currentChat} socket = {socket}/>
          }
        </div>
      </div>
    </div>
  )
}

export default Chat