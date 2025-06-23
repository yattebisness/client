import "./Connexion.css";
import { useModal } from "../contextes/ModalContext";
import { useAuth } from "../contextes/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCart } from "../contextes/CartContext"

export default function Connexion({ changeModal, setChangeModal }) {
  
  
  const { fetchPanier, mergeGuestCartWithBackend } = useCart()
  
  const { showModal, setShowModal } = useModal();
  const { setAutentifier } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState(null);
  const [ loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault();
    
    setLoading(true)
    
    try {
      const response = await fetch("https://yatteshop.pythonanywhere.com/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      

      if (!response.ok) {
 
         throw new Error("Identifiants incorrects");
      }
      
      const data = await response.json();
      const token = data.key; 

      
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7};`; 


      
      setAutentifier(true);
      await mergeGuestCartWithBackend()
      toast.info("Vous êtes connecté !");
      setLoading(false)
      setShowModal(false);
    } catch (error) {
      setErreur(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="Connexion">
      <div className="ConnexHeader">
        <p>Connexion</p>
        <div className="close" onClick={() => setShowModal(!showModal)}>x</div>
      </div>
      {loading && <p style={{
    fontSize:"0.75rem",
    marginBottom: "8px",
  }}>Veuillez patienter, chargement en cours…</p>}
<div className="connexBody">
 <form onSubmit={handleLogin}>
 <input
 type="text"
 placeholder="Nom utilisateur"
 value={username}
 onChange={(e) => setUsername(e.target.value)}
  required />
 <input
 type="password"
 placeholder="Mot de passe"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
  required />
 <button type="submit">se connecter</button>
</form>
 {erreur && <p style={{ color: "red" }}>{erreur}</p>}
 </div>
<div className="connexFooter">
 <p>pas encore inscrit ?</p>
<button onClick={() => setChangeModal(!changeModal)}>s'inscrire</button>
 </div>
</div>
 );
}
