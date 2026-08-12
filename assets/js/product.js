"use strict";

const API_URL =
    "https://soleai-backend.onrender.com/api/products";

const CART_API_URL =
    "https://soleai-backend.onrender.com/api/cart";

const TOKEN_KEY =
    "soleaiToken";


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const productId =
            params.get("id");


        if (!productId) {

            showProductNotFound();

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/${encodeURIComponent(productId)}`
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success ||
                !data.product
            ) {

                throw new Error(
                    data.message ||
                    "Product not found."
                );

            }


            const product =
                data.product;


            initializeProduct(
                product
            );


        } catch (error) {

            console.error(
                "SoleAI product API error:",
                error
            );


            showProductNotFound();

        }

    }
);


/* ============================================================
   INITIALIZE PRODUCT
============================================================ */

function initializeProduct(
    product
) {

    let selectedSize =
        product.sizes?.length
            ? String(product.sizes[0])
            : "8";


    let selectedColor =
        product.colors?.length
            ? product.colors[0]
            : "Black";


    let quantity = 1;

    let currentImageIndex = 0;


    const images =
        Array.isArray(product.images) &&
        product.images.length

            ? product.images

            : [product.image];


    /* ========================================================
       ELEMENTS
    ======================================================== */

    const mainImage =
        document.getElementById(
            "product-main-image"
        );

    const thumbnailContainer =
        document.getElementById(
            "product-thumbnails"
        );

    const currentImage =
        document.getElementById(
            "image-current"
        );

    const totalImages =
        document.getElementById(
            "image-total"
        );


    /* ========================================================
       PRODUCT DATA
    ======================================================== */

    setText(
        "product-brand",
        product.brand
    );

    setText(
        "product-name",
        product.name
    );

    setText(
        "breadcrumb-name",
        product.name
    );

    setText(
        "product-rating",
        product.rating
    );

    setText(
        "review-count",
        `${Number(
            product.reviews || 0
        ).toLocaleString("en-IN")} Reviews`
    );

    setText(
        "product-price",
        formatPrice(product.price)
    );

    setText(
        "product-original-price",
        formatPrice(product.originalPrice)
    );

    setText(
        "product-discount",
        `${product.discount || 0}% OFF`
    );

    setText(
        "product-description",
        product.description
    );

    setText(
        "detail-description",
        product.description
    );


    document.title =
        `${product.name} | SoleAI`;


    /* ========================================================
       GALLERY
    ======================================================== */

    if (mainImage) {

        mainImage.src =
            productImageURL(
                images[0]
            );

        mainImage.alt =
            product.name;

    }


    if (totalImages) {

        totalImages.textContent =
            images.length;

    }


    function renderThumbnails() {

        if (!thumbnailContainer) {

            return;

        }


        thumbnailContainer.innerHTML =
            "";


        images.forEach(
            (
                image,
                index
            ) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "product-thumbnail" +
                    (
                        index === 0
                            ? " active"
                            : ""
                    );


                button.innerHTML = `

                    <img
                        src="${escapeHTML(
                            productImageURL(
                                image
                            )
                        )}"
                        alt="${escapeHTML(
                            product.name
                        )} view ${index + 1}"
                    >

                `;


                button.addEventListener(
                    "click",
                    () => {

                        changeImage(
                            index
                        );

                    }
                );


                thumbnailContainer.appendChild(
                    button
                );

            }
        );

    }


    function changeImage(
        index
    ) {

        if (!images.length) {

            return;

        }


        currentImageIndex =
            (
                index +
                images.length
            ) %
            images.length;


        if (mainImage) {

            mainImage.src =
                productImageURL(
                    images[
                        currentImageIndex
                    ]
                );

        }


        if (currentImage) {

            currentImage.textContent =
                currentImageIndex + 1;

        }


        document
            .querySelectorAll(
                ".product-thumbnail"
            )
            .forEach(
                (
                    thumbnail,
                    i
                ) => {

                    thumbnail.classList.toggle(
                        "active",
                        i ===
                        currentImageIndex
                    );

                }
            );

    }


    renderThumbnails();


    document
        .querySelector(
            ".gallery-prev"
        )
        ?.addEventListener(
            "click",
            () => {

                changeImage(
                    currentImageIndex - 1
                );

            }
        );


    document
        .querySelector(
            ".gallery-next"
        )
        ?.addEventListener(
            "click",
            () => {

                changeImage(
                    currentImageIndex + 1
                );

            }
        );


    /* ========================================================
       SIZE
    ======================================================== */

    const sizeSelector =
        document.getElementById(
            "size-selector"
        );


    if (sizeSelector) {

        sizeSelector.innerHTML =
            "";


        (
            product.sizes ||
            []
        ).forEach(
            size => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.dataset.size =
                    size;


                button.textContent =
                    size;


                if (
                    String(size) ===
                    selectedSize
                ) {

                    button.classList.add(
                        "active"
                    );

                }


                button.addEventListener(
                    "click",
                    () => {

                        sizeSelector
                            .querySelectorAll(
                                "button"
                            )
                            .forEach(
                                item => {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        button.classList.add(
                            "active"
                        );


                        selectedSize =
                            String(size);

                    }
                );


                sizeSelector.appendChild(
                    button
                );

            }
        );

    }


    /* ========================================================
       COLOR
    ======================================================== */

    const colorOptions =
        document.querySelectorAll(
            ".color-option"
        );


    colorOptions.forEach(
        button => {

            const color =
                button.dataset.color;


            if (
                color &&
                product.colors &&
                !product.colors.includes(
                    color
                )
            ) {

                button.style.display =
                    "none";

            }


            button.addEventListener(
                "click",
                () => {

                    colorOptions
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    selectedColor =
                        button.dataset.color;


                    setText(
                        "selected-color",
                        selectedColor
                    );

                }
            );

        }
    );


    setText(
        "selected-color",
        selectedColor
    );


    /* ========================================================
       QUANTITY
    ======================================================== */

    const quantityValue =
        document.getElementById(
            "quantity-value"
        );


    function updateQuantity() {

        if (quantityValue) {

            quantityValue.textContent =
                quantity;

        }

    }


    document
        .getElementById(
            "quantity-minus"
        )
        ?.addEventListener(
            "click",
            () => {

                quantity =
                    Math.max(
                        1,
                        quantity - 1
                    );


                updateQuantity();

            }
        );


    document
        .getElementById(
            "quantity-plus"
        )
        ?.addEventListener(
            "click",
            () => {

                quantity =
                    Math.min(
                        10,
                        quantity + 1
                    );


                updateQuantity();

            }
        );


    /* ========================================================
       ADD TO CART
    ======================================================== */

    document
        .getElementById(
            "add-to-cart"
        )
        ?.addEventListener(
            "click",
            addToCart
        );


    async function addToCart() {

        const token =
            localStorage.getItem(
                TOKEN_KEY
            );


        /* ==========================================
           CHECK LOGIN
        ========================================== */

        if (!token) {

            showToast(
                "Please login before adding items to your cart."
            );


            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                1000
            );


            return;

        }


        /* ==========================================
           BUTTON LOADING
        ========================================== */

        const addButton =
            document.getElementById(
                "add-to-cart"
            );


        if (addButton) {

            addButton.disabled =
                true;

            addButton.classList.add(
                "loading"
            );

        }


        try {

            /* ==========================================
               SEND PRODUCT TO MONGODB
            ========================================== */

            const response =
                await fetch(
                    `${CART_API_URL}/add`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify({

                                productId:
                                    product._id ||
                                    product.id,

                                size:
                                    selectedSize,

                                color:
                                    selectedColor,

                                quantity:
                                    quantity

                            })

                    }
                );


            const data =
                await response.json();


            /* ==========================================
               API ERROR
            ========================================== */

            if (!response.ok) {

                console.error(
                    "Add to cart failed:",
                    data
                );


                if (
                    response.status === 401
                ) {

                    localStorage.removeItem(
                        TOKEN_KEY
                    );


                    showToast(
                        "Session expired. Please login again."
                    );


                    setTimeout(
                        () => {

                            window.location.href =
                                "login.html";

                        },
                        1000
                    );


                    return;

                }


                showToast(
                    data.message ||
                    "Unable to add product to cart."
                );


                return;

            }


            /* ==========================================
               SUCCESS
            ========================================== */

            console.log(
                "Product added to MongoDB cart:",
                data.cart
            );


            showToast(
                `${product.name} added to cart`
            );


            /* ==========================================
               UPDATE CART BADGE
            ========================================== */

            updateCartBadgeFromBackend(
                data.cart
            );


        } catch (error) {

            console.error(
                "Cart API error:",
                error
            );


            showToast(
                "Unable to connect to the cart server."
            );

        } finally {

            if (addButton) {

                addButton.disabled =
                    false;

                addButton.classList.remove(
                    "loading"
                );

            }

        }

    }


    /* ========================================================
       BUY NOW
    ======================================================== */

    document
        .getElementById(
            "buy-now"
        )
        ?.addEventListener(
            "click",
            async () => {

                const token =
                    localStorage.getItem(
                        TOKEN_KEY
                    );


                if (!token) {

                    showToast(
                        "Please login before buying."
                    );


                    setTimeout(
                        () => {

                            window.location.href =
                                "login.html";

                        },
                        1000
                    );


                    return;

                }


                await addToCart();


                setTimeout(
                    () => {

                        window.location.href =
                            "cart.html";

                    },
                    500
                );

            }
        );


    /* ========================================================
       WISHLIST
    ======================================================== */

    const wishlistButton =
        document.getElementById(
            "wishlist-btn"
        );


    if (wishlistButton) {

        wishlistButton.addEventListener(
            "click",
            function () {

                this.classList.toggle(
                    "active"
                );


                const icon =
                    this.querySelector(
                        "i"
                    );


                if (
                    this.classList.contains(
                        "active"
                    )
                ) {

                    if (icon) {

                        icon.className =
                            "bi bi-heart-fill";

                    }


                    showToast(
                        "Added to wishlist"
                    );

                } else {

                    if (icon) {

                        icon.className =
                            "bi bi-heart";

                    }


                    showToast(
                        "Removed from wishlist"
                    );

                }

            }
        );

    }


    /* ========================================================
       SHARE
    ======================================================== */

    const shareButtons = [

        document.getElementById(
            "share-product"
        ),

        document.getElementById(
            "share-btn"
        )

    ];


    shareButtons.forEach(
        button => {

            button?.addEventListener(
                "click",
                shareProduct
            );

        }
    );


    async function shareProduct() {

        const shareData = {

            title:
                product.name,

            text:
                `Check out ${product.name} on SoleAI.`,

            url:
                window.location.href

        };


        try {

            if (
                navigator.share
            ) {

                await navigator.share(
                    shareData
                );

            } else {

                await navigator.clipboard.writeText(
                    window.location.href
                );


                showToast(
                    "Product link copied"
                );

            }

        } catch {

            // User cancelled share.

        }

    }


    /* ========================================================
       COMPARE
    ======================================================== */

    document
        .getElementById(
            "compare-btn"
        )
        ?.addEventListener(
            "click",
            () => {

                showToast(
                    "Added to comparison"
                );

            }
        );


    /* ========================================================
       AI ASSISTANT
    ======================================================== */

    const aiInput =
        document.getElementById(
            "ai-input"
        );


    const aiResponse =
        document.getElementById(
            "ai-response"
        );


    function askAI(
        question
    ) {

        if (
            !question.trim()
        ) {

            return;

        }


        const q =
            question.toLowerCase();


        let answer =
            `Based on the available product information, ${product.name} is a strong everyday option.`;


        if (
            q.includes("running") ||
            q.includes("run") ||
            q.includes("marathon")
        ) {

            answer =
                `${product.name} is designed with running comfort in mind. It offers responsive cushioning and breathable construction. For marathon-level training, your distance, running style and cushioning preference should also be considered.`;

        } else if (
            q.includes("size")
        ) {

            answer =
                `Available sizes are ${(
                    product.sizes || []
                ).join(", ")}. You selected size ${selectedSize}. For the most accurate fit, compare it with your usual running-shoe size.`;

        } else if (
            q.includes("comfortable") ||
            q.includes("comfort")
        ) {

            answer =
                `${product.name} is focused on everyday comfort, with responsive cushioning and breathable construction.`;

        } else if (
            q.includes("compare")
        ) {

            answer =
                `This ${product.brand} pair focuses on comfort, everyday movement and style. You can compare its price, rating and features with other SoleAI picks below.`;

        } else if (
            q.includes("waterproof") ||
            q.includes("water")
        ) {

            answer =
                `The available product information does not confirm full waterproofing. I would not treat this pair as waterproof unless the manufacturer specifically states it.`;

        }


        if (aiResponse) {

            aiResponse.innerHTML = `

                <i class="bi bi-stars"></i>

                <span>
                    ${escapeHTML(answer)}
                </span>

            `;

        }

    }


    document
        .querySelectorAll(
            ".ai-suggestions button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        askAI(
                            button.dataset.question ||
                            ""
                        );

                    }
                );

            }
        );


    document
        .getElementById(
            "ask-ai"
        )
        ?.addEventListener(
            "click",
            () => {

                askAI(
                    aiInput?.value ||
                    ""
                );


                if (aiInput) {

                    aiInput.value =
                        "";

                }

            }
        );


    aiInput?.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();


                askAI(
                    aiInput.value
                );


                aiInput.value =
                    "";

            }

        }
    );


    /* ========================================================
       TABS
    ======================================================== */

    document
        .querySelectorAll(
            ".details-tabs button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".details-tabs button"
                            )
                            .forEach(
                                item => {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        document
                            .querySelectorAll(
                                ".detail-panel"
                            )
                            .forEach(
                                panel => {

                                    panel.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        button.classList.add(
                            "active"
                        );


                        const target =
                            document.getElementById(
                                button.dataset.tab
                            );


                        target?.classList.add(
                            "active"
                        );

                    }
                );

            }
        );


    /* ========================================================
       SIZE GUIDE
    ======================================================== */

    document
        .getElementById(
            "size-guide-btn"
        )
        ?.addEventListener(
            "click",
            () => {

                showToast(
                    "Size Guide: choose your usual shoe size."
                );

            }
        );


    /* ========================================================
       RELATED PRODUCTS
    ======================================================== */

    loadRelatedProducts(
        product
    );


    /* ========================================================
       NEWSLETTER
    ======================================================== */

    document
        .getElementById(
            "newsletter-form"
        )
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                showToast(
                    "Thanks for subscribing to SoleAI!"
                );


                event.target.reset();

            }
        );


    /* ========================================================
       BACK TO TOP
    ======================================================== */

    const backTop =
        document.getElementById(
            "backToTop"
        );


    window.addEventListener(
        "scroll",
        () => {

            backTop?.classList.toggle(
                "show",
                window.scrollY > 500
            );

        }
    );


    backTop?.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );


    /* ========================================================
       INITIAL CART BADGE
    ======================================================== */

    updateCartBadge();

}


/* ============================================================
   UPDATE CART BADGE FROM BACKEND
============================================================ */

function updateCartBadgeFromBackend(
    cart
) {

    if (
        !cart ||
        !Array.isArray(
            cart.items
        )
    ) {

        return;

    }


    const count =
        cart.items.reduce(
            (
                total,
                item
            ) => {

                return total +
                    Number(
                        item.quantity ||
                        0
                    );

            },
            0
        );


    document
        .querySelectorAll(
            "[data-cart-count], .cart-count, #cart-count"
        )
        .forEach(
            badge => {

                badge.textContent =
                    count;

                badge.style.display =
                    count > 0
                        ? ""
                        : "none";

            }
        );

}


/* ============================================================
   RELATED PRODUCTS
============================================================ */

async function loadRelatedProducts(
    currentProduct
) {

    const container =
        document.getElementById(
            "related-products"
        );


    if (!container) {

        return;

    }


    try {

        const response =
            await fetch(
                API_URL
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                "Unable to load related products."
            );

        }


        const currentId =
            String(
                currentProduct._id ||
                currentProduct.id
            );


        const related =
            (
                data.products || []
            )
                .filter(
                    item =>

                        String(
                            item._id ||
                            item.id
                        ) !==
                        currentId
                )
                .slice(
                    0,
                    4
                );


        container.innerHTML =
            related
                .map(
                    item => {

                        const id =
                            item._id ||
                            item.id;


                        return `

                            <article
                                class="related-card">

                                <a
                                    href="product.html?id=${encodeURIComponent(id)}"
                                    class="related-image">

                                    <span
                                        class="related-tag">

                                        SOLEAI PICK

                                    </span>

                                    <img
                                        src="${escapeHTML(
                                            productImageURL(
                                                item.image
                                            )
                                        )}"
                                        alt="${escapeHTML(
                                            item.name
                                        )}"
                                        loading="lazy"
                                    >

                                </a>


                                <div
                                    class="related-content">

                                    <span
                                        class="related-brand">

                                        ${escapeHTML(
                                            item.brand
                                        )}

                                    </span>


                                    <h3
                                        class="related-name">

                                        <a
                                            href="product.html?id=${encodeURIComponent(id)}">

                                            ${escapeHTML(
                                                item.name
                                            )}

                                        </a>

                                    </h3>


                                    <div
                                        class="related-rating">

                                        ★★★★★

                                        <span>
                                            ${item.rating || 0}
                                        </span>

                                    </div>


                                    <div
                                        class="related-bottom">

                                        <span
                                            class="related-price">

                                            ${formatPrice(
                                                item.price
                                            )}

                                        </span>


                                        <a
                                            href="product.html?id=${encodeURIComponent(id)}"
                                            class="related-open"
                                            aria-label="View ${escapeHTML(
                                                item.name
                                            )}">

                                            <i
                                                class="bi bi-arrow-up-right">
                                            </i>

                                        </a>

                                    </div>

                                </div>

                            </article>

                        `;

                    }
                )
                .join("");

    } catch (error) {

        console.error(
            "Related products error:",
            error
        );

        container.innerHTML =
            "";

    }

}


/* ============================================================
   HELPERS
============================================================ */

function productImageURL(
    image
) {

    if (!image) {

        return "";

    }


    if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("data:")
    ) {

        return image;

    }


    return image
        .replace(
            /^\.\/+/,
            ""
        );

}


function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            value ??
            ""
        );


    return div.innerHTML;

}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value ??
            "";

    }

}


function formatPrice(
    value
) {

    return "₹" +
        Number(
            value || 0
        )
            .toLocaleString(
                "en-IN"
            );

}


/* ============================================================
   CART BADGE
============================================================ */

function updateCartBadge() {

    const token =
        localStorage.getItem(
            TOKEN_KEY
        );


    /*
     * If logged in, get the real
     * MongoDB cart count.
     */

    if (token) {

        fetch(
            CART_API_URL,
            {
                headers: {

                    "Authorization":
                        `Bearer ${token}`

                }

            }
        )
        .then(
            response =>
                response.json()
        )
        .then(
            data => {

                if (
                    data.success &&
                    data.cart
                ) {

                    updateCartBadgeFromBackend(
                        data.cart
                    );

                }

            }
        )
        .catch(
            error => {

                console.error(
                    "Cart badge error:",
                    error
                );

            }
        );

        return;

    }


    /*
     * Guest/local fallback.
     */

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
        Array.isArray(cart)
            ? cart.reduce(
                (
                    total,
                    item
                ) => {

                    return total +
                        Number(
                            item.quantity ||
                            0
                        );

                },
                0
            )
            : 0;


    document
        .querySelectorAll(
            "[data-cart-count], .cart-count, #cart-count"
        )
        .forEach(
            badge => {

                badge.textContent =
                    count;

                badge.style.display =
                    count > 0
                        ? ""
                        : "none";

            }
        );

}


/* ============================================================
   TOAST
============================================================ */

function showToast(
    message
) {

    let toast =
        document.getElementById(
            "soleai-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "soleai-toast";


        toast.style.cssText = `
            position:fixed;
            left:50%;
            bottom:30px;
            z-index:9999;
            transform:translateX(-50%) translateY(20px);
            padding:13px 18px;
            border-radius:10px;
            background:#111827;
            color:#ffffff;
            font:600 12px Inter,sans-serif;
            box-shadow:0 15px 35px rgba(0,0,0,.18);
            opacity:0;
            pointer-events:none;
            transition:.25s ease;
        `;


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.style.opacity =
        "1";


    toast.style.transform =
        "translateX(-50%) translateY(0)";


    clearTimeout(
        window.soleaiToastTimer
    );


    window.soleaiToastTimer =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateX(-50%) translateY(20px)";

            },
            2500
        );

}


/* ============================================================
   PRODUCT NOT FOUND
============================================================ */

function showProductNotFound() {

    document.body.innerHTML = `

        <main style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            font-family:Inter,sans-serif;
            background:#f8fafc;
            text-align:center;
            padding:30px;
        ">

            <div>

                <div style="
                    font-size:50px;
                    margin-bottom:15px;
                ">
                    👟
                </div>

                <h1 style="
                    color:#111827;
                    margin-bottom:10px;
                ">
                    Product Not Found
                </h1>

                <p style="
                    color:#64748b;
                    margin-bottom:20px;
                ">
                    This product may have been removed
                    or the link is incorrect.
                </p>

                <a
                    href="shop.html"
                    style="
                        display:inline-block;
                        padding:12px 20px;
                        border-radius:9px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        font-weight:700;
                        font-size:13px;
                    "
                >
                    Back to Shop
                </a>

            </div>

        </main>

    `;

}
