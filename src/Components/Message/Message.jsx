import React from 'react'
import "./Message.css"
import { AiFillBell } from 'react-icons/ai'
import message from './message.jpg';
function Message(){
    return(
        <div className="Msg">
            <div className="msg-head">
                <div className="mh1">
                    <br/>
                    DARK MODE
                </div>
                <div className="mh2">
                    <br/>
                    <span className="mnoti">NOTIFICATION TELEGRAM</span>
                    < AiFillBell/>
                </div>
            </div>
            <div>
                <p className="mheading">No authorization</p>
            </div>
            <div className="msgbox">
                <div className="boxhead">
                    <center><p className="headstyle">In order to read your messages and be able to communicate with your partners and uplines, you must log in to your account through the “Auto Login” function.</p>
                </center>
                </div>
                <div className="boxcontent">
                    <center><img src={message} className="msgimage" alt="message"></img>
                    <p className="headstyle">If you still have questions, you can ask other members in our <a target="_blank"rel="noreferrer" href="https://t.me/millionmoneychat">Telegram Chat</a>.</p>
                    </center>
                </div>
            </div>
        </div>
    )
}
export default Message;