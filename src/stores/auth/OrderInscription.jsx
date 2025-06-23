import { toast } from "react-toastify";
import "./Inscription.css";
import { useState, useEffect } from "react";
import { useOrderModal } from "../contextes/OrderModalContext"
import { useAuth } from "../contextes/AuthContext";
import { useCart } from "../contextes/CartContext"
import { useNavigate } from "react-router"

export default function OrderInscription({ changeModal, setChangeModal }) {
  
  
  const { fetchPanier, mergeGuestCartWithBackend } = useCart()
  
  const navigate = useNavigate()
  
  const { setShowOrderModal } = useOrderModal()
  const { setAutentifier } = useAuth();

  const [form, setForm] = useState({
    last_name: "",
    first_name: "",
    username: "",
    email: "",
    phone: "",
    password1: "",
    password2: "",
    ville: "",
    commune: "",
  });

  const [errors, setErrors] = useState(null);
  const [loader,setLoader] = useState(false)

  const villes = [
    { code: "ABJ", label: "Abidjan" },
    { code: "BKE", label: "Bouaké" },
    { code: "DAL", label: "Daloa" },
    { code: "YAM", label: "Yamoussoukro" },
    { code: "SPE", label: "San Pedro" },
    { code: "AUT", label: "Autre ville" },
  ];

  const communesAbidjan = [
    { code: "YOP", label: "Yopougon" },
    { code: "ABO", label: "Abobo" },
    { code: "ADJ", label: "Adjamé" },
    { code: "PLA", label: "Plateau" },
    { code: "TRE", label: "Treichville" },
    { code: "MAR", label: "Marcory" },
    { code: "KOU", label: "Koumassi" },
    { code: "PBO", label: "Port-Bouët" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setLoader(true)

    if (form.password1 !== form.password2) {
      setErrors({ password: ["Les mots de passe ne correspondent pas."] });
      return;
    }

    if (form.ville === "ABJ" && !form.commune) {
      setErrors({ commune: ["Veuillez choisir une commune pour Abidjan."] });
      return;
    }

    
    const payload = {
      username: form.username,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      password1: form.password1,
      password2: form.password2,
      ville: form.ville,
      
      commune: form.ville === "ABJ" ? form.commune : "",
    };

    try {
      
      const res = await fetch("https://yatteshop.pythonanywhere.com/api/auth/registration/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.key;
        if (token) {
          document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7};`; 
          setAutentifier(true);
          await mergeGuestCartWithBackend();
          setShowOrderModal(false);
          navigate("/commande")
        } else {
          console.warn("Token manquant dans la réponse.");
        }
      } else {
        setErrors(data);
        toast.error("Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setErrors({ global: ["Une erreur réseau est survenue."] });
    } finally {
      setLoader(false)
    }
  };
  
  
  useEffect(()=>{
    fetchPanier();
  },[])

  return (
    <div className="Connexion">
      <div className="ConnexHeader">
        <p>Inscription</p>
        <div className="close" onClick={() => setShowOrderModal(false)}>x</div>
      </div>
      {loader && <p style={{
    fontSize:"0.75rem",
    marginBottom: "8px",
  }}>Veuillez patienter, chargement en cours…</p>}
      <div className="connexBody">
        <form onSubmit={handleSubmit}>
          <input
            name="last_name"
            type="text"
            placeholder="Nom"
            value={form.last_name}
            onChange={handleChange}
            required
          />
          <input
            name="first_name"
            type="text"
            placeholder="Prénoms"
            value={form.first_name}
            onChange={handleChange}
            required
          />
          <input
            name="username"
            type="text"
            placeholder="Nom d'utilisateur"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            type="text"
            placeholder="Téléphone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <input
            name="password1"
            type="password"
            placeholder="Mot de passe"
            value={form.password1}
            onChange={handleChange}
            required
          />
          <input
            name="password2"
            type="password"
            placeholder="Confirmer le mot de passe"
            value={form.password2}
            onChange={handleChange}
            required
          />

          <select
            name="ville"
            value={form.ville}
            onChange={(e) => {
              handleChange(e);
              setForm((prev) => ({ ...prev, commune: "" })); 
            }}
            required
          >
            <option value="">Votre ville</option>
            {villes.map((v) => (
              <option key={v.code} value={v.code}>
                {v.label}
              </option>
            ))}
          </select>

          {form.ville === "ABJ" && (
            <select
              name="commune"
              value={form.commune}
              onChange={handleChange}
              required
            >
              <option value="">Votre commune</option>
              {communesAbidjan.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          )}

          {errors && (
            <div className="form-errors">
              {Object.entries(errors).map(([field, msgs]) =>
                msgs.map((msg, i) => (
                  <p key={`${field}-${i}`} style={{ color: "red" }}>
                    {field !== "non_field_errors" && field !== "global" ? `${field} : ` : ""}
                    {msg}
                  </p>
                ))
              )}
            </div>
          )}

          <button type="submit">S'inscrire</button>
        </form>
      </div>

      <div className="connexFooter">
        <p>Déjà inscrit ?</p>
        <button onClick={() => setChangeModal(!changeModal)}>Se connecter</button>
      </div>
    </div>
  );
}
