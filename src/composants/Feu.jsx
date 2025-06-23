"use client"

import {useState, useEffect} from "react"
import "./Feu.css"
import { Donnees } from "../fetching/Donnees"
import { useRouter } from "next/navigation";

function lepoint(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



export default function Feu(){
  
  const router = useRouter();
  
  const [art, setArt] = useState([])
  
  useEffect(()=>{
    const fetchdata = async()=>{
      const res = await Donnees()
      setArt(res)
    }
    fetchdata()
  },[])
  
  
  
  
  const data = art.slice(6,19)
  return(
    <div className="Categoriels">
      {data.map(item=>{
        return(
          <div key={item.id} className="CategorieItemls" onClick={() => router.push(`/${item.id}`)}>
            <div className="CategoriePricels">
              {item.name}
            </div>
              <img src={item.image} alt={item.name} />
            <div className="CategorieNomls">
              {lepoint(item.price)}f
            </div>
          </div>
        )
      })}
    </div>
  )
}