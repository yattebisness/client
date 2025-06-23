import {useState, useEffect} from "react"
import {Donnees} from "../fetching/Donnees"
import { useRouter } from "next/navigation";

function lepoint(amount) {

  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}



export default function LastOffre(){
  
  const router = useRouter();
  
  const [art, setArt] = useState([])
  
  useEffect(()=>{
    const fetchdata = async ()=>{
      const res = await Donnees()
      setArt(res)
    }
    fetchdata()
  },[])
  
  const data = art.slice(2,14)

  const detailDir = (id)=>{
    router.push(`/${id}`)
  }
  
  return(
    <div style={{
      margin:"5px 0",
    }}>
    <div className="SixOffre">
      {data.map(item=>{
        return(
        <div key={item.id} className="SixOffreItem" onClick={()=>detailDir(item.id)}>
          <p>{item.name}</p>
          <img src={item.image} alt={item.name} />
          <p className="sixPrice">{lepoint(item.price)}f</p>
        </div>
        )
      })}
    </div>
    </div>
  )
}