export const Donnees = async ()=>{
  const res = await fetch("https://yatteshop.pythonanywhere.com/api/shop/produit/")
  const response = await res.json()
  
  return response
}