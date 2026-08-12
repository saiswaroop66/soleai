"use strict";


/* ===========================================================
   CONFIG
=========================================================== */

const API_URL =
    "http://localhost:5000/api/products";


/* ===========================================================
   STATE
=========================================================== */

let products = [];

let shopState = {

    search: "",

    category: "all",

    gender: "all",

    rating: 0,

    maxPrice: 7000,

    sort: "featured"

};


/* ===========================================================
   DOM
=========================================================== */

const productGrid =
    document.getElementById("product-grid");

const productCount =
    document.getElementById("product-count");

const noProducts =
    document.getElementById("no-products");

const searchInput =
    document.getElementById("shop-search");

const clearSearch =
    document.getElementById("clear-search");

const sortSelect =
    document.getElementById("sort-products");

const priceRange =
    document.getElementById("price-range");

const priceValue =
    document.getElementById("price-value");


/* ===========================================================
   CURRENCY
=========================================================== */

function formatPrice(price) {

    return "₹" +
        Number(price)
            .toLocaleString("en-IN");

}


/* ===========================================================
   LOAD PRODUCTS FROM BACKEND
=========================================================== */

async function loadProducts() {

    try {

        if (productGrid) {

            productGrid.innerHTML = `
                <div class="shop-loading">
                    <p>Loading SoleAI products...</p>
                </div>
            `;

        }


        const response =
            await fetch(API_URL);


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load products."
            );

        }


        products =
            Array.isArray(data.products)
                ? data.products
                : [];


        console.log(
            "SoleAI products loaded:",
            products
        );


        updateCategoryCounts();

        renderProducts();

    } catch (error) {

        console.error(
            "Product API error:",
            error
        );


        products = [];


        if (productGrid) {

            productGrid.innerHTML = `
                <div class="shop-loading">
                    <p>Unable to load products.</p>
                    <button
                        type="button"
                        id="retry-products">
                        Retry
                    </button>
                </div>
            `;


            const retryButton =
                document.getElementById(
                    "retry-products"
                );


            if (retryButton) {

                retryButton.addEventListener(
                    "click",
                    loadProducts
                );

            }

        }

    }

}


/* ===========================================================
   FIND PRODUCT
=========================================================== */

function getProductById(productId) {

    return products.find(
        product =>
            String(product.id || product._id) ===
            String(productId)
    );

}


/* ===========================================================
   SEARCH PRODUCTS
=========================================================== */

function searchProducts(query) {

    const search =
        query
            .trim()
            .toLowerCase();


    if (!search) {

        return [...products];

    }


    return products.filter(
        product => {

            const searchableText = [

                product.name,

                product.brand,

                product.category,

                product.description,

                product.shortDescription,

                ...(product.tags || []),

                ...(product.colors || [])

            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            return searchableText.includes(
                search
            );

        }
    );

}


/* ===========================================================
   FILTER PRODUCTS
=========================================================== */

function getFilteredProducts() {

    let result =
        [...products];


    /* SEARCH */

    if (shopState.search) {

        result =
            searchProducts(
                shopState.search
            );

    }


    /* CATEGORY */

    if (
        shopState.category !==
        "all"
    ) {

        result =
            result.filter(
                product =>
                    String(
                        product.category
                    ).toLowerCase() ===
                    String(
                        shopState.category
                    ).toLowerCase()
            );

    }


    /* GENDER */

    if (
        shopState.gender !==
        "all"
    ) {

        result =
            result.filter(
                product =>
                    product.gender &&
                    String(
                        product.gender
                    ).toLowerCase() ===
                    String(
                        shopState.gender
                    ).toLowerCase()
            );

    }


    /* PRICE */

    result =
        result.filter(
            product =>
                Number(product.price) <=
                Number(shopState.maxPrice)
        );


    /* RATING */

    result =
        result.filter(
            product =>
                Number(product.rating || 0) >=
                Number(shopState.rating)
        );


    /* SORT */

    switch (
        shopState.sort
    ) {

        case "price-low":

            result.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );

            break;


        case "price-high":

            result.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );

            break;


        case "rating":

            result.sort(
                (a, b) =>
                    Number(b.rating || 0) -
                    Number(a.rating || 0)
            );

            break;


        case "discount":

            result.sort(
                (a, b) =>
                    Number(b.discount || 0) -
                    Number(a.discount || 0)
            );

            break;


        default:

            result.sort(
                (a, b) => {

                    const ratingDifference =
                        Number(b.rating || 0) -
                        Number(a.rating || 0);


                    if (
                        ratingDifference !== 0
                    ) {

                        return ratingDifference;

                    }


                    return (
                        Number(b.reviews || 0) -
                        Number(a.reviews || 0)
                    );

                }
            );

    }


    return result;

}


