"use client";

import Cookies from "js-cookie";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../contextes/CartContext";
import { useAuth } from "../../contextes/AuthContext";
import Notif from "../../composants/Notif";
import styles from "./Produit.module.css";

function formatAmountWithSeparators(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Produit({ name, price, image, id, logo, pribarrer, description, prix_livraison }) {
  const [notifications, setNotifications] = useState([]);
  const { dispatch } = useCart();
  const { autentifier } = useAuth();
  const router = useRouter();

  const ajouterNotification = () => {
    const newNotif = {
      id: Date.now(),
      message: "✓ un article a été ajouté au panier"
    };
    setNotifications(prev => [...prev, newNotif]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 4000);
  };

  const handleBuy = async () => {
    const item = { id, name, price, image, logo, pribarrer, description, prix_livraison };
    dispatch({ type: "ADD", payload: item });

    if (!autentifier) {
      // Gestion panier invité via cookies
      let panierLocal = [];

      try {
        const cookie = Cookies.get("guest_cart");
        panierLocal = cookie ? JSON.parse(cookie) : [];
      } catch {
        panierLocal = [];
      }

      const exist = panierLocal.find(p => p.id === item.id);
      if (exist) {
        panierLocal = panierLocal.map(p =>
          p.id === item.id ? { ...p, quantiter: p.quantiter + 1 } : p
        );
      } else {
        panierLocal.push({ ...item, quantiter: 1 });
      }

      Cookies.set("guest_cart", JSON.stringify(panierLocal), { expires: 7 });
      ajouterNotification();
      return;
    }

    // Utilisateur connecté → requête API backend
    const token = Cookies.get("token");

    if (!token) {
      console.warn("Token manquant alors que l'utilisateur est connecté.");
      return;
    }

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
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("Erreur API panier :", errorData);
        } else {
          const html = await response.text();
          console.error("Erreur HTML API :", html);
        }
        return;
      }

      ajouterNotification();

    } catch (error) {
      console.error("Erreur réseau panier :", error.message);
    }
  };

  return (
    <div className={styles.BuyWrapper}>
      <div className={styles.Buybtn} onClick={handleBuy}>
        Acheter
      </div>

      <div className={styles.BuyCard} onClick={() => router.push(`/${id}`)}>
        <div className={styles.BuySecond}>
          <img src={image} alt={name} className={styles.BuyImg} />
          <p className={styles.Bescription}>{description}</p>
          <p className={styles.BuyPrice}>{formatAmountWithSeparators(price)} FCFA</p>
          <p className={styles.pribarrer}>{formatAmountWithSeparators(pribarrer)} FCFA</p>
          <div className={styles.Buyfirst}>
            <img src={logo} alt={name} className={styles.BuyLogo} />
            <p>{Math.floor((price - pribarrer) / pribarrer * 100)}%</p>
          </div>
        </div>
      </div>

      <div className={styles.notif_col}>
        {notifications.map((notif) => (
          <Notif key={notif.id} message={notif.message} />
        ))}
      </div>
    </div>
  );
}
