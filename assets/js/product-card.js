/* ===========================================================
    SoleAI
    Product Card

    File : product-card.js
    Version : 1.0
=========================================================== */

"use strict";

/* ===========================================================
                DOM READY
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeProductCards();

});


/* ===========================================================
                INITIALIZE
=========================================================== */

function initializeProductCards(){

    initializeWishlist();

    initializeCart();

    initializeCompare();

    initializeQuickView();

    initializeHoverAnimation();

}


/* ===========================================================
                WISHLIST
=========================================================== */

function initializeWishlist(){

    const buttons=document.querySelectorAll(".wishlist-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            button.classList.toggle("active");

            gsap.fromTo(

                button,

                {

                    scale:1

                },

                {

                    scale:1.25,

                    duration:.25,

                    repeat:1,

                    yoyo:true

                }

            );

            showToast("Added to Wishlist ❤️");

        });

    });

}


/* ===========================================================
                ADD TO CART
=========================================================== */

function initializeCart(){

    const buttons=document.querySelectorAll(".cart-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            gsap.fromTo(

                button,

                {

                    scale:1

                },

                {

                    scale:1.05,

                    duration:.3,

                    repeat:1,

                    yoyo:true

                }

            );

            showToast("Added to Cart 🛒");

        });

    });

}


/* ===========================================================
                COMPARE
=========================================================== */

function initializeCompare(){

    const buttons=document.querySelectorAll(".compare-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            showToast("Added for Comparison");

        });

    });

}


/* ===========================================================
                QUICK VIEW
=========================================================== */

function initializeQuickView(){

    const buttons=document.querySelectorAll(".quick-view-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            showToast("Opening Product...");

            // Future:
            // Open Quick View Modal

        });

    });

}


/* ===========================================================
                HOVER ANIMATION
=========================================================== */

function initializeHoverAnimation(){

    document.querySelectorAll(".product-card").forEach(card=>{

        card.addEventListener("mouseenter",()=>{

            gsap.to(card,{

                y:-12,

                duration:.3

            });

        });

        card.addEventListener("mouseleave",()=>{

            gsap.to(card,{

                y:0,

                duration:.3

            });

        });

    });

}


/* ===========================================================
                END OF FILE
=========================================================== */