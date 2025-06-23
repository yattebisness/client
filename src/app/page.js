"use client"

import DecathlonBanner from "../composants/DecathlonBanner";
import Menu from "../composants/Menu"
import AccueilSlide from "../composants/AccueilSlide"
import Categorie from "../composants/Categorie"
import BanArticle from "../composants/BanArticle"
import SixProduit from "../composants/SixProduit"
import Offre from "../composants/Offre"
import SixOffre from "../composants/SixOffre"
import Feu from "../composants/Feu"
import BanArt from "../composants/BanArt"
import LastOffre from "../composants/LastOffre"
import Footer from "../composants/Footer"

import { useModal} from "../contextes/ModalContext"
import  Modal from "../composants/Modal"


export default function Accueil() {
  
  const { showModal } = useModal()
  
  return (
    <div className="Accueil">
      <DecathlonBanner />
      <Menu />
      {showModal ? <Modal /> : ""}
      <AccueilSlide />
      <Categorie />
      <BanArticle />
      <SixProduit />
      <Offre />
      <SixOffre />
      <Feu />
      <BanArt />
      <LastOffre />
      <Footer />
    </div>
  )
}
