import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
const api_base = "https://chat-me-chatterbox.herokuapp.com"

function ChatInput(props) {

    const [messages, setMessages] = props.messages;
    const socket = props.socket;
    const from = props.from; 
    const to = props.to;
    const [msg, setMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (event, emojiObject) => {
        let message = msg;
        message += emojiObject.emoji;
        setMsg(message);
    };

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

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {

            const data = {
                from: from._id,
                to: to._id,
                message: msg,
                date: getDate()
            }

            fetch(api_base + '/addMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .catch((err) => console.error("Not connected"));
        
            socket.current.emit("send-msg", {
                to: to._id,
                from: from._id,
                message: msg
            })
            const msgs = [...messages];
            msgs.push({ fromSelf: true, message: msg, date: data.date });
            setMessages(msgs);
            setMsg("");
        }
    };

    return (
        <div className="chatInput">

            <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} className="emojiSymbol"/>
            
            {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} className="picker"/>}
            
            <form onSubmit={sendChat} className="msgForm">
                <input type="text" placeholder="Enter the message here" onChange={(e) => setMsg(e.target.value)} value={msg} className="msgInput"/>
                <button type="submit" className="send"><IoMdSend /></button>
            </form>

        </div>
    );
}

export default ChatInput