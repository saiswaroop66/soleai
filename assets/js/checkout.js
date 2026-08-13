"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       API
    ========================================================= */

    const API_BASE =
        "https://soleai-backend.onrender.com/api";

    const CART_API =
        `${API_BASE}/cart`;

    const ORDER_API =
        `${API_BASE}/orders`;

    const TOKEN_KEY =
        "soleaiToken";


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const firstName =
        document.getElementById("first-name");

    const lastName =
        document.getElementById("last-name");

    const address =
        document.getElementById("address");

    const city =
        document.getElementById("city");

    const state =
        document.getElementById("state");

    const pincode =
        document.getElementById("pincode");

    const placeOrder =
        document.getElementById("place-order");

    const terms =
        document.getElementById("terms");

    const orderItems =
        document.getElementById("order-items");

    const itemCount =
        document.getElementById("item-count");

    const subtotal =
        document.getElementById("subtotal");

    const discount =
        document.getElementById("discount");

    const shipping =
        document.getElementById("shipping");

    const tax =
        document.getElementById("tax");

    const total =
        document.getElementById("total");

    const message =
        document.getElementById("message");


    /* =========================================================
       CART
    ========================================================= */

    let cart = [];


    /* =========================================================
       TOKEN
    ========================================================= */

    function getToken() {

        return localStorage.getItem(
            TOKEN_KEY
        );

    }


    /* =========================================================
       MONEY
    ========================================================= */

    function money(value) {

        return "₹" +
            Math.round(
                Number(value) || 0
            ).toLocaleString("en-IN");

    }


    /* =========================================================
       MESSAGE
    ========================================================= */

    function showMessage(
        text,
        type = "error"
    ) {

        if (!message) {
            return;
        }

        message.textContent =
            text;

        message.className =
            `message ${type}`;

    }


    function clearMessage() {

        if (!message) {
            return;
        }

        message.textContent =
            "";

        message.className =
            "message";

    }


    /* =========================================================
       NORMALIZE CART ITEM
    ========================================================= */

    function normalizeItem(item) {

        return {

            id:
                item.productId ||
                item.id ||
                "",

            productId:
                item.productId ||
                item.id ||
                "",

            name:
                item.name ||
                "SoleAI Product",

            brand:
                item.brand ||
                "SoleAI",

            price:
                Number(
                    item.price
                ) || 0,

            originalPrice:
                Number(
                    item.originalPrice
                ) || 0,

            image:
                item.image ||
                "",

            size:
                item.size ||
                "",

            color:
                item.color ||
                "",

            quantity:
                Math.max(
                    1,
                    Number(
                        item.quantity
                    ) || 1
                )

        };

    }


    /* =========================================================
       LOCAL STORAGE CART
    ========================================================= */

    function getLocalCart() {

        try {

            const saved =
                localStorage.getItem(
                    "soleai_cart"
                );


            if (!saved) {

                return [];

            }


            const parsed =
                JSON.parse(saved);


            if (
                Array.isArray(parsed)
            ) {

                return parsed.map(
                    normalizeItem
                );

            }


            if (
                parsed &&
                Array.isArray(
                    parsed.items
                )
            ) {

                return parsed.items.map(
                    normalizeItem
                );

            }


            return [];

        } catch (error) {

            console.error(
                "Local cart error:",
                error
            );

            return [];

        }

    }


    /* =========================================================
       SAVE LOCAL CART
    ========================================================= */

    function saveLocalCart(items) {

        try {

            localStorage.setItem(
                "soleai_cart",
                JSON.stringify(
                    items
                )
            );

        } catch (error) {

            console.error(
                "Save local cart error:",
                error
            );

        }

    }


    /* =========================================================
       LOAD CART FROM MONGODB
    ========================================================= */

    async function loadBackendCart() {

        const token =
            getToken();


        if (!token) {

            throw new Error(
                "User is not logged in."
            );

        }


        const response =
            await fetch(
                CART_API,
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
                "Invalid response from backend."
            );

        }


        console.log(
            "SoleAI Backend Cart:",
            data
        );


        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                TOKEN_KEY
            );


            window.location.href =
                "./login.html";


            return [];

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load cart."
            );

        }


        if (
            data &&
            data.cart &&
            Array.isArray(
                data.cart.items
            )
        ) {

            return data.cart.items.map(
                normalizeItem
            );

        }


        return [];

    }


    /* =========================================================
       LOAD CART
    ========================================================= */

    async function loadCart() {

        console.log(
            "========== SOLEAI CHECKOUT =========="
        );


        /*
         * STEP 1
         * Try MongoDB.
         */

        try {

            const backendCart =
                await loadBackendCart();


            console.log(
                "MongoDB cart:",
                backendCart
            );


            if (
                backendCart.length > 0
            ) {

                cart =
                    backendCart;


                /*
                 * Synchronize localStorage.
                 */

                saveLocalCart(
                    cart
                );


                console.log(
                    "Using MongoDB cart ✅"
                );


                renderProducts();

                updateSummary();

                enableOrderButton();

                clearMessage();

                return;

            }

        } catch (error) {

            console.error(
                "MongoDB cart failed:",
                error
            );

        }


        /*
         * STEP 2
         * MongoDB empty/failed.
         * Try localStorage.
         */

        const localCart =
            getLocalCart();


        console.log(
            "LocalStorage cart:",
            localCart
        );


        if (
            localCart.length > 0
        ) {

            cart =
                localCart;


            console.log(
                "Using localStorage cart ✅"
            );


            renderProducts();

            updateSummary();

            enableOrderButton();

            clearMessage();

            return;

        }


        /*
         * STEP 3
         * Nothing found.
         */

        cart = [];


        console.log(
            "NO CART ITEMS FOUND ❌"
        );


        renderProducts();

        updateSummary();

        disableOrderButton();


        showMessage(
            "Your cart is empty."
        );

    }


    /* =========================================================
       ENABLE ORDER BUTTON
    ========================================================= */

    function enableOrderButton() {

        if (!placeOrder) {
            return;
        }

        placeOrder.disabled =
            false;

        placeOrder.style.opacity =
            "1";

        placeOrder.style.cursor =
            "pointer";

    }


    /* =========================================================
       DISABLE ORDER BUTTON
    ========================================================= */

    function disableOrderButton() {

        if (!placeOrder) {
            return;
        }

        placeOrder.disabled =
            true;

        placeOrder.style.opacity =
            "0.6";

        placeOrder.style.cursor =
            "not-allowed";

    }


    /* =========================================================
       RENDER PRODUCTS
    ========================================================= */

    function renderProducts() {

        if (!orderItems) {

            console.warn(
                "order-items element not found."
            );

            return;

        }


        orderItems.innerHTML =
            "";


        if (
            cart.length === 0
        ) {

            const empty =
                document.createElement(
                    "p"
                );


            empty.textContent =
                "Your cart is empty.";


            orderItems.appendChild(
                empty
            );


            return;

        }


        cart.forEach(
            function (item) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "order-item";


                /* IMAGE */

                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    item.image;

                image.alt =
                    item.name;

                image.loading =
                    "lazy";


                image.onerror =
                    function () {

                        this.style.display =
                            "none";

                    };


                /* INFO */

                const info =
                    document.createElement(
                        "div"
                    );


                info.className =
                    "order-info";


                const name =
                    document.createElement(
                        "h3"
                    );


                name.textContent =
                    item.name;


                const details =
                    document.createElement(
                        "p"
                    );


                details.textContent =
                    `Size: ${
                        item.size || "-"
                    } | Color: ${
                        item.color || "-"
                    } | Qty: ${
                        item.quantity
                    }`;


                info.appendChild(
                    name
                );

                info.appendChild(
                    details
                );


                /* PRICE */

                const price =
                    document.createElement(
                        "strong"
                    );


                price.className =
                    "order-price";


                price.textContent =
                    money(
                        Number(
                            item.price
                        ) *
                        Number(
                            item.quantity
                        )
                    );


                row.appendChild(
                    image
                );

                row.appendChild(
                    info
                );

                row.appendChild(
                    price
                );


                orderItems.appendChild(
                    row
                );

            }
        );

    }


    /* =========================================================
       CALCULATE SUMMARY
    ========================================================= */

    function calculateSummary() {

        let sub =
            0;

        let count =
            0;


        cart.forEach(
            function (item) {

                const price =
                    Number(
                        item.price
                    ) || 0;


                const quantity =
                    Number(
                        item.quantity
                    ) || 1;


                sub +=
                    price *
                    quantity;


                count +=
                    quantity;

            }
        );


        const discountAmount =
            sub >= 5000
                ? Math.round(
                    sub * 0.05
                )
                : 0;


        const delivery =
            document.querySelector(
                'input[name="delivery"]:checked'
            );


        const deliveryType =
            delivery
                ? delivery.value
                : "standard";


        const shippingAmount =
            deliveryType === "express"
                ? 199
                : 0;


        const taxable =
            Math.max(
                0,
                sub -
                discountAmount +
                shippingAmount
            );


        const gst =
            Math.round(
                taxable * 0.18
            );


        const finalTotal =
            taxable +
            gst;


        return {

            subtotal:
                sub,

            discount:
                discountAmount,

            shipping:
                shippingAmount,

            tax:
                gst,

            total:
                finalTotal,

            count:
                count

        };

    }


    /* =========================================================
       UPDATE SUMMARY
    ========================================================= */

    function updateSummary() {

        const summary =
            calculateSummary();


        if (itemCount) {

            itemCount.textContent =
                `${summary.count} ${
                    summary.count === 1
                        ? "Item"
                        : "Items"
                }`;

        }


        if (subtotal) {

            subtotal.textContent =
                money(
                    summary.subtotal
                );

        }


        if (discount) {

            discount.textContent =
                "- " +
                money(
                    summary.discount
                );

        }


        if (shipping) {

            shipping.textContent =
                summary.shipping === 0
                    ? "Free"
                    : money(
                        summary.shipping
                    );

        }


        if (tax) {

            tax.textContent =
                money(
                    summary.tax
                );

        }


        if (total) {

            total.textContent =
                money(
                    summary.total
                );

        }

    }


    /* =========================================================
       DELIVERY CHANGE
    ========================================================= */

    document
        .querySelectorAll(
            'input[name="delivery"]'
        )
        .forEach(
            function (input) {

                input.addEventListener(
                    "change",
                    function () {

                        updateSummary();

                    }
                );

            }
        );


    /* =========================================================
       VALID EMAIL
    ========================================================= */

    function validEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(value);

    }


    /* =========================================================
       VALIDATE CHECKOUT
    ========================================================= */

    function validateCheckout() {

        clearMessage();


        if (
            !email ||
            !validEmail(
                email.value.trim()
            )
        ) {

            showMessage(
                "Please enter a valid email address."
            );

            email?.focus();

            return false;

        }


        const phoneNumber =
            phone
                ? phone.value.replace(
                    /\D/g,
                    ""
                )
                : "";


        if (
            !/^\d{10}$/.test(
                phoneNumber
            )
        ) {

            showMessage(
                "Please enter a valid 10-digit phone number."
            );

            phone?.focus();

            return false;

        }


        if (
            !firstName ||
            !firstName.value.trim()
        ) {

            showMessage(
                "Please enter your first name."
            );

            firstName?.focus();

            return false;

        }


        if (
            !lastName ||
            !lastName.value.trim()
        ) {

            showMessage(
                "Please enter your last name."
            );

            lastName?.focus();

            return false;

        }


        if (
            !address ||
            !address.value.trim()
        ) {

            showMessage(
                "Please enter your address."
            );

            address?.focus();

            return false;

        }


        if (
            !city ||
            !city.value.trim()
        ) {

            showMessage(
                "Please enter your city."
            );

            city?.focus();

            return false;

        }


        if (
            !state ||
            !state.value.trim()
        ) {

            showMessage(
                "Please enter your state."
            );

            state?.focus();

            return false;

        }


        if (
            !pincode ||
            !/^\d{6}$/.test(
                pincode.value.trim()
            )
        ) {

            showMessage(
                "Please enter a valid 6-digit PIN code."
            );

            pincode?.focus();

            return false;

        }


        if (
            terms &&
            !terms.checked
        ) {

            showMessage(
                "Please accept the checkout terms."
            );

            terms.focus();

            return false;

        }


        return true;

    }


    /* =========================================================
       PLACE ORDER
    ========================================================= */

    async function placeOrderNow() {

        /*
         * Make sure cart is available.
         */

        if (
            cart.length === 0
        ) {

            await loadCart();

        }


        if (
            cart.length === 0
        ) {

            showMessage(
                "Your cart is empty."
            );

            return;

        }


        if (
            !validateCheckout()
        ) {

            return;

        }


        const token =
            getToken();


        if (!token) {

            showMessage(
                "Please login again."
            );

            return;

        }


        const selectedPayment =
            document.querySelector(
                'input[name="payment"]:checked'
            );


        const paymentMethod =
            selectedPayment
                ? String(
                    selectedPayment.value
                ).toUpperCase()
                : "COD";


        const summary =
            calculateSummary();


        const shippingAddress = {

            fullName:
                `${firstName.value.trim()} ${lastName.value.trim()}`,

            phone:
                phone.value.trim(),

            address:
                address.value.trim(),

            city:
                city.value.trim(),

            state:
                state.value.trim(),

            pincode:
                pincode.value.trim()

        };


        if (placeOrder) {

            placeOrder.disabled =
                true;

            placeOrder.innerHTML =
                "Placing Order...";

        }


        try {

            const response =
                await fetch(
                    ORDER_API,
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

                                shippingAddress:
                                    shippingAddress,

                                paymentMethod:
                                    paymentMethod,

                                subtotal:
                                    summary.subtotal,

                                discount:
                                    summary.discount,

                                shipping:
                                    summary.shipping,

                                tax:
                                    summary.tax,

                                total:
                                    summary.total

                            })

                    }
                );


            const data =
                await response.json();


            console.log(
                "SoleAI ORDER RESPONSE:",
                data
            );


            if (
                response.status === 401
            ) {

                localStorage.removeItem(
                    TOKEN_KEY
                );


                window.location.href =
                    "./login.html";


                return;

            }


            if (
                !response.ok
            ) {

                throw new Error(
                    data.message ||
                    "Unable to place order."
                );

            }


            if (
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Order failed."
                );

            }


            /*
             * Save order.
             */

            if (
                data.order
            ) {

                localStorage.setItem(
                    "soleai_current_order",
                    JSON.stringify(
                        data.order
                    )
                );

            }


            /*
             * Clear frontend cart.
             */

            saveLocalCart([]);


            showMessage(
                "Order placed successfully.",
                "success"
            );


            setTimeout(
                function () {

                    window.location.href =
                        "./order-success.html";

                },
                800
            );


        } catch (error) {

            console.error(
                "Place order error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to place order."
            );


            if (placeOrder) {

                placeOrder.disabled =
                    false;

                placeOrder.innerHTML =
                    "Place Demo Order →";

            }

        }

    }


    /* =========================================================
       BUTTON
    ========================================================= */

    if (placeOrder) {

        placeOrder.addEventListener(
            "click",
            placeOrderNow
        );

    }


    /* =========================================================
       START
    ========================================================= */

    loadCart();

});