/* ===========================================================
   RATING STARS
=========================================================== */

function createStars(rating) {

    let stars = "";


    const numericRating =
        Number(rating || 0);


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (
            numericRating >= i
        ) {

            stars +=
                `<i class="bi bi-star-fill"></i>`;

        } else if (
            numericRating >=
            i - 0.5
        ) {

            stars +=
                `<i class="bi bi-star-half"></i>`;

        } else {

            stars +=
                `<i class="bi bi-star"></i>`;

        }

    }


    return stars;

}


/* ===========================================================
   PRODUCT CARD
=========================================================== */

function createProductCard(product) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "shop-product-card";


    const productId =
        product.id ||
        product._id;


    const wishlist =
        getWishlist();


    const isWishlisted =
        wishlist.includes(
            String(productId)
        );


    card.innerHTML = `

        <div class="shop-product-image">

            ${
                Number(product.discount || 0) > 0
                    ? `
                        <span class="product-discount">
                            -${product.discount}%
                        </span>
                    `
                    : ""
            }


            <button
                type="button"
                class="product-wishlist ${
                    isWishlisted
                        ? "active"
                        : ""
                }"
                data-product-id="${escapeHTML(productId)}"
                aria-label="Add to wishlist">

                <i class="bi ${
                    isWishlisted
                        ? "bi-heart-fill"
                        : "bi-heart"
                }"></i>

            </button>


            <a
                href="product.html?id=${encodeURIComponent(productId)}">

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy">

            </a>

        </div>


        <div class="shop-product-info">

            <div class="product-brand">

                ${escapeHTML(product.brand)}

            </div>


            <h3>

                ${escapeHTML(product.name)}

            </h3>


            <div class="product-rating">

                <span class="product-stars">

                    ${createStars(product.rating)}

                </span>

                <span class="product-review-count">

                    ${product.rating || 0}
                    (${product.reviews || 0})

                </span>

            </div>


            <div class="product-price-row">

                <span class="product-price">

                    ${formatPrice(product.price)}

                </span>


                ${
                    product.originalPrice
                        ? `
                            <span class="product-original-price">

                                ${formatPrice(
                                    product.originalPrice
                                )}

                            </span>
                        `
                        : ""
                }

            </div>


            <div class="product-buttons">

                <button
                    type="button"
                    class="product-add-cart"
                    data-product-id="${escapeHTML(productId)}">

                    <i class="bi bi-cart-plus"></i>

                    Add to Cart

                </button>


                <a
                    href="product.html?id=${encodeURIComponent(productId)}"
                    class="product-view"
                    aria-label="View product">

                    <i class="bi bi-eye"></i>

                </a>

            </div>

        </div>

    `;


    return card;

}


/* ===========================================================
   RENDER PRODUCTS
=========================================================== */

function renderProducts() {

    if (!productGrid) return;


    const filtered =
        getFilteredProducts();


    productGrid.innerHTML = "";


    if (productCount) {

        productCount.textContent =
            filtered.length;

    }


    if (!filtered.length) {

        productGrid.style.display =
            "none";


        if (noProducts) {

            noProducts.classList.remove(
                "hidden"
            );

        }

        return;

    }


    productGrid.style.display =
        "grid";


    if (noProducts) {

        noProducts.classList.add(
            "hidden"
        );

    }


    filtered.forEach(
        product => {

            productGrid.appendChild(
                createProductCard(product)
            );

        }
    );


    initializeAnimations();

}


/* ===========================================================
   WISHLIST
=========================================================== */

const WISHLIST_KEY =
    "soleai_wishlist";


function getWishlist() {

    try {

        return JSON.parse(
            localStorage.getItem(
                WISHLIST_KEY
            )
        ) || [];

    } catch {

        return [];

    }

}


function toggleWishlist(productId) {

    let wishlist =
        getWishlist();


    productId =
        String(productId);


    const index =
        wishlist.indexOf(
            productId
        );


    if (index === -1) {

        wishlist.push(
            productId
        );

        showMessage(
            "Added to wishlist ❤️"
        );

    } else {

        wishlist.splice(
            index,
            1
        );

        showMessage(
            "Removed from wishlist"
        );

    }


    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );


    renderProducts();

}


/* ===========================================================
   ADD TO CART
=========================================================== */

