"use client"

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  ShoppingBasket,
  ShoppingCart,
  User,
  Search,
  BookOpen,
  MoveLeft,
  AlignJustify
} from "lucide-react";
import Burger from "../../composants/Burger";
import "./Client.css";
import { useCart } from "../../contextes/CartContext";
import { useAuth } from "../../contextes/AuthContext";
import { useRouter } from "next/navigation";

const truncateAfterGarantie = (text) => {
  const keyword = "garantie 12 mois";
  const idx = text.toLowerCase().indexOf(keyword);
  if (idx === -1) return text;
  const endIndex = idx + keyword.length;
  return text.slice(0, endIndex) + "...";
};

const getStatusLabel = (status) => {
  switch (status) {
    case "P":
      return "En cours de livraison";
    case "C":
      return "Livré";
    case "F":
      return "Échoué";
    default:
      return "Inconnu";
  }
};

export default function Client() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [itemsByOrder, setItemsByOrder] = useState({});

  const { dispatch } = useCart();
  const { setAutentifier } = useAuth();

  useEffect(() => {
    const t = Cookies.get("token");
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const userRes = await fetch("https://yatteshop.pythonanywhere.com/api/auth/user/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        const orderRes = await fetch("https://yatteshop.pythonanywhere.com/api/shop/orders/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          setOrders(orderData);
        }

        const itemsRes = await fetch("https://yatteshop.pythonanywhere.com/api/shop/order-items/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setAllItems(itemsData);

          const grouping = {};
          for (const item of itemsData) {
            const oid = item.order;
            if (!grouping[oid]) grouping[oid] = [];
            grouping[oid].push(item);
          }
          setItemsByOrder(grouping);
        }
      } catch (err) {
        console.error("Erreur de récupération :", err);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (token === null) return; // En attente du premier useEffect
    if (!token) {
      router.replace("/produits");
    }
  }, [token, router]);

  const deconnexion = () => {
    Cookies.remove("token");
    Cookies.remove("autentifier");
    setAutentifier(false);
    dispatch({ type: "CLEAR" });
    router.push("/");
  };

  if (token === null) return null; // empêche le rendu côté serveur avant que le token soit lu

  return (
    <div className="ClientOrder">
      <div className="detailMenuT">
        <div className="DetailTitleT">
          <AlignJustify className="AlignJustify" />
          <p onClick={() => router.push("/")} className="titleYATTE">YATTE</p>
          <div className="BasketT">
            <ShoppingBasket style={{ width: 20, height: 20, color: "white" }} />
          </div>
        </div>
        <div className="DetailRightTitleT">
          <div className="DetailSearch cltSearch"><Search /></div>
          <div className="user cltUser"><User /></div>
          <div className="cart cltCart"><ShoppingCart /></div>
        </div>
      </div>

      {user && (
        <div className="idClient">
          Bonjour, <span>{user.last_name}</span>&nbsp;
          <span>{user.first_name}</span><br />
          <p>{user.email}</p>
        </div>
      )}

      <div className="compteYatte">
        <span>votre compte yatte</span>
        <label htmlFor="toggle-orders" className="toggleHistorique">
          Historique
        </label>
      </div>

      <input type="checkbox" id="toggle-orders" hidden />
      <div className="contentCompte2">
        {orders.length === 0 ? (
          <div className="clientWrapper">
            <div className="clientTitle">Vos commandes</div>
            <div className="clientNotif">
              <BookOpen className="BookOpen" />
              <p>vous n'avez pas encore de commande</p>
            </div>
          </div>
        ) : (
          <>
            <div className="clientTitle">Vos commandes</div>
            {orders.map((order) => {
              const itemsForThisOrder = itemsByOrder[order.id] || [];
              return (
                <div key={order.id} className="orderCard">
                  <div className="clientHeader" style={{ fontSize: "0.75rem" }}>
                    <p>Commande n°{order.id}</p>
                    <p>
                      <span>Total :</span> {order.total_price.toLocaleString()} FCFA
                    </p>
                  </div>
                  <OrderItems items={itemsForThisOrder} />
                  <p className="clientLabel">
                    <span>Statut de la commande :</span> {getStatusLabel(order.status)}
                  </p>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="wrapperclientBTN">
        <div className="clientBTN">
          <MoveLeft className="MoveLeftT" onClick={() => router.push("/produits")} />
          <p>continuer votre shopping</p>
        </div>
      </div>

      <div className="btnlogout" onClick={deconnexion}>se deconnecter</div>
    </div>
  );
}

function OrderItems({ items }) {
  return (
    <div className="itemsList">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="itemCard"
          style={{
            borderBottom: index !== items.length - 1 ? "1px solid #e0e0e0" : "none",
            paddingBottom: "10px",
            marginBottom: "10px",
          }}
        >
          {item.image ? (
            <img src={item.image} alt={item.description || item.name} />
          ) : (
            <div className="placeholder-img">Pas d’image</div>
          )}

          <div className="itemInfo">
            {item.description ? (
              <p>{truncateAfterGarantie(item.description)}</p>
            ) : (
              <p className="no-description">Pas de description disponible</p>
            )}
            <p>Quantité : {item.quantity}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
