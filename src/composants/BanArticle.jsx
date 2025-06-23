"use client"

import "./BanArticle.css"
import { useRouter } from "next/navigation";
export default function BanArticle() {
  
  const router = useRouter();
  
  const diriger = ()=>{
    router.push("/produits");
  }
  
  return(
    <div className="BanArticle">
      <div className="BanArticleA">
        <p>Promo <span>-40%</span></p>
        <img src="infinix.png" alt="nix" className="BanArticleAphoneA" />
        <img src="phones.png" alt="phonse" className="BanArticleAphone" />
        <img src="rmb.png" alt="toto" className="totos"/>
      </div>
      <div className="BanArticleB" onClick={diriger}>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <p>voir plus...</p>
        </a>
      </div>
    </div>
  )
}