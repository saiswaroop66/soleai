/* ===========================================================
    SoleAI
    Wishlist Page

    File : wishlist.js
    Version : 1.0
=========================================================== */

"use strict";

/* ===========================================================
                DOM READY
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeWishlistPage();

});


/* ===========================================================
                INITIALIZE
=========================================================== */

function initializeWishlistPage(){

    loadWishlist();

    updateWishlistSummary();

    initializeWishlistActions();

    initializePriceAlerts();

}


/* ===========================================================
                LOAD WISHLIST
=========================================================== */

function loadWishlist(){

    const wishlist = JSON.parse(

        localStorage.getItem("soleai_wishlist")

    ) || [];

    console.log(

        "Wishlist Loaded:",

        wishlist

    );

}


/* ===========================================================
                UPDATE SUMMARY
=========================================================== */

function updateWishlistSummary(){

    const wishlist = JSON.parse(

        localStorage.getItem("soleai_wishlist")

    ) || [];

    const totalItems = wishlist.length;

    let totalPrice = 0;

    wishlist.forEach(product => {

        totalPrice += product.price || 0;

    });

    const cards = document.querySelectorAll(".summary-card h3");

    if(cards.length >= 2){

        cards[0].textContent = totalItems;

        cards[1].textContent =

            "₹" + totalPrice.toLocaleString();

    }

}


/* ===========================================================
                MOVE TO CART
=========================================================== */

function moveAllToCart(){

    const button = document.querySelector(

        ".btn.btn-primary"

    );

    if(!button) return;

    button.addEventListener("click",()=>{

        const wishlist = JSON.parse(

            localStorage.getItem("soleai_wishlist")

        ) || [];

        const cart = JSON.parse(

            localStorage.getItem("soleai_cart")

        ) || [];

        cart.push(...wishlist);

        localStorage.setItem(

            "soleai_cart",

            JSON.stringify(cart)

        );

        localStorage.removeItem(

            "soleai_wishlist"

        );

        showToast(

            "All products moved to cart 🛒"

        );

        location.reload();

    });

}


/* ===========================================================
                INITIALIZE ACTIONS
=========================================================== */

function initializeWishlistActions(){

    moveAllToCart();

}


/* ===========================================================
                END OF PART 1
=========================================================== */
/* ===========================================================
                REMOVE PRODUCT
=========================================================== */

function removeFromWishlist(productId){

    let wishlist = JSON.parse(

        localStorage.getItem("soleai_wishlist")

    ) || [];

    wishlist = wishlist.filter(product=>{

        return product.id !== productId;

    });

    localStorage.setItem(

        "soleai_wishlist",

        JSON.stringify(wishlist)

    );

    showToast(

        "Product removed from Wishlist ❤️"

    );

    updateWishlistSummary();

}


/* ===========================================================
                REMOVE BUTTONS
=========================================================== */

function initializeRemoveButtons(){

    document.querySelectorAll(

        ".remove-wishlist"

    ).forEach(button=>{

        button.addEventListener("click",()=>{

            const id = Number(

                button.dataset.id

            );

            removeFromWishlist(id);

        });

    });

}


/* ===========================================================
                COMPARE PRODUCTS
=========================================================== */

function initializeCompare(){

    const button=document.querySelector(

        ".btn.btn-secondary"

    );

    if(!button) return;

    button.addEventListener("click",()=>{

        showToast(

            "Opening Compare Page..."

        );

        setTimeout(()=>{

            window.location.href="compare.html";

        },1000);

    });

}


/* ===========================================================
                CLEAR WISHLIST
=========================================================== */

function initializeClearWishlist(){

    const button=document.querySelector(

        ".btn.btn-outline"

    );

    if(!button) return;

    button.addEventListener("click",()=>{

        const confirmed=confirm(

            "Clear entire wishlist?"

        );

        if(!confirmed) return;

        localStorage.removeItem(

            "soleai_wishlist"

        );

        updateWishlistSummary();

        showToast(

            "Wishlist Cleared"

        );

        location.reload();

    });

}


/* ===========================================================
                AI PRICE ALERTS
=========================================================== */

function initializePriceAlerts(){

    console.log(

        "Checking AI price predictions..."

    );

    setTimeout(()=>{

        showToast(

            "🤖 AI predicts 4 products may become cheaper soon."

        );

    },2000);

}


/* ===========================================================
                SAVE WISHLIST
=========================================================== */

function saveWishlist(wishlist){

    localStorage.setItem(

        "soleai_wishlist",

        JSON.stringify(wishlist)

    );

}


/* ===========================================================
                INITIALIZE
=========================================================== */

initializeRemoveButtons();

initializeCompare();

initializeClearWishlist();


/* ===========================================================
                END OF PART 2
=========================================================== */
/* ===========================================================
                RENDER WISHLIST
=========================================================== */