function addToCart(productId) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        showMessage(
            "Product not found."
        );

        return;

    }


    let cart = [];


    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "soleai_cart"
                )
            ) || [];

    } catch {

        cart = [];

    }


    const existing =
        cart.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (existing) {

        existing.quantity =
            (Number(
                existing.quantity
            ) || 1) + 1;

    } else {

        cart.push({

            id:
                String(
                    product.id ||
                    product._id
                ),

            name:
                product.name,

            brand:
                product.brand,

            price:
                product.price,

            originalPrice:
                product.originalPrice,

            image:
                product.image,

            quantity:
                1

        });

    }


    localStorage.setItem(
        "soleai_cart",
        JSON.stringify(cart)
    );


    showMessage(
        `${product.name} added to cart 🛒`
    );


    updateCartCount();

}


/* ===========================================================
   CART COUNT
=========================================================== */

function updateCartCount() {

    let cart = [];


    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "soleai_cart"
                )
            ) || [];

    } catch {

        cart = [];

    }


    const count =
        cart.reduce(
            (total, item) =>
                total +
                (
                    Number(
                        item.quantity
                    ) || 1
                ),
            0
        );


    const badges =
        document.querySelectorAll(
            "#cart-count, .cart-count, [data-cart-count]"
        );


    badges.forEach(
        badge => {

            badge.textContent =
                count;

            badge.classList.toggle(
                "show",
                count > 0
            );

        }
    );

}


/* ===========================================================
   SEARCH
=========================================================== */

function initializeSearch() {

    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        () => {

            shopState.search =
                searchInput.value.trim();


            if (clearSearch) {

                clearSearch.classList.toggle(
                    "show",
                    shopState.search.length > 0
                );

            }


            renderProducts();

        }
    );


    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                searchInput.value = "";

                shopState.search = "";

                clearSearch.classList.remove(
                    "show"
                );

                renderProducts();

                searchInput.focus();

            }
        );

    }

}


/* ===========================================================
   CATEGORY
=========================================================== */

function initializeCategoryFilter() {

    const radios =
        document.querySelectorAll(
            'input[name="category"]'
        );


    radios.forEach(
        radio => {

            radio.addEventListener(
                "change",
                () => {

                    shopState.category =
                        radio.value;

                    renderProducts();

                }
            );

        }
    );

}


/* ===========================================================
   GENDER
=========================================================== */

function initializeGenderFilter() {

    const radios =
        document.querySelectorAll(
            'input[name="gender"]'
        );


    radios.forEach(
        radio => {

            radio.addEventListener(
                "change",
                () => {

                    shopState.gender =
                        radio.value;

                    renderProducts();

                }
            );

        }
    );

}


/* ===========================================================
   RATING
=========================================================== */

function initializeRatingFilter() {

    const radios =
        document.querySelectorAll(
            'input[name="rating"]'
        );


    radios.forEach(
        radio => {

            radio.addEventListener(
                "change",
                () => {

                    shopState.rating =
                        Number(
                            radio.value
                        );

                    renderProducts();

                }
            );

        }
    );

}


/* ===========================================================
   PRICE
=========================================================== */

function initializePriceFilter() {

    if (!priceRange) return;


    priceRange.addEventListener(
        "input",
        () => {

            shopState.maxPrice =
                Number(
                    priceRange.value
                );


            if (priceValue) {

                priceValue.textContent =
                    formatPrice(
                        shopState.maxPrice
                    );

            }


            renderProducts();

        }
    );

}


/* ===========================================================
   SORT
=========================================================== */

function initializeSort() {

    if (!sortSelect) return;


    sortSelect.addEventListener(
        "change",
        () => {

            shopState.sort =
                sortSelect.value;

            renderProducts();

        }
    );

}


/* ===========================================================
   CLEAR FILTERS
=========================================================== */

function clearFilters() {

    shopState = {

        search: "",

        category: "all",

        gender: "all",

        rating: 0,

        maxPrice: 7000,

        sort: "featured"

    };


    if (searchInput) {

        searchInput.value = "";

    }


    if (clearSearch) {

        clearSearch.classList.remove(
            "show"
        );

    }


    if (priceRange) {

        priceRange.value = 7000;

    }


    if (priceValue) {

        priceValue.textContent =
            "₹7,000";

    }


    if (sortSelect) {

        sortSelect.value =
            "featured";

    }


    const category =
        document.querySelector(
            'input[name="category"][value="all"]'
        );


    const gender =
        document.querySelector(
            'input[name="gender"][value="all"]'
        );


    const rating =
        document.querySelector(
            'input[name="rating"][value="0"]'
        );


    if (category) {

        category.checked = true;

    }


    if (gender) {

        gender.checked = true;

    }


    if (rating) {

        rating.checked = true;

    }


    renderProducts();

}


