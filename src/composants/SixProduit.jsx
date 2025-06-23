import "./SixProduit.css"
import { Donnees } from "../fetching/Donnees"
import {useState, useEffect} from "react"
import { useRouter } from "next/navigation";

function lepoint(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export default function SixProduit(){
  
  const router = useRouter()
  
  const [prod, setProd] = useState([])
  
  useEffect(()=>{
    const fetchdata = async ()=>{
      const data = await Donnees()
      setProd(data)
    }
    fetchdata()
  },[])
  
  
  return(
    <div className="SixProduit">
      {prod.map(item => item.id > prod.length-4 ? <div key={item.id} className="sixItem">
        <div className="sixWrapper" onClick={() => router.push(`detail/${item.id}`)}>
        <p>{item.name}</p>
        <img src={item.image} alt={item.name} />
        <div className="sixPrice"><p>{lepoint(item.price)}f</p></div>
      </div></div>: "" )}
    </div>
  )
  
}