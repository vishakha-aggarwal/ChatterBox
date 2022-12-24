import React, { useState, useRef, useEffect } from 'react'
import ChatInput from './ChatInput';
import { v4 as uuidv4 } from "uuid";
const api_base = "https://chat-me-chatterbox.vercel.app"


function ChatContainer(props) {

    const socket = props.socket;
    const currentChat = props.currentChat;
    const myself = props.myself;
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();

    function getDate()
    {     
        const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        let date = new Date(Date.now()).getDate();
        let month = new Date(Date.now()).getMonth();
        let hr = new Date(Date.now()).getHours();
        let min = new Date(Date.now()).getMinutes();
   
        let ans;
        let h = hr;
        if(hr > 12)
            h = hr%12;
        if(h < 10)
            h = "0" + h;
        if(min < 10)
            min = "0" + min;
        if(h === "00")
            h = "12";
        ans = date + " " + monthName[month] + " " + h + ":" + min;
        if(hr > 12)
            ans+= " pm";
        else
            ans+= " am";

        return ans;
    }

    useEffect(() => {

        const from = myself._id;
        const to = currentChat._id;
        fetch(api_base + "/getmessages/" + from + "/" + to)
        .then(res => res.json())
        .then((data) => { 
            setMessages([]);
            data.map((val, idx) => {
                setMessages((oldList) => {
                return [...oldList, val];
            })
        })
            // console.log(contacts.length);
        })
        .catch((err) => console.error("Not connected"));

    },[currentChat])

    useEffect(() => {
        if (socket.current) 
        {
            socket.current.on("msg-recieve", (msg) => {
                // console.log(msg);
                setArrivalMessage({ fromSelf: false, message: msg, date: getDate()});
            });
        }
    }, []);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {

        let ele = document.querySelector(".chatBox");
        ele.scrollTop = ele.scrollHeight;

    }, [messages]);

    
    return (
        <div>
            <div className='openedContact'>{currentChat.username}</div>
            <div className = "chatBox">
            {messages.map((message) => {
            return (
            <div ref={scrollRef} key={uuidv4()}>
                <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                    <div className="text ">
                        <p style={{fontFamily: "cursive"}}>{message.message}</p>
                        {/* {console.log(message.date)} */}
                        <div style={{fontFamily: "oblique"}}>{message.date}</div>
                    </div>
                </div>
            </div>
            );
            })}
            </div>
          
        <ChatInput from = {myself} to = {currentChat} socket = {socket} messages = {[messages, setMessages]}/>
        </div>
    )
}

export default ChatContainer