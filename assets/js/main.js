/* ============================================================
   SoleAI
   GLOBAL + HOMEPAGE JAVASCRIPT
============================================================ */

"use strict";


/* ============================================================
   STORAGE
============================================================ */

const SOLEAI_WISHLIST_KEY = "soleai_wishlist";
const SOLEAI_NEWSLETTER_KEY = "soleai_newsletter_email";


/* ============================================================
   HELPERS
============================================================ */

function soleAIFormatPrice(price) {

    return "₹" + Number(price || 0)
        .toLocaleString("en-IN");

}


function soleAIEscapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = String(value ?? "");

    return div.innerHTML;

}


function soleAIShowMessage(message) {

    if (typeof showToast === "function") {

        showToast(message);

        return;

    }

    alert(message);

}


/* ============================================================
   WISHLIST
============================================================ */

function soleAIGetWishlist() {

    try {

        return JSON.parse(
            localStorage.getItem(
                SOLEAI_WISHLIST_KEY
            )
        ) || [];

    } catch (error) {

        return [];

    }

}


function soleAIToggleWishlist(productId) {

    let wishlist =
        soleAIGetWishlist();

    const index =
        wishlist.indexOf(productId);


    if (index === -1) {

        wishlist.push(productId);

        soleAIShowMessage(
            "Added to wishlist ❤️"
        );

    } else {

        wishlist.splice(index, 1);

        soleAIShowMessage(
            "Removed from wishlist"
        );

    }


    localStorage.setItem(
        SOLEAI_WISHLIST_KEY,
        JSON.stringify(wishlist)
    );


    renderHomeProducts();

}


/* ============================================================
   STAR RATING
============================================================ */

function soleAICreateStars(rating) {

    let html = "";

    const value = Number(rating || 0);


    for (let i = 1; i <= 5; i++) {

        if (value >= i) {

            html +=
                '<i class="bi bi-star-fill"></i>';

        } else if (value >= i - 0.5) {

            html +=
                '<i class="bi bi-star-half"></i>';

        } else {

            html +=
                '<i class="bi bi-star"></i>';

        }

    }


    return html;

}


/* ============================================================
   PRODUCT DATA SAFETY
============================================================ */

function soleAIGetProducts() {

    if (
        typeof products === "undefined" ||
        !Array.isArray(products)
    ) {

        console.error(
            "SoleAI: product-data.js was not loaded."
        );

        return [];

    }


    return products;

}


/* ============================================================
   PRODUCT SORTING
============================================================ */

function soleAIGetNewArrivals() {

    const allProducts =
        soleAIGetProducts();


    return [...allProducts]

        .sort((a, b) => {

            if (a.date && b.date) {

                return new Date(b.date)
                    - new Date(a.date);

            }


            if (a.createdAt && b.createdAt) {

                return new Date(b.createdAt)
                    - new Date(a.createdAt);

            }


            return 0;

        })

        .slice(0, 4);

}


function soleAIGetBestSellers() {

    const allProducts =
        soleAIGetProducts();


    return [...allProducts]

        .sort((a, b) => {

            const reviewsA =
                Number(a.reviews || 0);

            const reviewsB =
                Number(b.reviews || 0);

            const ratingA =
                Number(a.rating || 0);

            const ratingB =
                Number(b.rating || 0);


            if (reviewsB !== reviewsA) {

                return reviewsB - reviewsA;

            }


            return ratingB - ratingA;

        })

        .slice(0, 4);

}


/* ============================================================
   PRODUCT CARD
============================================================ */

