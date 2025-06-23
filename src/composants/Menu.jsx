'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

import { User, ShoppingCart, ShoppingBasket } from "lucide-react"

import Burger from "./Burger"
import SearchBar from "./SearchBar"
import "./Menu.css"

import { Data } from "../fetching/Data"
import { useCart } from "../contextes/CartContext"
import { useModal } from "../contextes/ModalContext"
import { useAuth } from "../contextes/AuthContext"
import { useCategoryStore } from "../stores/Store"
import  Link  from "next/link"

export default function Menu() {
  const [commande, setCommande] = useState()
  const [user, setUser] = useState([])
  const [cat, setCat] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { fetchPanier, dispatch, panier } = useCart()
  const { autentifier, setAutentifier } = useAuth()
  const { showModal, setShowModal } = useModal()
  const { selectedCategory, setSelectedCategory } = useCategoryStore()

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchdata = async () => {
      const data = await Data()
      setCat(data)
    }
    fetchdata()
  }, [mounted])

  const choixCategorie = (nom) => {
    setSelectedCategory(nom)
    router.push("/produits")
  }

  const displayMenu = () => setShowMenu(!showMenu)
  const displayModal = () => setShowModal(!showModal)

  const goCart = () => router.push("/panier")
  const goClient = () => router.push("/client")
  const goHome = () => router.push("/")

  const deconnexion = () => {
    Cookies.remove("token")
    Cookies.remove("autentifier")
    setAutentifier(false)
    dispatch({ type: "CLEAR" })
  }

  const takeUser = async () => {
    const token = Cookies.get("token")
    const res = await fetch("https://yatteshop.pythonanywhere.com/api/auth/user/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    const response = await res.json()
    setUser(response)
  }

  useEffect(() => {
    if (autentifier && mounted) {
      fetchPanier()
      takeUser()
    }
  }, [autentifier, mounted])

  if (!mounted) return null

  return (
    <div className="MenuContainer">
      <div className="MenuWrapper">
        <div className="Menu">
          <div className="MenuLeft">
            <Burger displayMenu={displayMenu} />
            <div className="title" onClick={goHome}>
              yatte
              <div className="Basket">
                <ShoppingBasket style={{ width: 20, height: 20, color: "white" }} />
              </div>
            </div>
          </div>

          <div className="MenuRight">
            <div className="user">
              {autentifier ? (
                <div className="authUser">
                  <User onClick={goClient} className="UsCart" />
                </div>
              ) : (
                <User onClick={displayModal} className="UsCart" />
              )}
            </div>
            <div className="cart" onClick={()=>router.push('/panier')}>
              <ShoppingCart className="Menushopp" />
              <p className={panier.length > 0 ? "cartP" : ""}>
                {panier.length > 0 ? panier.length : ""}
              </p>
            </div>
          </div>

          <div className={showMenu ? "MenuVidible" : "MenuHide"}>
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
        </div>

        <SearchBar />
      </div>

      <div className="fmenu">
        <span className="phoneSms">Commandez par appel au :</span>
        <span className="phoneNumber">07-67-74-37-32</span>
      </div>
    </div>
  )
}
