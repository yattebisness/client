"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  ShoppingBasket,
  ShoppingCart,
  User,
  Search,
  BookOpen,
  MoveLeft,
  AlignJustify,
  Plus,
  Trash2,
  Minus,
  Phone,
  Check,
} from "lucide-react";

import Burger from "../../composants/Burger";
import Modal from "../../composants/Modal";
import OrderModal from "../../composants/OrderModal";

import { useCart } from "../../contextes/CartContext";
import { useAuth } from "../../contextes/AuthContext";
import { useModal } from "../../contextes/ModalContext";
import { useOrderModal } from "../../contextes/OrderModalContext";
import { useCategoryStore } from "../../stores/Store";
import { Donnees } from "../../fetching/Donnees";
import { Data } from "../../fetching/Data";

import { useRouter } from "next/navigation";

import "./Cart.css";



// Helpers
function lepoint(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function tronquerSansCouperMot(texte, maxLongueur = 25) {
  if (texte.length <= maxLongueur) return texte;
  const mots = texte.split(" ");
  let resultat = "";
  for (let mot of mots) {
    if ((resultat + " " + mot).trim().length > maxLongueur) break;
    resultat += (resultat ? " " : "") + mot;
  }
  return resultat.trim();
}

export default function Panier() {
  const [mounted, setMounted] = useState(false);
  const [cat, setCat] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const router = useRouter();
  const { panier, handlePlus, handleMoins, removeItem, fetchPanier } = useCart();
  const { showModal, setShowModal } = useModal();
  const { showOrderModal, setShowOrderModal } = useOrderModal();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const { autentifier } = useAuth();

  const token = Cookies.get("token");
  const somme = panier.reduce((som, item) => som + item.price * item.quantiter, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      const data = await Data();
      setCat(data);
    };
    if (mounted) fetchdata();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const fetchSuggestions = async () => {
      try {
        const produits = await Donnees();
        const panierIds = panier.map((item) => item.id);
        const produitsDisponibles = produits.filter((p) => !panierIds.includes(p.id));
        const melanges = produitsDisponibles.sort(() => 0.5 - Math.random());
        setSuggestions(melanges.slice(0, 12));
      } catch (e) {
        console.error("Erreur chargement suggestions :", e);
      }
    };

    fetchSuggestions();
  }, [mounted, panier]);

  useEffect(() => {
    if (mounted) fetchPanier();
  }, [mounted]);

  const displayMenu = () => {
    setShowMenu(!showMenu);
  };

  const choixCategorie = (nom) => {
    setSelectedCategory(nom);
    router.push("/produits");
  };

  const order = () => {
    if (token) {
      router.push("/commande");
    } else {
      setShowOrderModal(true);
    }
  };

  const handleUser = () => {
    if (token) {
      router.push("/client");
    } else {
      setShowModal(true);
    }
  };

  const detailDirect = (id) => {
    router.push(`/${id}`);
  };

  return (
    mounted && (
      <div>
        <div className="cartWrapp">
          <div className="detailMenuC">
            <div className="DetailTitleC">
              <Burger displayMenu={displayMenu} />
              <p onClick={() => router.push("/")}>YATTE</p>
              <div className="BasketC">
                <ShoppingBasket style={{ width: "20px", height: "20px", color: "white" }} />
              </div>
            </div>
            <div className="DetailRightTitleC">
              <div className="DetailSearch Cartperso">
                <Search className="SearchCart" />
              </div>
              <div className="user">
                <User onClick={handleUser} />
              </div>
              <div className="cartC">
                <ShoppingCart />
                <p className={panier.length > 0 ? "cartPC" : ""}>
                  {panier.length > 0 ? panier.length : ""}
                </p>
              </div>
              <div className={showMenu ? "catcartshow" : "catcarthide"}>
              <div>
                <div className="MenuVisibleTitleC MenuVisibleTitle" onClick={() => setSelectedCategory(null)}>
                  Nos Catégories
                </div>
                <div className="visiblewcat">
                  {cat.map((item) => (
                    <div key={item.id} className="itemvisibleC itemvisible" onClick={() => choixCategorie(item)}>
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </div>
          </div>

          <div className="Cart">
            <p className="CartTitlea">Résumé du panier</p>
            <div className="totalCart">
              <p>Montant total</p>
              <p className="Cartprix">
                <strong>{lepoint(somme)}</strong> FCFA
              </p>
            </div>
            <div className="subtotalCart">
              <Check className="Check" style={{ marginRight: "3px" }} />
              <p>
                Expédition rapide et sécurisée – service client dédié à chaque commande
              </p>
            </div>
            <div className="CartBody">
              <p className="CartTitlea">panier ({panier.length})</p>
              {panier.length > 0 ? (
                <div>
                  {panier.map((item) => (
                    <div key={item.id} className="WrapTenu">
                      <div className="CARTIMG">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="CartDes">
                        <div>
                          <p>{item.description.split(" ").slice(0, 16).join(" ")}</p>
                        </div>
                        <div className="CartCount">
                          <div className="wraTrash" onClick={() => removeItem(item.id)}>
                            <Trash2 className="Trash" />
                            <span
                              style={{
                                fontSize: "0.82rem",
                                color: "rgb(255,100,0)",
                                fontFamily: "Times New Roman",
                              }}
                            >
                              Supprimer
                            </span>
                          </div>
                          <div className="countSite">
                            <Plus className="Plus" onClick={() => handlePlus(item.id)} />
                            {item.quantiter}
                            <Minus className="Minus" onClick={() => handleMoins(item.id)} />
                          </div>
                        </div>
                        <div style={{ fontSize: "0.92rem" }}>
                          <strong>{lepoint(item.quantiter * item.price)}</strong> FCFA
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <img src="anew.png" alt="anew" />
                  <p>votre panier est vide</p>
                </div>
              )}
            </div>
          </div>

          <div className="CartOrder">
            {panier.length > 0 ? (
              <div className="wrapperCartOrder">
                <Phone className="CartPhone" />
                <div className="btnCartOrder" onClick={order}>
                  Commander ({lepoint(somme)} FCFA)
                </div>
              </div>
            ) : (
              <div className="shopsuite">
                <p onClick={() => router.push("/produits")}>continuer votre shopping</p>
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="suggestions-section">
              <p className="CartTitlea" style={{ color: "#0d0d82" }}>
                Vous aimerez aussi :
              </p>
              <div className="suggestions-list">
                {suggestions.map((prod) => (
                  <div key={prod.id} className="suggestion-item">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{ maxWidth: "128px", maxHeight: "128px" }}
                      onClick={() => detailDirect(prod.id)}
                    />
                    <p>{tronquerSansCouperMot(prod.description)}</p>
                    <p>{lepoint(prod.price)} FCFA</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showModal && <Modal />}
        {showOrderModal && <OrderModal />}
      </div>
    )
  );
}




