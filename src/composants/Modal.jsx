import "./Modal.css"
import Connexion from "../auth/Connexion"
import Inscription from "../auth/Inscription"
import {useState} from "react"

export default function Modal (){
  const [changeModal, setChangeModal] = useState(true)
  return(
    <div className="modalWrap">
      <div className="modal">
        {changeModal ? <Connexion changeModal={changeModal} setChangeModal={setChangeModal} /> : <Inscription changeModal={changeModal} setChangeModal={setChangeModal} />}
      </div>
    </div>
    
  )
}