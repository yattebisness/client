"use client";

import {createContext, useContext, useState, useEffect} from  "react"

const modalContext = createContext()

export const useModal = ()=> useContext(modalContext)

export const ModalProvider = ({children})=>{
  
  const [showModal, setShowModal] = useState(false)

  
  return(
    <modalContext.Provider value={{showModal, setShowModal}}>
      {children}
    </modalContext.Provider>
  )
}