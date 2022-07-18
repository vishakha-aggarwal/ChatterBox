import React from 'react'
import { useNavigate } from "react-router-dom";


function Home() {

  const navigate = useNavigate();

  const clickButton = () => {
    navigate("/login");
  }

  return (
    <div className='home'>
      <div className='homeLeft'>
        <div className='heading'>Chatter-BOX</div>
        <div className='content'>
          <div className='cont'>
            Share the world with your friends, family, relatives <br />
            Lets's connet you with the world, no matter your location
          </div>

          <div className='button' onClick={clickButton} style={{display:"flex"}}>
            <div style = {{marginTop: "10px", color: "white", height: "50px",fontSize: "22px", fontFamily: "cursive"}}>Get started</div>
            <img src={require('../Images/btn.png')} style = {{height: "60px"}}/>
          </div>
        </div>
      </div>
      <div>
        <img className='homeImg' src={require('../Images/home.webp')} />
      </div>
    </div>
  )
}

export default Home