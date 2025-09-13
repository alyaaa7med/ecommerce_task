// var prods;
// var div;

async function getAllProd() {
    let res = await fetch("https://fakestoreapi.com/products");
    let prods = await res.json();

    const container = document.getElementById("productsContainer"); // A container in your HTML

    prods.forEach(prod => {
        //add a counter for the products  , will be used for the cart 
        prod.item_counter =0
        const card = document.createElement("div");
        card.className = "card"
        card.innerHTML = `
            <img src="${prod.image}" class="card-img">
            <div class="card-body">
                <h3 class="card-title">${prod.title}</h3>
                <p class="card-text">${prod.description.slice(0,100)}</p> 
                <p class="card-price"><b>$${prod.price}</b></p>
                <button  class = "success cart-btn">Add To Cart </button>                

            </div>`

        container.appendChild(card); // Append the card to the container

        //create events must here so that it runs after the button exists
        
        const btn = card.querySelector(".cart-btn");
        // btn.addEventListener("click", () => {
        // ---cartPage = window.open("cart.html") //the problem here is But
        //  the page (cart.html) hasn’t necessarily loaded yet.
        //  Accessing cartWindow.document.body too early may be null
        
        btn.addEventListener('click',()=>{
            wait_page_load().then(cartPage => {
                
                if(prod.item_counter == 0){ // the first click => create 
                    prod.item_counter ++;
                    
                    const div = cartPage.document.createElement("div")
                    div.className = "cart-item"
                    div.innerHTML = `
                    <h3>${prod.title}</h3>

                    <div id="${prod.id}" class="details">$${prod.price} *  
                    <button class="operationA"> + </button>                
                    <span class="count">${prod.item_counter}</span> 
                    <button class="operationS"> - </button> 
                    = <span class="total">$${prod.price}</span>
                    </div> 
                    <button  class = "remove">Remove</button>`
                    cartPage.document.body.appendChild(div)
                    
                    const removebtn = div.querySelector(".remove");
                    removebtn.addEventListener("click", () => { //it also works for else once created it fires at any where 
                    div.remove();                  // remove from DOM
                    prod.item_counter = 0;         // reset counter
                    });

                    const addbtn = div.querySelector(".operationA")
                    addbtn.addEventListener("click",()=>{
                    prod.item_counter++
                    change_cart_item_price(prod,prod.id)
                    })

                    const subbtn = div.querySelector(".operationS")
                    subbtn.addEventListener("click",()=>{
                    prod.item_counter--
                    change_cart_item_price(prod,prod.id)
                    })

                }

                else { // update 
                    prod.item_counter++;
                    change_cart_item_price(prod,prod.id) 
                }
            
            })
        })  
    })  
}
var cartPage ;
function wait_page_load(){
            return new Promise((resolve) => {
                if (!cartPage || cartPage.closed) {
                    cartPage = window.open("cart.html")} 
        

            const interval = setInterval(() => {
                if (cartPage!= null && cartPage.document && cartPage.document.body) {
                    clearInterval(interval);  // stop checking
                    resolve(cartPage)
                }
                

            },10)
        })
}

function change_cart_item_price(prod , div_name){ 
    const existingItem = cartPage.document.getElementById(div_name);
    if(existingItem) {
        existingItem.querySelector(".count").textContent = prod.item_counter;
        existingItem.querySelector(".total").textContent = 
            "$" + (prod.price * prod.item_counter).toFixed(2);
    }}

getAllProd();


