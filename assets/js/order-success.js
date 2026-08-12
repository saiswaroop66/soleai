"use strict";

document.addEventListener("DOMContentLoaded", async function () {

    /* ==========================================
       API
    ========================================== */

    const API_URL =
         "https://soleai-backend.onrender.com/api";

    const ORDER_API_URL =
        `${API_URL}/orders`;

    const TOKEN_KEY =
        "soleaiToken";

    const CURRENT_ORDER_KEY =
        "soleai_current_order";


    /* ==========================================
       ELEMENTS
    ========================================== */

    const orderIdElement =
        document.getElementById("order-id");

    const copyOrderIdButton =
        document.getElementById("copy-order-id");

    const orderStatusElement =
        document.getElementById("order-status");

    const orderItemsContainer =
        document.getElementById(
            "success-order-items"
        );

    const subtotalElement =
        document.getElementById(
            "success-subtotal"
        );

    const discountElement =
        document.getElementById(
            "success-discount"
        );

    const shippingElement =
        document.getElementById(
            "success-shipping"
        );

    const taxElement =
        document.getElementById(
            "success-tax"
        );

    const totalElement =
        document.getElementById(
            "success-total"
        );

    const shippingAddressElement =
        document.getElementById(
            "shipping-address"
        );

    const deliveryMethodElement =
        document.getElementById(
            "delivery-method"
        );

    const deliveryDateElement =
        document.getElementById(
            "delivery-date"
        );

    const paymentMethodElement =
        document.getElementById(
            "payment-method"
        );

    const confirmedDateElement =
        document.getElementById(
            "confirmed-date"
        );

    const recommendationsContainer =
        document.getElementById(
            "success-recommendations"
        );

    const newsletterForm =
        document.getElementById(
            "newsletter-form"
        );

    const newsletterEmail =
        document.getElementById(
            "newsletter-email"
        );

    const backToTop =
        document.getElementById(
            "backToTop"
        );


    /* ==========================================
       HELPERS
    ========================================== */

    function formatPrice(value) {

        return "₹" +
            Math.round(
                Number(value) || 0
            ).toLocaleString("en-IN");

    }


    function formatDate(value) {

        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Date unavailable";

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    function safeText(
        value,
        fallback = ""
    ) {

        if (
            value === null ||
            value === undefined
        ) {

            return fallback;

        }


        return String(value);

    }


    /* ==========================================
       GET TOKEN
    ========================================== */

    const token =
        localStorage.getItem(
            TOKEN_KEY
        );


    if (!token) {

        showMessage(
            "Please login to view your order."
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
       GET SAVED ORDER ID
    ========================================== */

    let savedOrder = null;


    try {

        savedOrder =
            JSON.parse(
                localStorage.getItem(
                    CURRENT_ORDER_KEY
                )
            );

    } catch (error) {

        console.error(
            "Saved order error:",
            error
        );

    }


    const savedOrderId =
        savedOrder?.id ||
        savedOrder?._id;


    /* ==========================================
       LOAD ORDER FROM MONGODB
    ========================================== */

    async function loadOrder() {

        try {

            let order;


            /* ======================================
               IF WE HAVE ORDER ID
            ====================================== */

            if (savedOrderId) {

                const response =
                    await fetch(
                        `${ORDER_API_URL}/${encodeURIComponent(
                            savedOrderId
                        )}`,
                        {

                            method: "GET",

                            headers: {

                                "Authorization":
                                    `Bearer ${token}`

                            }

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to load order."
                    );

                }


                order =
                    data.order;

            }


            /* ======================================
               FALLBACK: GET LATEST ORDER
            ====================================== */

            else {

                const response =
                    await fetch(
                        ORDER_API_URL,
                        {

                            method: "GET",

                            headers: {

                                "Authorization":
                                    `Bearer ${token}`

                            }

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to load orders."
                    );

                }


                if (
                    !data.orders ||
                    !data.orders.length
                ) {

                    throw new Error(
                        "No orders found."
                    );

                }


                order =
                    data.orders[0];

            }


            if (!order) {

                throw new Error(
                    "Order information not found."
                );

            }


            console.log(
                "ORDER FROM MONGODB:",
                order
            );


            renderOrder(
                order
            );


        } catch (error) {

            console.error(
                "Order loading error:",
                error
            );


            /*
             * Fallback to saved order if
             * API request fails.
             */

            if (savedOrder) {

                console.warn(
                    "Using locally saved order as fallback."
                );


                renderOrder(
                    savedOrder
                );


            } else {

                showMessage(
                    error.message ||
                    "Unable to load your order."
                );

            }

        }

    }


    /* ==========================================
       RENDER ORDER
    ========================================== */

    function renderOrder(
        order
    ) {

        /* ======================================
           ORDER ID
        ====================================== */

        const orderId =
            safeText(
                order._id ||
                order.id,
                "ORDER"
            );


        if (orderIdElement) {

            orderIdElement.textContent =
                orderId;

        }


        /* ======================================
           STATUS
        ====================================== */

        const status =
            safeText(
                order.orderStatus ||
                order.status,
                "PLACED"
            );


        if (orderStatusElement) {

            orderStatusElement.textContent =
                formatStatus(
                    status
                );

        }


        /* ======================================
           DATE
        ====================================== */

        const orderDate =
            order.createdAt ||
            new Date().toISOString();


        if (confirmedDateElement) {

            confirmedDateElement.textContent =
                formatDate(
                    orderDate
                );

        }


        /* ======================================
           ITEMS
        ====================================== */

        const items =
            Array.isArray(
                order.items
            )
                ? order.items
                : [];


        renderOrderItems(
            items
        );


        /* ======================================
           PRICING
        ====================================== */

        const subtotal =
            Number(
                order.subtotal
            ) || 0;


        const discount =
            Number(
                order.discount
            ) || 0;


        const delivery =
            Number(
                order.delivery
            ) || 0;


        const total =
            Number(
                order.total
            ) || 0;


        /*
         * Your backend currently stores
         * the final total but does not have
         * a separate GST field.
         *
         * Therefore calculate the displayed
         * GST from the stored values.
         */

        const gst =
            Math.max(
                0,
                total -
                subtotal +
                discount -
                delivery
            );


        if (subtotalElement) {

            subtotalElement.textContent =
                formatPrice(
                    subtotal
                );

        }


        if (discountElement) {

            discountElement.textContent =
                "- " +
                formatPrice(
                    discount
                );

        }


        if (shippingElement) {

            shippingElement.textContent =
                delivery === 0
                    ? "Free"
                    : formatPrice(
                        delivery
                    );

        }


        if (taxElement) {

            taxElement.textContent =
                formatPrice(
                    gst
                );

        }


        if (totalElement) {

            totalElement.textContent =
                formatPrice(
                    total
                );

        }


        /* ======================================
           SHIPPING ADDRESS
        ====================================== */

        renderShippingAddress(
            order.shippingAddress
        );


        /* ======================================
           DELIVERY
        ====================================== */

        if (deliveryMethodElement) {

            deliveryMethodElement.textContent =
                "Standard Delivery";

        }


        if (deliveryDateElement) {

            const deliveryDate =
                new Date(
                    orderDate
                );


            deliveryDate.setDate(
                deliveryDate.getDate() + 5
            );


            deliveryDateElement.textContent =
                formatDate(
                    deliveryDate
                );

        }


        /* ======================================
           PAYMENT
        ====================================== */

        if (paymentMethodElement) {

            const payment =
                safeText(
                    order.paymentMethod,
                    "COD"
                ).toUpperCase();


            if (
                payment === "COD"
            ) {

                paymentMethodElement.textContent =
                    "Cash on Delivery";

            } else {

                paymentMethodElement.textContent =
                    "Online Payment";

            }

        }


        /* ======================================
           COPY ORDER ID
        ====================================== */

        setupCopyButton(
            orderId
        );


        /* ======================================
           RECOMMENDATIONS
        ====================================== */

        renderRecommendations();


        /* ======================================
           REMOVE OLD LOCAL CART
        ====================================== */

        localStorage.removeItem(
            "soleai_cart"
        );

        localStorage.removeItem(
            "soleai_checkout_cart"
        );

    }


    /* ==========================================
       RENDER ITEMS
    ========================================== */

    function renderOrderItems(
        products
    ) {

        if (!orderItemsContainer) {

            return;

        }


        orderItemsContainer.innerHTML =
            "";


        if (!products.length) {

            const message =
                document.createElement(
                    "p"
                );


            message.textContent =
                "No products found in this order.";


            orderItemsContainer.appendChild(
                message
            );


            return;

        }


        products.forEach(
            function (product) {

                createOrderItem(
                    product
                );

            }
        );

    }


    /* ==========================================
       CREATE ORDER ITEM
    ========================================== */

    function createOrderItem(
        product
    ) {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "success-order-item";


        /* IMAGE */

        const imageWrapper =
            document.createElement(
                "div"
            );


        imageWrapper.className =
            "success-item-image";


        const image =
            document.createElement(
                "img"
            );


        image.src =
            safeText(
                product.image,
                "./assets/images/products/shoe1.png"
            );


        image.alt =
            safeText(
                product.name,
                "SoleAI Product"
            );


        image.loading =
            "lazy";


        image.addEventListener(
            "error",
            function () {

                this.src =
                    "./assets/images/products/shoe1.png";

            }
        );


        imageWrapper.appendChild(
            image
        );


        /* INFO */

        const info =
            document.createElement(
                "div"
            );


        info.className =
            "success-item-info";


        const name =
            document.createElement(
                "h3"
            );


        name.textContent =
            safeText(
                product.name,
                "SoleAI Product"
            );


        const details =
            document.createElement(
                "p"
            );


        const quantity =
            Number(
                product.quantity
            ) || 1;


        details.textContent =
            `Qty: ${quantity}`;


        if (
            product.size ||
            product.color
        ) {

            details.textContent +=
                ` • Size: ${
                    product.size || "-"
                } • Color: ${
                    product.color || "-"
                }`;

        }


        const price =
            document.createElement(
                "strong"
            );


        price.textContent =
            formatPrice(
                Number(
                    product.price
                ) *
                quantity
            );


        info.appendChild(
            name
        );


        info.appendChild(
            details
        );


        info.appendChild(
            price
        );


        item.appendChild(
            imageWrapper
        );


        item.appendChild(
            info
        );


        orderItemsContainer.appendChild(
            item
        );

    }


    /* ==========================================
       SHIPPING ADDRESS
    ========================================== */

    function renderShippingAddress(
        shippingAddress
    ) {

        if (!shippingAddressElement) {

            return;

        }


        if (!shippingAddress) {

            shippingAddressElement.textContent =
                "Address not available";

            return;

        }


        const parts = [

            shippingAddress.fullName,

            shippingAddress.address,

            shippingAddress.city,

            shippingAddress.state,

            shippingAddress.pincode,

            shippingAddress.phone

        ].filter(
            Boolean
        );


        shippingAddressElement.textContent =
            parts.length
                ? parts.join(", ")
                : "Address not available";

    }


    /* ==========================================
       FORMAT STATUS
    ========================================== */

    function formatStatus(
        status
    ) {

        return safeText(
            status,
            "Placed"
        )
            .toLowerCase()
            .replace(
                /\b\w/g,
                function (letter) {

                    return letter.toUpperCase();

                }
            );

    }


    /* ==========================================
       COPY ORDER ID
    ========================================== */

    function setupCopyButton(
        orderId
    ) {

        if (!copyOrderIdButton) {

            return;

        }


        copyOrderIdButton.onclick =
            async function () {

                try {

                    await navigator.clipboard.writeText(
                        orderId
                    );


                    showMessage(
                        "Order ID copied!"
                    );


                } catch {

                    fallbackCopy(
                        orderId
                    );

                }

            };

    }


    function fallbackCopy(
        text
    ) {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.style.position =
            "fixed";


        textarea.style.left =
            "-9999px";


        document.body.appendChild(
            textarea
        );


        textarea.select();


        try {

            document.execCommand(
                "copy"
            );


            showMessage(
                "Order ID copied!"
            );

        } catch {

            showMessage(
                "Unable to copy order ID."
            );

        }


        document.body.removeChild(
            textarea
        );

    }


    /* ==========================================
       RECOMMENDATIONS
    ========================================== */

    function renderRecommendations() {

        if (!recommendationsContainer) {

            return;

        }


        const recommendations = [

            {
                name:
                    "SoleAI UrbanRush",

                price:
                    6999,

                image:
                    "./assets/images/products/download13.png"

            },

            {
                name:
                    "SoleAI CloudStep Max",

                price:
                    4999,

                image:
                    "./assets/images/products/download9.png"

            },

            {
                name:
                    "SoleAI Velocity Pro",

                price:
                    6499,

                image:
                    "./assets/images/products/download5.png"

            },

            {
                name:
                    "SoleAI AirFlex X1",

                price:
                    6999,

                image:
                    "./assets/images/products/download1.png"

            }

        ];


        recommendationsContainer.innerHTML =
            "";


        recommendations.forEach(
            function (product) {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "product-card";


                const imageWrapper =
                    document.createElement(
                        "div"
                    );


                imageWrapper.className =
                    "product-card-image";


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    product.image;


                image.alt =
                    product.name;


                image.loading =
                    "lazy";


                imageWrapper.appendChild(
                    image
                );


                const content =
                    document.createElement(
                        "div"
                    );


                content.className =
                    "product-card-content";


                const name =
                    document.createElement(
                        "h3"
                    );


                name.textContent =
                    product.name;


                const price =
                    document.createElement(
                        "strong"
                    );


                price.textContent =
                    formatPrice(
                        product.price
                    );


                content.appendChild(
                    name
                );


                content.appendChild(
                    price
                );


                card.appendChild(
                    imageWrapper
                );


                card.appendChild(
                    content
                );


                recommendationsContainer.appendChild(
                    card
                );

            }
        );

    }


    /* ==========================================
       NEWSLETTER
    ========================================== */

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (!newsletterEmail) {

                    return;

                }


                const email =
                    newsletterEmail.value
                        .trim()
                        .toLowerCase();


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        email
                    )
                ) {

                    showMessage(
                        "Please enter a valid email."
                    );


                    return;

                }


                localStorage.setItem(
                    "soleai_newsletter_email",
                    email
                );


                newsletterEmail.value =
                    "";


                showMessage(
                    "Subscribed successfully!"
                );

            }
        );

    }


    /* ==========================================
       BACK TO TOP
    ========================================== */

    if (backToTop) {

        window.addEventListener(
            "scroll",
            function () {

                backToTop.classList.toggle(
                    "show",
                    window.scrollY > 500
                );

            }
        );


        backToTop.addEventListener(
            "click",
            function () {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    /* ==========================================
       TOAST
    ========================================== */

    function showMessage(
        text
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
                transform:translateX(-50%);
                z-index:99999;
                padding:13px 20px;
                border-radius:10px;
                background:#111827;
                color:white;
                font:600 13px Inter,sans-serif;
                box-shadow:0 10px 30px rgba(0,0,0,.2);
            `;


            document.body.appendChild(
                toast
            );

        }


        toast.textContent =
            text;


        toast.style.display =
            "block";


        clearTimeout(
            showMessage.timer
        );


        showMessage.timer =
            setTimeout(
                function () {

                    toast.style.display =
                        "none";

                },
                2500
            );

    }


    /* ==========================================
       START
    ========================================== */

    await loadOrder();

});
