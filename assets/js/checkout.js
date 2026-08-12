"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       API
    ========================================== */

    const API_URL =
        "http://localhost:5000/api";

    const CART_API_URL =
        `${API_URL}/cart`;

    const ORDER_API_URL =
        `${API_URL}/orders`;

    const TOKEN_KEY =
        "soleaiToken";


    /* ==========================================
       ELEMENTS
    ========================================== */

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

    const aiButton =
        document.getElementById("ai-button");


    /* ==========================================
       TOKEN
    ========================================== */

    function getToken() {

        return localStorage.getItem(
            TOKEN_KEY
        );

    }


    /* ==========================================
       MONEY
    ========================================== */

    function money(value) {

        return "₹" +
            Math.round(
                Number(value) || 0
            ).toLocaleString("en-IN");

    }


    /* ==========================================
       MESSAGE
    ========================================== */

    function showMessage(
        text,
        type
    ) {

        if (!message) {
            return;
        }

        message.textContent =
            text;

        message.className =
            "message " +
            (type || "error");

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


    /* ==========================================
       CHECK LOGIN
    ========================================== */

    const token =
        getToken();


    if (!token) {

        showMessage(
            "Please login before checkout."
        );


        setTimeout(
            function () {

                window.location.href =
                    "./login.html";

            },
            1000
        );


        return;

    }


    /* ==========================================
       LOAD CART FROM MONGODB
    ========================================== */

    let cart = [];


    async function loadCart() {

        try {

            const response =
                await fetch(
                    CART_API_URL,
                    {
                        method: "GET",

                        headers: {

                            "Authorization":
                                `Bearer ${getToken()}`

                        }

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

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


                throw new Error(
                    data.message ||
                    "Unable to load cart."
                );

            }


            if (
                data.cart &&
                Array.isArray(
                    data.cart.items
                )
            ) {

                cart =
                    data.cart.items.map(
                        function (item) {

                            return {

                                id:
                                    item.productId,

                                productId:
                                    item.productId,

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
                    );

            } else {

                cart = [];

            }


            renderProducts();

            updateSummary();


            if (!cart.length) {

                if (placeOrder) {

                    placeOrder.disabled =
                        true;

                }

                showMessage(
                    "Your cart is empty."
                );

            }


        } catch (error) {

            console.error(
                "Cart loading error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to load your cart."
            );

        }

    }


    /* ==========================================
       CALCULATE
    ========================================== */

    function calculate() {

        let sub = 0;

        let count = 0;


        cart.forEach(
            function (item) {

                sub +=
                    Number(item.price) *
                    Number(item.quantity);

                count +=
                    Number(item.quantity);

            }
        );


        /*
         * Keep the same checkout pricing
         * logic from your existing page.
         */

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
            taxable + gst;


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
                count,

            delivery:
                deliveryType

        };

    }


    /* ==========================================
       RENDER PRODUCTS
    ========================================== */

    function renderProducts() {

        if (!orderItems) {
            return;
        }


        orderItems.innerHTML =
            "";


        if (!cart.length) {

            const empty =
                document.createElement(
                    "p"
                );


            empty.textContent =
                "Your cart is empty.";


            empty.style.color =
                "#888888";


            empty.style.fontSize =
                "13px";


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

                const imageBox =
                    document.createElement(
                        "div"
                    );


                imageBox.className =
                    "order-image";


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


                image.addEventListener(
                    "error",
                    function () {

                        this.style.display =
                            "none";

                    }
                );


                imageBox.appendChild(
                    image
                );


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


                const quantity =
                    document.createElement(
                        "p"
                    );


                quantity.textContent =
                    "Qty: " +
                    item.quantity;


                info.appendChild(
                    name
                );


                info.appendChild(
                    quantity
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
                        item.price *
                        item.quantity
                    );


                row.appendChild(
                    imageBox
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


    /* ==========================================
       UPDATE SUMMARY
    ========================================== */

    function updateSummary() {

        const data =
            calculate();


        if (itemCount) {

            itemCount.textContent =
                data.count +
                (
                    data.count === 1
                        ? " Item"
                        : " Items"
                );

        }


        if (subtotal) {

            subtotal.textContent =
                money(
                    data.subtotal
                );

        }


        if (discount) {

            discount.textContent =
                "- " +
                money(
                    data.discount
                );

        }


        if (shipping) {

            shipping.textContent =
                data.shipping === 0
                    ? "Free"
                    : money(
                        data.shipping
                    );

        }


        if (tax) {

            tax.textContent =
                money(
                    data.tax
                );

        }


        if (total) {

            total.textContent =
                money(
                    data.total
                );

        }

    }


    /* ==========================================
       DELIVERY CHANGE
    ========================================== */

    document
        .querySelectorAll(
            'input[name="delivery"]'
        )
        .forEach(
            function (input) {

                input.addEventListener(
                    "change",
                    updateSummary
                );

            }
        );


    /* ==========================================
       EMAIL VALIDATION
    ========================================== */

    function validEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(value);

    }


    /* ==========================================
       VALIDATE CHECKOUT
    ========================================== */

    function validate() {

        clearMessage();


        if (
            !email ||
            !email.value.trim() ||
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


        const phoneValue =
            phone.value
                .replace(
                    /\D/g,
                    ""
                );


        if (
            !/^\d{10}$/.test(
                phoneValue
            )
        ) {

            showMessage(
                "Please enter a valid 10-digit phone number."
            );


            phone.focus();


            return false;

        }


        if (!firstName.value.trim()) {

            showMessage(
                "Please enter your first name."
            );


            firstName.focus();


            return false;

        }


        if (!lastName.value.trim()) {

            showMessage(
                "Please enter your last name."
            );


            lastName.focus();


            return false;

        }


        if (!address.value.trim()) {

            showMessage(
                "Please enter your address."
            );


            address.focus();


            return false;

        }


        if (!city.value.trim()) {

            showMessage(
                "Please enter your city."
            );


            city.focus();


            return false;

        }


        if (!state.value.trim()) {

            showMessage(
                "Please enter your state."
            );


            state.focus();


            return false;

        }


        if (
            !/^\d{6}$/.test(
                pincode.value.trim()
            )
        ) {

            showMessage(
                "Please enter a valid 6-digit PIN code."
            );


            pincode.focus();


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


    /* ==========================================
       PLACE REAL ORDER
    ========================================== */

    async function placeRealOrder() {

        if (!cart.length) {

            showMessage(
                "Your cart is empty."
            );


            return;

        }


        if (!validate()) {

            return;

        }


        const currentToken =
            getToken();


        if (!currentToken) {

            showMessage(
                "Your session has expired. Please login again."
            );


            setTimeout(
                function () {

                    window.location.href =
                        "./login.html";

                },
                1000
            );


            return;

        }


        /* ==========================================
           PAYMENT METHOD
        ========================================== */

        const selectedPayment =
            document.querySelector(
                'input[name="payment"]:checked'
            );


        let paymentMethod =
            selectedPayment
                ? selectedPayment.value
                : "COD";


        /*
         * Backend accepts:
         * COD
         * ONLINE
         */

        const paymentValue =
            String(
                paymentMethod
            ).toUpperCase();


        paymentMethod =
            paymentValue === "ONLINE"
                ? "ONLINE"
                : "COD";


        /* ==========================================
           ADDRESS
        ========================================== */

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


        /* ==========================================
           BUTTON LOADING
        ========================================== */

        if (placeOrder) {

            placeOrder.disabled =
                true;


            placeOrder.innerHTML =
                "Placing Order...";

        }


        clearMessage();


        try {

            /* ==========================================
               SEND ORDER TO MONGODB
            ========================================== */

            const response =
                await fetch(
                    ORDER_API_URL,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${currentToken}`

                        },

                        body:
                            JSON.stringify({

                                shippingAddress:

                                    shippingAddress,

                                paymentMethod:

                                    paymentMethod

                            })

                    }
                );


            const data =
                await response.json();


            console.log(
                "ORDER API RESPONSE:",
                data
            );


            /* ==========================================
               AUTH ERROR
            ========================================== */

            if (
                response.status === 401
            ) {

                localStorage.removeItem(
                    TOKEN_KEY
                );


                showMessage(
                    "Your session has expired. Please login again."
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "./login.html";

                    },
                    1000
                );


                return;

            }


            /* ==========================================
               ORDER ERROR
            ========================================== */

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to place order."
                );

            }


            /* ==========================================
               SUCCESS
            ========================================== */

            if (
                !data.success ||
                !data.order
            ) {

                throw new Error(
                    "Invalid order response from server."
                );

            }


            console.log(
                "ORDER CREATED:",
                data.order
            );


            /* ==========================================
               SAVE CURRENT ORDER FOR SUCCESS PAGE
               Only for displaying confirmation.
               MongoDB remains the source of truth.
            ========================================== */

            try {

                localStorage.setItem(
                    "soleai_current_order",
                    JSON.stringify(
                        data.order
                    )
                );

            } catch (error) {

                console.error(
                    "Could not save order confirmation:",
                    error
                );

            }


            /* ==========================================
               SUCCESS MESSAGE
            ========================================== */

            showMessage(
                "Order placed successfully.",
                "success"
            );


            /* ==========================================
               REDIRECT
            ========================================== */

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
                "Unable to place order. Please try again."
            );


            if (placeOrder) {

                placeOrder.disabled =
                    false;


                placeOrder.innerHTML =
                    'Place Order <span>→</span>';

            }

        }

    }


    /* ==========================================
       PLACE ORDER BUTTON
    ========================================== */

    if (placeOrder) {

        placeOrder.addEventListener(
            "click",
            placeRealOrder
        );

    }


    /* ==========================================
       AI BUTTON
    ========================================== */

    if (aiButton) {

        aiButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "./ai-assistant.html";

            }
        );

    }


    /* ==========================================
       INITIALIZE
    ========================================== */

    loadCart();

});