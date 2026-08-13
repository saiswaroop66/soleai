"use strict";

/* ============================================================
   SOLEAI CART
   MongoDB + JWT Cart
============================================================ */

const API_URL =
    "https://soleai-backend.onrender.com/api/cart";

const TOKEN_KEY =
    "soleaiToken";

const LOGIN_REDIRECT_KEY =
    "soleai_redirect_after_login";


/* ============================================================
   GET TOKEN
============================================================ */

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}


/* ============================================================
   SAVE LOCAL CART
============================================================ */

function saveLocalCart(cart) {

    localStorage.setItem(
        "soleai_cart",
        JSON.stringify(
            Array.isArray(cart)
                ? cart
                : []
        )
    );

}


/* ============================================================
   GET LOCAL CART
============================================================ */

function getLocalCart() {

    try {

        const cart =
            JSON.parse(
                localStorage.getItem(
                    "soleai_cart"
                )
            );

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "Local cart error:",
            error
        );

        return [];

    }

}


/* ============================================================
   NORMALIZE CART
============================================================ */

function normalizeCart(cart) {

    if (
        !cart ||
        !Array.isArray(cart.items)
    ) {

        return [];

    }

    return cart.items.map(
        item => ({

            id:
                item.productId,

            productId:
                item.productId,

            name:
                item.name || "SoleAI Product",

            brand:
                item.brand || "SoleAI",

            price:
                Number(
                    item.price
                ) || 0,

            originalPrice:
                Number(
                    item.originalPrice
                ) || 0,

            image:
                item.image || "",

            size:
                item.size || "",

            color:
                item.color || "",

            quantity:
                Number(
                    item.quantity
                ) || 1

        })
    );

}


/* ============================================================
   GET CART FROM BACKEND
============================================================ */

async function getCartFromBackend() {

    const token =
        getToken();

    if (!token) {

        return null;

    }

    const response =
        await fetch(
            API_URL,
            {
                method: "GET",

                headers: {

                    "Authorization":
                        `Bearer ${token}`,

                    "Accept":
                        "application/json"

                }

            }
        );


    let data;

    try {

        data =
            await response.json();

    } catch (error) {

        throw new Error(
            "Invalid response from cart server."
        );

    }


    if (!response.ok) {

        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                TOKEN_KEY
            );

        }

        throw new Error(
            data.message ||
            "Unable to load cart."
        );

    }


    return data.cart || {
        items: []
    };

}


/* ============================================================
   LOAD CART
============================================================ */

async function loadCart() {

    const token =
        getToken();


    /*
     * Logged-in user:
     * MongoDB is the source of truth.
     */

    if (token) {

        try {

            const backendCart =
                await getCartFromBackend();


            const items =
                normalizeCart(
                    backendCart
                );


            /*
             * Synchronize local storage
             * with MongoDB cart.
             */

            saveLocalCart(
                items
            );


            console.log(
                "SoleAI cart loaded:",
                items
            );


            return items;

        } catch (error) {

            console.error(
                "Backend cart error:",
                error
            );


            /*
             * If backend fails,
             * temporarily use local cart.
             */

            const localCart =
                getLocalCart();


            return localCart;

        }

    }


    /*
     * Guest cart.
     */

    return getLocalCart();

}


/* ============================================================
   FORMAT PRICE
============================================================ */

function formatPrice(price) {

    return "₹" +
        Number(
            price || 0
        ).toLocaleString(
            "en-IN"
        );

}


/* ============================================================
   CHECK LOGIN
============================================================ */

function isUserLoggedIn() {

    return !!getToken();

}


/* ============================================================
   REDIRECT LOGIN
============================================================ */

function redirectToLogin() {

    sessionStorage.setItem(
        LOGIN_REDIRECT_KEY,
        "checkout.html"
    );

    window.location.href =
        "login.html";

}


/* ============================================================
   RENDER CART
============================================================ */

