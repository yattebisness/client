"use client"

import "./Detail.css"
import { useParams, useRouter } from "next/navigation"
import { Donnees } from "../../fetching/Donnees"
import { useState, useEffect } from "react"
import Menu from "../../composants/Menu"
import Burger from "../../composants/Burger"
import { User, ShoppingCart, Search, ShoppingBasket } from "lucide-react"
import SearchBar from "../../composants/SearchBar"
import { useCart } from "../../contextes/CartContext"
import { useAuth } from "../../contextes/AuthContext"
import Notif from "../../composants/Notif"
import { useCategoryStore } from "../../stores/Store"
import { Data } from "../../fetching/Data"
import Cookies from "js-cookie"
import { useModal } from "../../contextes/ModalContext"
import Modal from "../../composants/Modal"
import Hydrate from "../../composants/Hydrate"

function formatAmountWithSeparators(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default function Detail() {
  const { autentifier } = useAuth()
  const { showModal, setShowModal } = useModal()
  const [notifications, setNotifications] = useState([])
  const [cat, setCat] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [data, setData] = useState([])
  const [show, setShow] = useState(false)
  const { selectedCategory, setSelectedCategory } = useCategoryStore()
  const { panier, dispatch } = useCart()
  const { produitId } = useParams()
  const router = useRouter()

  useEffect(() => {
    Data().then(setCat)
    Donnees().then(setData)
  }, [])

  const ajouterNotification = () => {
    const newNotif = {
      id: Date.now(),
      message: "✓ un article a été ajouté au panier",
    }
    setNotifications((prev) => [...prev, newNotif])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id))
    }, 4000)
  }

  const displayMenu = () => setShowMenu(!showMenu)
  const displaySearch = () => setShow(!show)
  const displayModal = () => setShowModal(!showModal)
  const gohome = () => router.push("/")
  const goClient = () => router.push("/client")

  const choixCategorie = (nom) => {
    setSelectedCategory(nom)
    router.push("/produits")
  }

  const handleBuy = async (item) => {
    dispatch({ type: "ADD", payload: item })

    if (!autentifier) {
      let panierLocal = []
      try {
        const cookie = Cookies.get("guest_cart")
        panierLocal = cookie ? JSON.parse(cookie) : []
      } catch {
        panierLocal = []
      }

      const exist = panierLocal.find((p) => p.id === item.id)
      if (exist) {
        panierLocal = panierLocal.map((p) =>
          p.id === item.id ? { ...p, quantiter: p.quantiter + 1 } : p
        )
      } else {
        panierLocal.push({ ...item, quantiter: 1 })
      }
    } else {
      const token = Cookies.get("token")
      if (token) {
        try {
          const response = await fetch("https://yatteshop.pythonanywhere.com/api/shop/cart-items/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              product: item.id,
              quantity: item.quantiter || 1,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error("Erreur API panier :", errorData)
          }
        } catch (error) {
          console.error("Erreur réseau panier :", error.message)
        }
      }
    }

    ajouterNotification()
  }

  return (
    <Hydrate>
      <div className="detailMenu">
        <div className="DetailTitle">
          <Burger displayMenu={displayMenu} />
          <p onClick={gohome}>YATTE</p>
          <div className="Basket">
            <ShoppingBasket style={{ width: "20px", height: "20px", color: "white" }} />
          </div>
        </div>

        <div className="DetailRightTitle">
          <div className="DetailSearch">
            <Search onClick={displaySearch} />
          </div>
          <div className="user">
            {autentifier ? (
              <div className="authUser">
                <User onClick={goClient} />
              </div>
            ) : (
              <User onClick={displayModal} />
            )}
          </div>
          <div className="cart">
            <ShoppingCart onClick={() => router.push("/panier")} />
            <p className={panier.length > 0 ? "cartP" : ""}>{panier.length > 0 ? panier.length : ""}</p>
          </div>

          <div className={showMenu ? "MenuVisible" : "MenuHide"}>
            <div className="MenuVisibleTitle" onClick={() => setSelectedCategory(null)}>
              Nos Catégories
            </div>
            <div className="visiblewcat">
              {cat.map((item) => (
                <div key={item.id} className="itemvisible" onClick={() => choixCategorie(item)}>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
          {showModal && <Modal />}
        </div>
      </div>

      <div className="detailWrapper">
        <div className={show ? "visible" : "cache"}>
          <SearchBar />
        </div>
        <br />
        {data.map((item) =>
          item.id === +produitId ? (
            <div key={item.id}>
              <div className="DetailH">
                <img src={item.logo} alt={item.name} />
                <p>{Math.floor(((item.price - item.pribarrer) / item.pribarrer) * 100)}%</p>
              </div>
              <div className="conImg">
                <div className="imgDetailWrapper">
                  <img src={item.image} alt={item.name} />
                  <img src={item.image2} alt={item.image2} />
                  <img src={item.image3} alt={item.image3} />
                </div>
              </div>
              <p className="DetailPrice">{formatAmountWithSeparators(item.price)} FCFA</p>
              <p className="Detailprix">{formatAmountWithSeparators(item.pribarrer)} FCFA</p>
              <p className="detaildes">{item.description}</p>
              <div className="btnDetail" onClick={() => handleBuy(item)}>
                ajouter au panier
              </div>
            </div>
          ) : null
        )}
      </div>
    </Hydrate>
  )
}
