/* ===========================================================
    SoleAI
    Home Page

    File : home.js
    Version : 1.0
=========================================================== */

"use strict";

/* ===========================================================
                DOM READY
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeHome();

});


/* ===========================================================
                INITIALIZE
=========================================================== */

function initializeHome(){

    heroAnimation();

    initializeCounters();

    initializeProductHover();

    initializeCategoryHover();

    initializeNewsletter();

}


/* ===========================================================
                HERO ANIMATION
=========================================================== */

function heroAnimation(){

    if(typeof gsap === "undefined") return;

    gsap.timeline()

    .from(".hero-badge",{

        y:30,

        opacity:0,

        duration:.8

    })

    .from(".hero-content h1",{

        y:40,

        opacity:0

    })

    .from(".hero-content p",{

        y:40,

        opacity:0

    })

    .from(".hero-buttons",{

        y:30,

        opacity:0

    })

    .from(".hero-stats",{

        y:30,

        opacity:0

    })

    .from(".hero-image img",{

        x:100,

        opacity:0,

        duration:1

    });

}


/* ===========================================================
                COUNTERS
=========================================================== */

function initializeCounters(){

    const counters=document.querySelectorAll(".stat h3");

    counters.forEach(counter=>{

        const value=parseInt(counter.innerText);

        const object={number:0};

        gsap.to(object,{

            number:value,

            duration:2,

            ease:"power2.out",

            scrollTrigger:{

                trigger:counter,

                start:"top 90%"

            },

            onUpdate(){

                if(counter.innerText.includes("K")){

                    counter.innerHTML=Math.floor(object.number)+"K+";

                }

                else if(counter.innerText.includes("★")){

                    counter.innerHTML="4.9★";

                }

                else{

                    counter.innerHTML=Math.floor(object.number)+"+";

                }

            }

        });

    });

}


/* ===========================================================
                PRODUCT CARD
=========================================================== */

function initializeProductHover(){

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
                CATEGORY CARD
=========================================================== */

function initializeCategoryHover(){

    document.querySelectorAll(".category-card").forEach(card=>{

        card.addEventListener("mouseenter",()=>{

            gsap.to(card,{

                scale:1.03,

                duration:.3

            });

        });

        card.addEventListener("mouseleave",()=>{

            gsap.to(card,{

                scale:1

            });

        });

    });

}


/* ===========================================================
                NEWSLETTER
=========================================================== */

function initializeNewsletter(){

    const form=document.querySelector(".newsletter form");

    if(!form) return;

    form.addEventListener("submit",(e)=>{

        e.preventDefault();

        const email=form.querySelector("input").value;

        if(email===""){

            showToast(

                "Please enter your email",

                "warning"

            );

            return;

        }

        showToast(

            "Subscribed Successfully!"

        );

        form.reset();

    });

}


/* ===========================================================
                END OF PART 1
=========================================================== */
/* ===========================================================
                FEATURED COLLECTION
=========================================================== */

function initializeCollectionAnimation(){

    gsap.utils.toArray(".collection-card").forEach(card=>{

        gsap.from(card,{

            scrollTrigger:{

                trigger:card,

                start:"top 85%"

            },

            y:80,

            opacity:0,

            duration:.8

        });

    });

}


/* ===========================================================
                BRAND ANIMATION
=========================================================== */

function initializeBrandAnimation(){

    gsap.from(".brand",{

        scrollTrigger:{

            trigger:".brands",

            start:"top 80%"

        },

        opacity:0,

        y:40,

        stagger:.15

    });

}


/* ===========================================================
                AI FEATURES
=========================================================== */

function initializeAICards(){

    gsap.utils.toArray(".ai-card").forEach(card=>{

        gsap.from(card,{

            scrollTrigger:{

                trigger:card,

                start:"top 85%"

            },

            scale:.8,

            opacity:0,

            duration:.8

        });

    });

}


/* ===========================================================
                TESTIMONIALS
=========================================================== */

function initializeTestimonials(){

    gsap.from(".testimonial-card",{

        scrollTrigger:{

            trigger:".testimonials",

            start:"top 80%"

        },

        x:60,

        opacity:0,

        stagger:.2

    });

}


/* ===========================================================
                PRODUCT BUTTONS
=========================================================== */

function initializeProductButtons(){

    document.querySelectorAll(".product-card .btn").forEach(button=>{

        button.addEventListener("click",(e)=>{

            e.preventDefault();

            showToast(

                "Opening Product..."

            );

        });

    });

}


/* ===========================================================
                WISHLIST EFFECT
=========================================================== */

function initializeWishlistAnimation(){

    document.querySelectorAll(".wishlist-btn").forEach(button=>{

        button.addEventListener("click",()=>{

            gsap.fromTo(button,

                {

                    scale:1

                },

                {

                    scale:1.3,

                    duration:.25,

                    repeat:1,

                    yoyo:true

                }

            );

        });

    });

}


/* ===========================================================
                CART EFFECT
=========================================================== */

function initializeCartAnimation(){

    document.querySelectorAll(".cart-btn").forEach(button=>{

        button.addEventListener("click",()=>{

            gsap.fromTo(button,

                {

                    scale:1

                },

                {

                    scale:1.15,

                    duration:.25,

                    repeat:1,

                    yoyo:true

                }

            );

        });

    });

}


/* ===========================================================
                SCROLL PROGRESS
=========================================================== */

function initializeScrollProgress(){

    window.addEventListener("scroll",()=>{

        const scrollTop=window.scrollY;

        const height=

            document.documentElement.scrollHeight-

            window.innerHeight;

        const progress=

            (scrollTop/height)*100;

        document.documentElement.style.setProperty(

            "--scroll-progress",

            progress+"%"

        );

    });

}


/* ===========================================================
                CALL FUNCTIONS
=========================================================== */

initializeCollectionAnimation();

initializeBrandAnimation();

initializeAICards();

initializeTestimonials();

initializeProductButtons();

initializeWishlistAnimation();

initializeCartAnimation();

initializeScrollProgress();


/* ===========================================================
                END OF PART 2
=========================================================== */