/* ===========================================================
   PRODUCT ACTIONS
=========================================================== */

function initializeProductActions() {

    if (!productGrid) return;


    productGrid.addEventListener(
        "click",
        event => {

            const wishlistButton =
                event.target.closest(
                    ".product-wishlist"
                );


            if (wishlistButton) {

                event.preventDefault();

                event.stopPropagation();


                toggleWishlist(
                    wishlistButton.dataset.productId
                );

                return;

            }


            const cartButton =
                event.target.closest(
                    ".product-add-cart"
                );


            if (cartButton) {

                event.preventDefault();


                addToCart(
                    cartButton.dataset.productId
                );

            }

        }
    );

}


/* ===========================================================
   CATEGORY COUNTS
=========================================================== */

function updateCategoryCounts() {

    const categories = {

        all:
            products.length,

        running:
            products.filter(
                p =>
                    String(
                        p.category
                    ).toLowerCase() ===
                    "running"
            ).length,

        sneakers:
            products.filter(
                p =>
                    String(
                        p.category
                    ).toLowerCase() ===
                    "sneakers"
            ).length,

        sports:
            products.filter(
                p =>
                    String(
                        p.category
                    ).toLowerCase() ===
                    "sports"
            ).length,

        outdoor:
            products.filter(
                p =>
                    String(
                        p.category
                    ).toLowerCase() ===
                    "outdoor"
            ).length

    };


    Object.entries(
        categories
    ).forEach(
        ([key, value]) => {

            const element =
                document.getElementById(
                    `count-${key}`
                );


            if (element) {

                element.textContent =
                    value;

            }

        }
    );

}


/* ===========================================================
   MOBILE SIDEBAR
=========================================================== */

function initializeMobileFilters() {

    const button =
        document.getElementById(
            "mobile-filter-button"
        );

    const sidebar =
        document.getElementById(
            "shop-sidebar"
        );


    if (
        !button ||
        !sidebar
    ) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );


    sidebar.addEventListener(
        "change",
        () => {

            if (
                window.innerWidth <= 850
            ) {

                sidebar.classList.remove(
                    "open"
                );

            }

        }
    );

}


/* ===========================================================
   AI BUTTON
=========================================================== */

function initializeAIButton() {

    const button =
        document.getElementById(
            "shop-ai-button"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            showMessage(
                "AI Assistant is opening 🤖"
            );

            window.location.href =
                "ai-assistant.html";

        }
    );

}


/* ===========================================================
   RESET BUTTON
=========================================================== */

function initializeResetButton() {

    const button =
        document.getElementById(
            "reset-products"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        clearFilters
    );


    const clearFiltersButton =
        document.getElementById(
            "clear-filters"
        );


    if (clearFiltersButton) {

        clearFiltersButton.addEventListener(
            "click",
            clearFilters
        );

    }

}


/* ===========================================================
   MESSAGE
=========================================================== */

function showMessage(message) {

    if (
        typeof showToast ===
        "function"
    ) {

        showToast(message);

        return;

    }


    alert(message);

}


/* ===========================================================
   ESCAPE HTML
=========================================================== */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value ?? "");


    return div.innerHTML;

}


/* ===========================================================
   BACK TO TOP
=========================================================== */

function initializeBackToTop() {

    const button =
        document.getElementById(
            "backToTop"
        );


    if (!button) return;


    window.addEventListener(
        "scroll",
        () => {

            button.classList.toggle(
                "show",
                window.scrollY > 500
            );

        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* ===========================================================
   ANIMATIONS
=========================================================== */

function initializeAnimations() {

    if (
        typeof gsap ===
        "undefined"
    ) {

        return;

    }


    const cards =
        document.querySelectorAll(
            ".shop-product-card"
        );


    if (!cards.length) return;


    gsap.from(
        cards,
        {

            y: 25,

            opacity: 0,

            duration: .5,

            stagger: .07,

            ease: "power3.out"

        }
    );

}


/* ===========================================================
   INITIALIZE SHOP
=========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeSearch();

        initializeCategoryFilter();

        initializeGenderFilter();

        initializeRatingFilter();

        initializePriceFilter();

        initializeSort();

        initializeProductActions();

        initializeMobileFilters();

        initializeAIButton();

        initializeResetButton();

        initializeBackToTop();

        updateCartCount();

        loadProducts();

    }
);