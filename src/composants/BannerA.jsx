import "./BannerA.css"

export default function BannerA(){
  return(
    <div className="BannerWrappers">
        <div className="promoA">
        <div className="promoA1">
          offres exclusives a ne pas manquer
        </div>
        <div className="promoA2">
          aux meileurs prix
        </div>
        
      </div>
      <div className="promoB">
        <div className="promoA3">
          -40%
        </div>
        <img src="phones.png" alt="phones" />
        <img src="fone.png" alt="fone" />
      </div>
    </div>
  )
}