function createHomeProductCard(product) {

    const wishlist =
        soleAIGetWishlist();


    const isWishlisted =
        wishlist.includes(product.id);


    const card =
        document.createElement("article");


    card.className =
        "home-product-card";


    card.innerHTML = `

        <div class="home-product-image">

            ${
                product.discount
                    ? `
                        <span class="home-product-discount">
                            -${soleAIEscapeHTML(product.discount)}%
                        </span>
                    `
                    : ""
            }


            <button
                type="button"
                class="home-product-wishlist ${
                    isWishlisted ? "active" : ""
                }"
                data-product-id="${soleAIEscapeHTML(product.id)}"
                aria-label="Add to wishlist">

                <i class="bi ${
                    isWishlisted
                        ? "bi-heart-fill"
                        : "bi-heart"
                }"></i>

            </button>


            <a
                href="product.html?id=${encodeURIComponent(product.id)}">

                <img
                    src="${soleAIEscapeHTML(product.image)}"
                    alt="${soleAIEscapeHTML(product.name)}"
                    loading="lazy">

            </a>

        </div>


        <div class="home-product-info">

            <div class="home-product-brand">

                ${soleAIEscapeHTML(product.brand)}

            </div>


            <h3>

                ${soleAIEscapeHTML(product.name)}

            </h3>


            <div class="home-product-rating">

                <span class="home-product-stars">

                    ${soleAICreateStars(product.rating)}

                </span>

                <span>

                    ${soleAIEscapeHTML(product.rating || 0)}
                    (${soleAIEscapeHTML(product.reviews || 0)})

                </span>

            </div>


            <div class="home-product-bottom">

                <strong class="home-product-price">

                    ${soleAIFormatPrice(product.price)}

                </strong>


                <a
                    href="product.html?id=${encodeURIComponent(product.id)}"
                    class="home-product-link"
                    aria-label="View ${soleAIEscapeHTML(product.name)}">

                    <i class="bi bi-arrow-up-right"></i>

                </a>

            </div>

        </div>

    `;


    return card;

}


/* ============================================================
   RENDER PRODUCT GRID
============================================================ */

function renderHomeProductGrid(
    containerId,
    productList
) {

    const container =
        document.getElementById(containerId);


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (!productList.length) {

        container.innerHTML = `

            <p style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
                color: #64748b;
            ">

                Products coming soon.

            </p>

        `;

        return;

    }


    productList.forEach(product => {

        container.appendChild(
            createHomeProductCard(product)
        );

    });


    initializeHomeWishlist();

}


/* ============================================================
   RENDER BOTH PRODUCT SECTIONS
============================================================ */

function renderHomeProducts() {

    const newProducts =
        soleAIGetNewArrivals();


    const bestProducts =
        soleAIGetBestSellers();


    renderHomeProductGrid(
        "home-new-products",
        newProducts
    );


    renderHomeProductGrid(
        "home-best-products",
        bestProducts
    );

}


/* ============================================================
   WISHLIST EVENTS
============================================================ */

function initializeHomeWishlist() {

    const buttons =
        document.querySelectorAll(
            ".home-product-wishlist"
        );


    buttons.forEach(button => {

        if (button.dataset.listenerAdded === "true") {

            return;

        }


        button.dataset.listenerAdded = "true";


        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                const productId =
                    this.dataset.productId;


                if (!productId) {

                    return;

                }


                soleAIToggleWishlist(
                    productId
                );

            }
        );

    });

}


/* ============================================================
   HERO PRODUCT - AUTOMATIC ROTATION
============================================================ */

function initializeHomeHero() {

    const allProducts =
        soleAIGetProducts();


    if (!allProducts.length) {

        return;

    }


    const image =
        document.getElementById(
            "home-hero-image"
        );


    const name =
        document.getElementById(
            "home-hero-name"
        );


    const price =
        document.getElementById(
            "home-hero-price"
        );


    const card =
        document.querySelector(
            ".home-hero-shoe"
        );


    if (!image || !name || !price) {

        console.warn(
            "SoleAI: Hero product elements not found."
        );

        return;

    }


    /*
     * Start with New Balance Fresh Foam 1080.
     * This is index 3 in our 6-product data.
     */

    let currentIndex = 3;


    /*
     * Prevent multiple intervals if
     * initialization happens again.
     */

    if (window.soleAIHeroInterval) {

        clearInterval(
            window.soleAIHeroInterval
        );

    }


    function updateHeroProduct(product) {

        if (!product) {

            return;

        }


        /*
         * Fade old product out.
         */

        image.style.opacity = "0";


        if (card) {

            card.classList.add(
                "hero-product-changing"
            );

        }


        setTimeout(() => {

            /*
             * Update image
             */

            image.src =
                product.image;

            image.alt =
                product.name;


            /*
             * Update product name
             */

            name.textContent =
                product.name;


            /*
             * Update price
             */

            price.textContent =
                soleAIFormatPrice(
                    product.price
                );


            /*
             * Make image visible again
             */

            image.style.opacity = "1";


            if (card) {

                card.classList.remove(
                    "hero-product-changing"
                );

            }

        }, 300);

    }


    /*
     * Show initial product
     */

    updateHeroProduct(
        allProducts[currentIndex]
    );


    /*
     * Automatically rotate every 5 seconds
     */

    window.soleAIHeroInterval =
        setInterval(() => {

            currentIndex++;

            if (
                currentIndex >=
                allProducts.length
            ) {

                currentIndex = 0;

            }


            updateHeroProduct(
                allProducts[currentIndex]
            );

        }, 5000);

}