async function renderCart() {

    const container =
        document.getElementById(
            "cart-items"
        );

    const empty =
        document.getElementById(
            "empty-cart"
        );

    const continueShopping =
        document.getElementById(
            "continue-shopping"
        );

    const checkoutButton =
        document.getElementById(
            "checkout-btn"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `
        <div class="cart-loading">
            Loading your cart...
        </div>
    `;


    const cart =
        await loadCart();


    container.innerHTML =
        "";


    /* ========================================================
       EMPTY
    ======================================================== */

    if (!cart.length) {

        if (empty) {

            empty.style.display =
                "block";

        }


        if (continueShopping) {

            continueShopping.style.display =
                "none";

        }


        if (checkoutButton) {

            checkoutButton.disabled =
                true;

        }


        updateSummary([]);

        return;

    }


    /* ========================================================
       HAS ITEMS
    ======================================================== */

    if (empty) {

        empty.style.display =
            "none";

    }


    if (continueShopping) {

        continueShopping.style.display =
            "block";

    }


    if (checkoutButton) {

        checkoutButton.disabled =
            false;

    }


    /* ========================================================
       RENDER ITEMS
    ======================================================== */

    cart.forEach(
        (item, index) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "cart-item";


            card.innerHTML = `

                <div class="cart-item-image">

                    <a
                        href="product.html?id=${encodeURIComponent(
                            item.id
                        )}"
                    >

                        <img
                            src="${escapeHTML(
                                item.image
                            )}"
                            alt="${escapeHTML(
                                item.name
                            )}"
                            loading="lazy"
                        >

                    </a>

                </div>


                <div class="cart-item-details">

                    <span class="cart-item-brand">

                        ${escapeHTML(
                            item.brand ||
                            "SoleAI"
                        )}

                    </span>


                    <h3>

                        <a
                            href="product.html?id=${encodeURIComponent(
                                item.id
                            )}"
                        >

                            ${escapeHTML(
                                item.name
                            )}

                        </a>

                    </h3>


                    <div class="cart-item-meta">

                        <span>
                            Size:
                            ${escapeHTML(
                                item.size ||
                                "8"
                            )}
                        </span>

                        <span>
                            Color:
                            ${escapeHTML(
                                item.color ||
                                "Black"
                            )}
                        </span>

                    </div>


                    <div class="cart-quantity">

                        <button
                            type="button"
                            data-action="decrease"
                            data-index="${index}"
                        >

                            <i class="bi bi-dash"></i>

                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            type="button"
                            data-action="increase"
                            data-index="${index}"
                        >

                            <i class="bi bi-plus"></i>

                        </button>

                    </div>


                    <button
                        type="button"
                        class="remove-item"
                        data-action="remove"
                        data-index="${index}"
                    >

                        <i class="bi bi-trash3"></i>

                        Remove

                    </button>

                </div>


                <div class="cart-item-price">

                    <strong>

                        ${formatPrice(
                            Number(item.price) *
                            Number(item.quantity)
                        )}

                    </strong>


                    <small>

                        ${formatPrice(
                            item.price
                        )}

                        each

                    </small>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );


    updateSummary(
        cart
    );

}


/* ============================================================
   UPDATE SUMMARY
============================================================ */

function updateSummary(cart) {

    let subtotal = 0;

    let totalItems = 0;


    cart.forEach(
        item => {

            const quantity =
                Number(
                    item.quantity
                ) || 0;

            const price =
                Number(
                    item.price
                ) || 0;


            subtotal +=
                price *
                quantity;


            totalItems +=
                quantity;

        }
    );


    const delivery =
        subtotal > 0
            ? 0
            : 0;


    const discount =
        0;


    const total =
        subtotal +
        delivery -
        discount;


    const subtotalElement =
        document.getElementById(
            "cart-subtotal"
        );

    const deliveryElement =
        document.getElementById(
            "cart-delivery"
        );

    const discountElement =
        document.getElementById(
            "cart-discount"
        );

    const totalElement =
        document.getElementById(
            "cart-total"
        );

    const countText =
        document.getElementById(
            "cart-count-text"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(
                subtotal
            );

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            "FREE";

    }


    if (discountElement) {

        discountElement.textContent =
            formatPrice(
                discount
            );

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(
                total
            );

    }


    if (countText) {

        countText.textContent =
            totalItems === 0
                ? "Your shopping cart is empty."
                : `${totalItems} ${
                    totalItems === 1
                        ? "item"
                        : "items"
                } in your cart.`;

    }

}


/* ============================================================
   CART ACTION
============================================================ */

async function handleCartAction(event) {

    const button =
        event.target.closest(
            "[data-action]"
        );


    if (!button) {

        return;

    }


    const action =
        button.dataset.action;


    const index =
        Number(
            button.dataset.index
        );


    const cart =
        await loadCart();


    const item =
        cart[index];


    if (!item) {

        return;

    }


    const token =
        getToken();


    /* ========================================================
       BACKEND CART
    ======================================================== */

    if (token) {

        try {

            if (
                action ===
                "increase"
            ) {

                await updateBackendCartItem(
                    item,
                    Number(
                        item.quantity
                    ) + 1
                );

            }


            if (
                action ===
                "decrease"
            ) {

                const newQuantity =
                    Number(
                        item.quantity
                    ) - 1;


                if (
                    newQuantity <= 0
                ) {

                    await removeBackendCartItem(
                        item
                    );

                } else {

                    await updateBackendCartItem(
                        item,
                        newQuantity
                    );

                }

            }


            if (
                action ===
                "remove"
            ) {

                await removeBackendCartItem(
                    item
                );

            }


            await renderCart();

            return;

        } catch (error) {

            console.error(
                "Cart action failed:",
                error
            );


            alert(
                error.message ||
                "Unable to update cart."
            );


            return;

        }

    }


    /* ========================================================
       GUEST CART
    ======================================================== */

    if (
        action ===
        "increase"
    ) {

        cart[index].quantity =
            Math.min(
                10,
                Number(
                    cart[index].quantity
                ) + 1
            );

    }


    if (
        action ===
        "decrease"
    ) {

        cart[index].quantity =
            Number(
                cart[index].quantity
            ) - 1;


        if (
            cart[index].quantity <= 0
        ) {

            cart.splice(
                index,
                1
            );

        }

    }


    if (
        action ===
        "remove"
    ) {

        cart.splice(
            index,
            1
        );

    }


    saveLocalCart(
        cart
    );


    await renderCart();

}


/* ============================================================
   UPDATE BACKEND CART ITEM
============================================================ */

async function updateBackendCartItem(
    item,
    quantity
) {

    const response =
        await fetch(
            `${API_URL}/update`,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${getToken()}`

                },

                body:
                    JSON.stringify({

                        productId:
                            item.productId ||
                            item.id,

                        size:
                            item.size,

                        color:
                            item.color,

                        quantity:
                            quantity

                    })

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Unable to update cart."
        );

    }


    /*
     * Keep local cart synchronized
     */

    if (
        data.cart
    ) {

        saveLocalCart(
            normalizeCart(
                data.cart
            )
        );

    }

}


