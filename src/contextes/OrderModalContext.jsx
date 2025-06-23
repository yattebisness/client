"use client";

import {createContext, useContext, useState, useEffect} from  "react"


const orderModalContext = createContext()


export const useOrderModal = ()=> useContext(orderModalContext)


export const OrderModalProvider = ({children})=>{
  
  const [showOrderModal, setShowOrderModal] = useState(false)

  
  return(
    <orderModalContext.Provider value={{showOrderModal, setShowOrderModal}}>
      {children}
    </orderModalContext.Provider>
  )
}