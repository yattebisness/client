import "./Modal.css"
import OrderConnexion from "../auth/OrderConnexion"
import OrderInscription from "../auth/OrderInscription"
import {useState} from "react"

export default function OrderModal (){
  const [changeModal, setChangeModal] = useState(true)
  return(
    <div className="modalWrap">
      <div className="modal">
        {changeModal ? <OrderInscription changeModal={changeModal} setChangeModal={setChangeModal} /> : <OrderConnexion changeModal={changeModal} setChangeModal={setChangeModal} />}
      </div>
    </div>
    
  )
}