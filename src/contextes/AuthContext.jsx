"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const authcontext = createContext();
export const useAuth = () => useContext(authcontext);

export const AuthProvider = ({ children }) => {
  
  const [autentifier, setAutentifier] = useState(false);

  useEffect(() => {
  const cookieToken = Cookies.get("token");
  const cookieAuth = Cookies.get("autentifier");

  if (cookieToken && cookieAuth === "true") {
    setAutentifier(true);
  }
}, []);

  useEffect(() => {
    Cookies.set("autentifier", autentifier.toString(), { expires: 7, path: "/" });
  }, [autentifier]);

  return (
    <authcontext.Provider value={{ autentifier, setAutentifier }}>
      {children}
    </authcontext.Provider>
  );
};



