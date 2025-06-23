import "./AccueilSlide.css"
import BannerA from "./BannerA.jsx"
import BannerB from "./BannerB.jsx"
import BannerC from "./BannerC.jsx"
import BannerD from "./BannerD.jsx"
import BannerE from "./BannerE.jsx"

export default function AccueilSlide(){
  return(
    <div className="AccueilSlide">
      <div className="wrapperSlide">
        <BannerA />
        <BannerB />
        <BannerC />
        <BannerD />
        <BannerE />
      </div>
    </div>
  )
}