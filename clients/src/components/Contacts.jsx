import React, { useEffect, useState, useRef } from "react";


function Contacts(props) {

    const contacts = props.contacts;
    const changeChat = props.changeChat;
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(contact._id);
        changeChat(contact);
    };

    return (
        <div className='contacts'>
            {contacts.map((contact, index) => {
            return (
                <div key={contact._id} className={`contact ${contact._id === currentSelected ? "selected" : ""}`} onClick={() => changeCurrentChat(index, contact)} >
                    <div className="username">
                        {contact.username}
                    </div>
                </div>
            )
            })}
        </div>
    )
}

export default Contacts