function renderWishlist(){

    const container=document.querySelector(

        ".wishlist-products .products-grid"

    );

    if(!container) return;

    const wishlist=JSON.parse(

        localStorage.getItem("soleai_wishlist")

    ) || [];

    container.innerHTML="";

    if(wishlist.length===0){

        showEmptyWishlist();

        return;

    }

    wishlist.forEach(product=>{

        container.innerHTML+=`

        <div class="product-card">

            <img src="${product.image}"

                alt="${product.name}">

            <h3>

                ${product.name}

            </h3>

            <p>

                ₹${product.price}

            </p>

            <div class="wishlist-card-actions">

                <button
                    class="btn btn-primary add-cart"
                    data-id="${product.id}">

                    Add To Cart

                </button>

                <button
                    class="btn btn-danger remove-wishlist"
                    data-id="${product.id}">

                    Remove

                </button>

            </div>

        </div>

        `;

    });

}


/* ===========================================================
                EMPTY STATE
=========================================================== */

function showEmptyWishlist(){

    const container=document.querySelector(

        ".wishlist-products .products-grid"

    );

    if(!container) return;

    container.innerHTML=`

    <div class="empty-state">

        <i class="bi bi-heart"></i>

        <h2>

            Your Wishlist is Empty

        </h2>

        <p>

            Start exploring premium footwear
            and save your favorites.

        </p>

        <a
            href="shop.html"
            class="btn btn-primary">

            Explore Shoes

        </a>

    </div>

    `;

}


/* ===========================================================
                RECENTLY VIEWED
=========================================================== */

function loadRecentlyViewed(){

    const products=JSON.parse(

        localStorage.getItem(

            "recent_products"

        )

    ) || [];

    console.log(

        "Recently Viewed:",

        products

    );

}


/* ===========================================================
                AI RECOMMENDATIONS
=========================================================== */

function loadAIRecommendations(){

    console.log(

        "Loading AI Recommendations..."

    );

    // Future:
    // Fetch from backend API

}


/* ===========================================================
                PRODUCT CARD EVENTS
=========================================================== */

function initializeProductCards(){

    document.addEventListener(

        "click",

        event=>{

            if(

                event.target.classList.contains(

                    "add-cart"

                )

            ){

                const id=Number(

                    event.target.dataset.id

                );

                console.log(

                    "Add To Cart:",

                    id

                );

                showToast(

                    "Added to Cart 🛒"

                );

            }

        }

    );

}


/* ===========================================================
                INITIALIZE
=========================================================== */

renderWishlist();

loadRecentlyViewed();

loadAIRecommendations();

initializeProductCards();


/* ===========================================================
                END OF PART 3
=========================================================== */
/* ===========================================================
                GSAP ANIMATIONS
=========================================================== */

function initializeAnimations(){

    if(typeof gsap==="undefined") return;

    gsap.from(".wishlist-hero-content",{

        y:80,

        opacity:0,

        duration:1

    });

    gsap.from(".summary-card",{

        y:50,

        opacity:0,

        stagger:.15,

        duration:.8

    });

    gsap.from(".ai-card",{

        y:60,

        opacity:0,

        stagger:.15,

        duration:.8,

        scrollTrigger:{

            trigger:".ai-wishlist",

            start:"top 75%"

        }

    });

    gsap.from(".product-card",{

        y:70,

        opacity:0,

        stagger:.1,

        duration:.8,

        scrollTrigger:{

            trigger:".wishlist-products",

            start:"top 80%"

        }

    });

}


/* ===========================================================
                LIVE COUNTER
=========================================================== */

function updateCounter(){

    const wishlist=JSON.parse(

        localStorage.getItem("soleai_wishlist")

    ) || [];

    const counter=document.querySelector(

        ".wishlist-counter"

    );

    if(counter){

        counter.textContent=wishlist.length;

    }

}


/* ===========================================================
                STORAGE SYNC
=========================================================== */

window.addEventListener("storage",()=>{

    renderWishlist();

    updateWishlistSummary();

    updateCounter();

});


/* ===========================================================
                TOAST
=========================================================== */

function notify(message){

    if(typeof showToast==="function"){

        showToast(message);

    }else{

        console.log(message);

    }

}


/* ===========================================================
                PERFORMANCE
=========================================================== */

window.addEventListener("load",()=>{

    console.log(

        "Wishlist Loaded Successfully"

    );

});


/* ===========================================================
                CLEANUP
=========================================================== */

window.addEventListener("beforeunload",()=>{

    console.log(

        "Cleaning Wishlist..."

    );

});


/* ===========================================================
                INITIALIZE
=========================================================== */

initializeAnimations();

updateCounter();


/* ===========================================================
                END OF FILE
=========================================================== */

/*

███████╗ ██████╗ ██╗     ███████╗ █████╗ ██╗
██╔════╝██╔═══██╗██║     ██╔════╝██╔══██╗██║
███████╗██║   ██║██║     █████╗  ███████║██║
╚════██║██║   ██║██║     ██╔══╝  ██╔══██║██║
███████║╚██████╔╝███████╗███████╗██║  ██║██║
╚══════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝

SoleAI
Wishlist JavaScript
Version : 1.0

*/