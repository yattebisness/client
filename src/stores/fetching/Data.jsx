export const Data = async ()=>{
  const res = await fetch("https://yatteshop.pythonanywhere.com/api/shop/categorie/")
  const response = await res.json()
  
  return response
}