/* ============================================================
   REMOVE BACKEND CART ITEM
============================================================ */

async function removeBackendCartItem(
    item
) {

    const response =
        await fetch(
            `${API_URL}/remove`,
            {

                method: "DELETE",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${getToken()}`

                },

                body:
                    JSON.stringify({

                        productId:
                            item.productId ||
                            item.id,

                        size:
                            item.size,

                        color:
                            item.color

                    })

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Unable to remove item."
        );

    }


    /*
     * Keep local cart synchronized
     */

    if (
        data.cart
    ) {

        saveLocalCart(
            normalizeCart(
                data.cart
            )
        );

    }

}


/* ============================================================
   CHECKOUT
============================================================ */

function initializeCheckout() {

    const button =
        document.getElementById(
            "checkout-btn"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        async () => {

            const cart =
                await loadCart();


            if (!cart.length) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            if (
                !isUserLoggedIn()
            ) {

                redirectToLogin();

                return;

            }


            window.location.href =
                "./checkout.html";

        }
    );

}


/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHTML(value) {

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


/* ============================================================
   START
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderCart();

        initializeCheckout();


        const cartContainer =
            document.getElementById(
                "cart-items"
            );


        if (cartContainer) {

            cartContainer.addEventListener(
                "click",
                handleCartAction
            );

        }

    }
);
