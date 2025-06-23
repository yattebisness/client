'use client';

import { useEffect, useState } from 'react';
import './SixOffre.css';
import { Donnees } from '../fetching/Donnees';
import { useRouter } from "next/navigation"

function lepoint(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function SixOffre() {
  
  const router = useRouter();
  
  const [art, setArt] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await Donnees();
      setArt(res);
    };
    fetchData();
  }, []);

  const data = art.slice(4, 10);
  
  const detail = (id)=>{
    router.push(`detail/${id}`);
  }

  return (
    <div className="SixOffre">
      {data.map((item) => (
          <div className="SixOffreItem" key={item.id} onClick={() => router.push(`/${item.id}`)}>
            <p>{item.name}</p>
            <img src={item.image} alt={item.name} />
            <p className="sixPrice">{lepoint(item.price)}f</p>
          </div>
      ))}
    </div>
  );
}
