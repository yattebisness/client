import { useEffect, useState } from 'react'
import { Data } from '../fetching/Data'
import "./Categorie.css"

export default function Categorie() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await Data()
      setCategories(data)
    }
    fetchData()
  }, [])

  return (
    <div className="Categorie">
      {categories.map(item=>{
        return(
          <div key={item.id} className="CategorieItem">
              <img src={item.image} alt={item.name} />
            <div className="CategorieNom">
              {item.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}
