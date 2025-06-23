"use client"

import "./Order.css"
import { useCart } from "../../contextes/CartContext"
import { MoveLeft, Truck, HandCoins, Check } from "lucide-react"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

function lepoint(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0";
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function tronquerSansCouperMot(texte, maxLongueur = 85) {
  if (texte.length <= maxLongueur) return texte
  const mots = texte.split(" ")
  let resultat = ""
  for (let mot of mots) {
    if ((resultat + " " + mot).trim().length > maxLongueur) break
    resultat += (resultat ? " " : "") + mot
  }
  return resultat.trim()
}

export default function Commande() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const { panier, fetchPanier, clearCart } = useCart()

  const total = panier.reduce(
    (som, item) => som + item.quantiter * item.price + item.prix_livraison,
    0
  )

  const datelivraison = () => {
    const today = new Date()
    const demain = new Date(today)
    demain.setDate(today.getDate() + 1)
    return demain.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const takeUser = async () => {
    const token = Cookies.get("token")
    if (!token) return null
    const res = await fetch("https://yatteshop.pythonanywhere.com/api/auth/user/", {
      headers: { Authorization: `Token ${token}` },
    })
    const response = await res.json()
    setUser(response)
    return response
  }

  const gocart = () => {
    router.push("/panier")
  }

  useEffect(() => {
    fetchPanier()
    takeUser()
  }, [])

  const handleConfirm = async () => {
    const token = Cookies.get("token")

    let currentUser = user
    if (!currentUser || currentUser.pk == null) {
      currentUser = await takeUser()
      if (!currentUser || currentUser.pk == null) {
        alert("Impossible de récupérer l’utilisateur. Rechargez la page.")
        return
      }
    }

    try {
      const orderPayload = {
        user: currentUser.pk,
        total_price: total,
        payment_method: "cash",
      }

      const orderRes = await fetch("https://yatteshop.pythonanywhere.com/api/shop/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(orderPayload),
      })

      if (!orderRes.ok) {
        const errorData = await orderRes.json()
        console.error("Erreur 400 création Order :", errorData)
        alert(`Erreur création commande : ${JSON.stringify(errorData)}`)
        return
      }

      const newOrder = await orderRes.json()
      const newOrderId = newOrder.id

      for (let item of panier) {
        const oiPayload = {
          order: newOrderId,
          product: item.id,
          quantity: item.quantiter,
          price: item.price,
        }

        const oiRes = await fetch(
          "https://yatteshop.pythonanywhere.com/api/shop/order-items/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(oiPayload),
          }
        )

        if (!oiRes.ok) {
          const err = await oiRes.json()
          console.error(`Erreur création OrderItem pour produit ${item.id} :`, err)
          alert("Erreur lors de la création d’une ligne de commande.")
          return
        }
      }

      for (let item of panier) {
        if (item.cartItemId) {
          const deleteRes = await fetch(
            `https://yatteshop.pythonanywhere.com/api/shop/cart-items/${item.cartItemId}/`,
            {
              method: "DELETE",
              headers: { Authorization: `Token ${token}` },
            }
          )
          if (deleteRes.status !== 204) {
            console.warn(
              `Impossible de supprimer CartItem id=${item.cartItemId}`,
              await deleteRes.text()
            )
          }
        }
      }

      clearCart()
      toast.info("Félicitations, votre commande a été passée avec succès")
      router.push("/client")
    } catch (error) {
      console.error("Erreur réseau ou inattendue :", error)
      alert("Problème de connexion au serveur.")
    }
  }

  // ✅ REDIRECTION si panier vide
  useEffect(() => {
    if (panier.length === 0) {
      router.replace("/client")
    }
  }, [panier])

  // 💡 Affichage conditionnel (évite le clignotement)
  if (panier.length === 0) return null

  return (
    <div className="Order">
      <div className="OrderHeader">
        <MoveLeft className="MoveLeft" onClick={gocart} />
        <p>Passer votre commande</p>
      </div>
      <div className="OrderBody">
        <p className="resOrder">Résumé de la commande</p>
        <div className="corpsOrder">
          {panier.map((item) => (
            <div key={item.id} className="wrapperOrders">
              <div className="OrderQty">
                <p>Total articles ({item.quantiter})</p>
                <p>{lepoint(item.quantiter * item.price)} FCFA</p>
              </div>
              <div className="delivery">
                <p>Frais de Livraison</p>
                <p>{lepoint(item.prix_livraison)} FCFA</p>
              </div>
            </div>
          ))}
          <div className="orderTotal">
            <p>Total</p>
            <p><strong>{lepoint(total)} FCFA</strong></p>
          </div>
        </div>
      </div>
      <div className="payment">
        <div className="payMod">Mode de paiement</div>
        <div className="payOrder">
          <div className="Orderdeliv">
            <div className="lovOrder">
              <HandCoins className="HandCoins" />
              <p>Payer cash à la Livraison</p>
            </div>
            <p className="Orderdelivap">
              Réglez vos achats en espèces directement à la livraison
            </p>
          </div>
        </div>
      </div>
      <div className="detailOrder">
        <div className="livrDetail">Détails de livraison</div>
        <div className="domicile">
          <div className="domiKais">
            <Truck className="Truck" />
            <p>Livraison à domicile</p>
          </div>
          <p>Livraison prévue le {datelivraison()}</p>
        </div>
      </div>
      <div className="resOrder">Articles à livrer</div>
      <div className="OrderArticle">
        {panier.map((item) => (
          <div className="OrderArticlA" key={item.id}>
            <img src={item.image} alt={item.name} />
            <p>{tronquerSansCouperMot(item.description)}</p>
          </div>
        ))}
      </div>
      <div className="expedition">
        <p>Expédition ({panier.length}/{panier.length})</p>
        <p>Expédié par YATTE</p>
      </div>
      <div className="subtotalCart" style={{ marginBottom: "20px" }}>
        <Check className="Check" style={{ marginRight: "3px" }} />
        <p> Expédition rapide et sécurisée – service client dédié à chaque commande</p>
      </div>
      <div className="ConfirmCenter">
        <div className="OrderConfirm" onClick={handleConfirm}>
          Confirmer la commande
        </div>
      </div>
    </div>
  )
}
