import "./Burger.css"
import { useState } from "react"

export default function Burger({displayMenu}){
  
  const [burger, setBurger] = useState(false)
  
 const animBurger = ()=>{
   setBurger(!burger)
 }
 
  return(
    <div onClick={()=>{animBurger(), displayMenu()}} className={burger ? "Active" : "Burger"}>
      <div></div>
    </div>
  )
}