const producstDom=document.querySelector(".products-center")
const cartItems=document.querySelector(".cart-items")
const cartPrice=document.querySelector(".cart-total")
const cartContent = document.querySelector('.cart-content')
const cartDOM = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay')
const cartBtn = document.querySelector('.cart-btn')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')

let cart=[]


class Propduct{
   async getproducts(){
    try{const result= await  fetch("product.json")
    const data=await result.json()
    let products=data.items
    products=products.map((item)=>{
       const{title,price}=item.fields
       const{id}=item.sys
       const image =item.fields.image.fields.file.url
       return {title,price,id,image}
    })
    return products
      }
      catch(err){
        console.log(err)
      }


     


    }
}

class View{
    displayProducts(products){
        let result=""
        products.forEach((item)=>{
            result+=` <article class="product">
        <div class="img-container">
            <img 
            src=${item.image}
            alt=${item.title}
            class="product-img"
            />
          <button class="bag-btn" data-id=${item.id}>افزودن به سبد خرید</button>

        </div>
        <h3>${item.title}</h3>
        <h4>${item.price}تومان</h4>

     </article>
        `
            
        })
        producstDom.innerHTML=result

    }
    getCartButtons(){
       const buttons=[...document.querySelectorAll(".bag-btn")]
       buttons.forEach((item)=>{
        let id=item.dataset.id

        item.addEventListener("click",(e)=>{
            let cartproduct={...Storage.getproduct(id),amount:1}
            cart=[...cart,cartproduct]
           
           Storage.saveCart(cart)
           this.setCartvalue(cart)
           this.addCartItem(cartproduct)
           this.showCart()
           



        })
       })




    }
    addCartItem(item){
        const div = document.createElement('div')
    div.classList.add('cart-item')

    div.innerHTML = `
    <img src=${item.image} alt=${item.title} />
    <div>
      <h4>${item.title}</h4>
      <h5>${item.price}</h5>
      <span class="remove-item" data-id=${item.id}>حذف</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id=${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down" data-id=${item.id}></i>
    </div>
    `
    cartContent.appendChild(div)
  

    }
  
    initApp(){
        cart=Storage.getCart()
        this.setCartvalue(cart)
        this.populate(cart)
        cartBtn.addEventListener("click",this.showCart)
        closeCartBtn.addEventListener("click",this.hideCart)


    }
    setCartvalue(cart){
        let totalPrice=0
        let totalItem=0
        cart.map((item)=>{
            totalPrice=totalPrice+item.price*item.amount
            totalItem=totalItem+item.amount
        })

        cartItems.innerText=totalItem
        cartPrice.innerText=totalPrice



    }
    cartProcces(){
        clearCartBtn.addEventListener("click",()=>{
            this.clearCart()
        })
        cartContent.addEventListener("click",(e)=>{
            if(e.target.classList.contains("remove-item")){
                let cartItem=e.target
                let id=cartItem.dataset.id
                cartContent.removeChild(cartItem.parentElement.parentElement)
                this.removeCart(id)
            }
            if(e.target.classList.contains("fa-chevron-up")){
                let addAmount=e.target
                let id=addAmount.dataset.id
                let m=cart.find((item)=>{
                       return item.id===id
                   })
                   m.amount=m.amount+1
                   Storage.saveCart(cart)
                   this.setCartvalue(cart)
                   addAmount.nextElementSibling.innerText=m.amount
                   
       
                }
                if(e.target.classList.contains("fa-chevron-down")){
                    let lowerAmount=e.target
                    let id=lowerAmount.dataset.id
                    let m=cart.find((item)=>{
                           return item.id===id
                       })
                       m.amount=m.amount-1
                       if(m.amount>0){
                        Storage.saveCart(cart)
                        this.setCartvalue(cart)
                        lowerAmount.previousElementSibling.innerText=m.amount
                       }
                       else{
                        cartContent.removeChild(lowerAmount.parentElement.parentElement)
                        this.removeCart(id)
                       }
                      
                       
           
                    }


        })
        
        
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg')
        cartDOM.classList.add('showCart')

    }
    populate(cart) {
        cart.forEach((item) => {
          return this.addCartItem(item)
        })
    }
      hideCart() {
        cartOverlay.classList.remove('transparentBcg')
        cartDOM.classList.remove('showCart')
      }
      clearCart(){
        let cartItems=cart.map((item)=>{
            return item.id
        })
        cartItems.forEach((item)=>{
          return  this.removeCart(item)

        })
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0])
        }
       
        }
     
      removeCart(id){
       cart= cart.filter((item)=>{
            return item.id!==id

        })
        this.setCartvalue(cart)
        Storage.saveCart(cart)


      }


}


class Storage{

    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products))

    }
    static getproduct(id){
        const products=JSON.parse(localStorage.getItem("products"))
       let product= products.find((item)=>{
            return item.id===id
        })
        return product
    }
    static saveCart(product){
        localStorage.setItem("cart",JSON.stringify(product))
    }
    static getCart(){
        let cart=JSON.parse(localStorage.getItem("cart"))
        if(cart.lenght!=0){
            return cart
        }
        else{
            return[]
        }
    }



}


document.addEventListener("DOMContentLoaded",()=>{
    const products=new Propduct
    const view=new View
    view.initApp()
  
   
    products.getproducts().then((data)=>{
        view.displayProducts(data)
        Storage.saveProducts(data)
    }).then(()=>{
        view.getCartButtons()
        view.cartProcces()
     
        
    })
   
})