/* ============================================================
   AI FINDER
============================================================ */

function initializeHomeAI() {

    const buttons = [

        document.getElementById(
            "home-hero-ai"
        ),

        document.getElementById(
            "home-ai-finder-button"
        )

    ];


    buttons.forEach(button => {

        if (!button) {

            return;

        }


        if (
            button.dataset.listenerAdded === "true"
        ) {

            return;

        }


        button.dataset.listenerAdded =
            "true";


        button.addEventListener(
            "click",
            function() {

                soleAIShowMessage(
                    "🤖 SoleAI Stylist is ready — AI recommendations are coming next!"
                );

            }
        );

    });

}


/* ============================================================
   NEWSLETTER
============================================================ */

function initializeHomeNewsletter() {

    const form =
        document.getElementById(
            "home-newsletter-form"
        );


    if (!form) {

        return;

    }


    if (
        form.dataset.listenerAdded === "true"
    ) {

        return;

    }


    form.dataset.listenerAdded =
        "true";


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const input =
                document.getElementById(
                    "home-newsletter-email"
                );


            if (!input) {

                return;

            }


            const email =
                input.value.trim();


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(email)
            ) {

                soleAIShowMessage(
                    "Please enter a valid email address."
                );

                return;

            }


            localStorage.setItem(
                SOLEAI_NEWSLETTER_KEY,
                email
            );


            input.value = "";


            soleAIShowMessage(
                "You're subscribed to SoleAI! 🎉"
            );

        }
    );

}


/* ============================================================
   BACK TO TOP
============================================================ */

function initializeBackToTop() {

    const button =
        document.getElementById(
            "backToTop"
        );


    if (!button) {

        return;

    }


    if (
        button.dataset.listenerAdded === "true"
    ) {

        return;

    }


    button.dataset.listenerAdded =
        "true";


    window.addEventListener(
        "scroll",
        function() {

            button.classList.toggle(
                "show",
                window.scrollY > 500
            );

        }
    );


    button.addEventListener(
        "click",
        function() {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* ============================================================
   HOMEPAGE ANIMATIONS
============================================================ */

function initializeHomeAnimations() {

    if (
        typeof gsap === "undefined"
    ) {

        return;

    }


    const heroContent =
        document.querySelector(
            ".home-hero-content"
        );


    const heroProduct =
        document.querySelector(
            ".home-hero-shoe"
        );


    if (heroContent) {

        gsap.from(
            heroContent,
            {

                y: 35,

                opacity: 0,

                duration: .8,

                ease: "power3.out"

            }
        );

    }


    if (heroProduct) {

        gsap.from(
            heroProduct,
            {

                y: 35,

                opacity: 0,

                duration: .9,

                delay: .15,

                ease: "power3.out"

            }
        );

    }


    if (
        typeof ScrollTrigger ===
        "undefined"
    ) {

        return;

    }


    const animatedElements =
        document.querySelectorAll(
            ".home-category-card, " +
            ".home-product-card, " +
            ".home-trending-card, " +
            ".home-style-card, " +
            ".home-review-card"
        );


    animatedElements.forEach(element => {

        gsap.from(
            element,
            {

                y: 25,

                opacity: 0,

                duration: .55,

                ease: "power2.out",

                scrollTrigger: {

                    trigger: element,

                    start: "top 88%",

                    once: true

                }

            }
        );

    });

}


/* ============================================================
   SAFE HOMEPAGE INITIALIZATION
============================================================ */

function initializeSoleAIHomepage() {

    const isHomepage =
        document.querySelector(
            ".home-hero"
        );


    if (!isHomepage) {

        return;

    }


    if (
        typeof products ===
        "undefined"
    ) {

        console.error(
            "SoleAI: product-data.js must load before main.js."
        );

        return;

    }


    renderHomeProducts();

    initializeHomeHero();

    initializeHomeAI();

    initializeHomeNewsletter();

    initializeBackToTop();

    initializeHomeAnimations();

}


/* ============================================================
   START
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initializeSoleAIHomepage();

    }
);