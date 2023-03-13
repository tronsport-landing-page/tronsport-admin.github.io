import "./Promo.css"
import { AiFillBell } from 'react-icons/ai';
function Promo(){
    return(
        <div className="pr">
            <div className="pr-head">
                <div className="pr1">
                    <br/>
                    DARK MODE
                </div>
                <div className="2"pr>
                    <br/>
                    <span className="prnoti">NOTIFICATION TELEGRAM</span>
                    < AiFillBell/>
                </div>
            </div>
            <div>
                <p className="prheading">Promotional materials</p>
            </div>
            <div className="btnflex">
                <div className="subbtn">
                    <button className="btndes">Presentations</button>
                </div>
                <div className="subbtn">
                    <button className="btndes">Texts</button>
                </div>
                <div className="subbtn">
                    <button className="btndes">Banners</button>
                </div>
                <div className="subbtn">
                    <button className="btndes">Video</button>
                </div>
            </div>
            
        </div>
    )
}
export default Promo;