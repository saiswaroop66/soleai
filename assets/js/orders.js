"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       API
    ===================================================== */

    const API_URL =
        "https://soleai-backend.onrender.com/api";

    const ORDERS_API =
        `${API_URL}/orders`;

    const TOKEN_KEY =
        "soleaiToken";


    /* =====================================================
       GET TOKEN
    ===================================================== */

    function getToken() {

        return localStorage.getItem(
            TOKEN_KEY
        );

    }


    /* =====================================================
       GET LOGGED-IN USER
    ===================================================== */

    function getCurrentUser() {

        let user = null;


        try {

            const session =
                sessionStorage.getItem(
                    "soleaiUserSession"
                );


            if (session) {

                user =
                    JSON.parse(session);

            }

        } catch (error) {

            console.error(
                "Session error:",
                error
            );

        }


        if (!user) {

            try {

                const localSession =
                    localStorage.getItem(
                        "soleaiUserSession"
                    );


                if (localSession) {

                    user =
                        JSON.parse(
                            localSession
                        );

                }

            } catch (error) {

                console.error(
                    "Local session error:",
                    error
                );

            }

        }


        return user;

    }


    const currentUser =
        getCurrentUser();


    /* =====================================================
       LOGIN CHECK
    ===================================================== */

    if (
        !currentUser ||
        currentUser.loggedIn !== true
    ) {

        window.location.href =
            "./login.html";

        return;

    }


    const token =
        getToken();


    if (!token) {

        console.error(
            "JWT token not found."
        );


        showToast(
            "Login Required",
            "Please login again."
        );


        setTimeout(
            () => {

                window.location.href =
                    "./login.html";

            },
            1000
        );


        return;

    }


    /* =====================================================
       USER UI
    ===================================================== */

    const userName =
        currentUser.name ||
        "User";


    const initials =
        userName
            .split(" ")
            .filter(Boolean)
            .map(
                word =>
                    word.charAt(0)
            )
            .join("")
            .substring(0, 2)
            .toUpperCase();


    const headerUserName =
        document.getElementById(
            "headerUserName"
        );


    const userInitials =
        document.getElementById(
            "userInitials"
        );


    if (headerUserName) {

        headerUserName.textContent =
            userName
                .split(" ")[0];

    }


    if (userInitials) {

        userInitials.textContent =
            initials;

    }


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const ordersContainer =
        document.getElementById(
            "ordersContainer"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    const searchInput =
        document.getElementById(
            "orderSearch"
        );


    const tabs =
        document.querySelectorAll(
            ".tab"
        );


    const modal =
        document.getElementById(
            "orderModal"
        );


    const closeModal =
        document.getElementById(
            "closeModal"
        );


    const closeModalButton =
        document.getElementById(
            "closeModalButton"
        );


    const trackModalButton =
        document.getElementById(
            "trackModalButton"
        );


    let orders = [];

    let activeStatus =
        "all";

    let selectedOrder = null;


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(
        price
    ) {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(
            Number(price) || 0
        );

    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatDate(
        date
    ) {

        if (!date) {

            return "-";

        }


        const parsed =
            new Date(date);


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {

            return "-";

        }


        return parsed.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       STATUS HELPERS
    ===================================================== */

    function normalizeStatus(
        status
    ) {

        const value =
            String(
                status || ""
            )
            .toUpperCase();


        const map = {

            PLACED:
                "Processing",

            CONFIRMED:
                "Processing",

            SHIPPED:
                "Shipped",

            DELIVERED:
                "Delivered",

            CANCELLED:
                "Cancelled",

            PROCESSING:
                "Processing"

        };


        return (
            map[value] ||
            "Processing"
        );

    }


    function getStatusClass(
        status
    ) {

        return normalizeStatus(
            status
        )
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        );

    }


    /* =====================================================
       ORDER TOTAL
    ===================================================== */

    function getOrderTotal(
        order
    ) {

        if (
            typeof order.total ===
            "number"
        ) {

            return order.total;

        }


        return (
            Number(order.subtotal) || 0
        )
        +
        (
            Number(order.delivery) || 0
        )
        -
        (
            Number(order.discount) || 0
        );

    }


    /* =====================================================
       TOTAL ITEM COUNT
    ===================================================== */

    function getItemCount(
        order
    ) {

        if (
            !Array.isArray(
                order.items
            )
        ) {

            return 0;

        }


        return order.items.reduce(
            (
                total,
                item
            ) => {

                return total +
                    (
                        Number(
                            item.quantity
                        ) || 0
                    );

            },
            0
        );

    }


    /* =====================================================
       LOAD ORDERS FROM BACKEND
    ===================================================== */

    async function loadOrders() {

        try {

            const response =
                await fetch(
                    ORDERS_API,
                    {

                        method: "GET",

                        headers: {

                            "Authorization":
                                `Bearer ${getToken()}`,

                            "Content-Type":
                                "application/json"

                        }

                    }
                );


            const data =
                await response.json();


            console.log(
                "ORDERS API:",
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


                showToast(
                    "Session Expired",
                    "Please login again."
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "./login.html";

                    },
                    1000
                );


                return;

            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to load orders."
                );

            }


            if (
                !Array.isArray(
                    data.orders
                )
            ) {

                orders = [];

            } else {

                orders =
                    data.orders;

            }


            updateStats();

            renderOrders();

            updateCartCount();


        } catch (error) {

            console.error(
                "Orders loading error:",
                error
            );


            orders = [];

            updateStats();

            renderOrders();


            showToast(
                "Unable to Load Orders",
                error.message ||
                "Please try again."
            );

        }

    }


    /* =====================================================
       UPDATE STATS
    ===================================================== */

    function updateStats() {

        const total =
            orders.length;


        const processing =
            orders.filter(
                order => {

                    const status =
                        String(
                            order.orderStatus
                        )
                        .toUpperCase();


                    return (
                        status === "PLACED" ||
                        status === "CONFIRMED" ||
                        status === "PROCESSING"
                    );

                }
            ).length;


        const shipped =
            orders.filter(
                order =>
                    String(
                        order.orderStatus
                    )
                    .toUpperCase() ===
                    "SHIPPED"
            ).length;


        const delivered =
            orders.filter(
                order =>
                    String(
                        order.orderStatus
                    )
                    .toUpperCase() ===
                    "DELIVERED"
            ).length;


        const totalElement =
            document.getElementById(
                "totalOrders"
            );


        const processingElement =
            document.getElementById(
                "processingOrders"
            );


        const shippedElement =
            document.getElementById(
                "shippedOrders"
            );


        const deliveredElement =
            document.getElementById(
                "deliveredOrders"
            );


        if (totalElement) {

            totalElement.textContent =
                total;

        }


        if (processingElement) {

            processingElement.textContent =
                processing;

        }


        if (shippedElement) {

            shippedElement.textContent =
                shipped;

        }


        if (deliveredElement) {

            deliveredElement.textContent =
                delivered;

        }

    }


    /* =====================================================
       FILTER ORDERS
    ===================================================== */

    function filterOrders() {

        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        return orders.filter(
            order => {

                const displayStatus =
                    normalizeStatus(
                        order.orderStatus
                    );


                const statusMatch =
                    activeStatus ===
                    "all" ||
                    displayStatus ===
                    activeStatus;


                const orderId =
                    String(
                        order._id || ""
                    )
                    .toLowerCase();


                const productNames =
                    Array.isArray(
                        order.items
                    )
                        ? order.items
                            .map(
                                item =>
                                    String(
                                        item.name ||
                                        ""
                                    )
                            )
                            .join(" ")
                            .toLowerCase()
                        : "";


                const searchMatch =
                    !search ||
                    orderId.includes(
                        search
                    ) ||
                    productNames.includes(
                        search
                    );


                return (
                    statusMatch &&
                    searchMatch
                );

            }
        );

    }


    /* =====================================================
       RENDER ORDERS
    ===================================================== */

    function renderOrders() {

        if (!ordersContainer) {

            return;

        }


        const filtered =
            filterOrders();


        ordersContainer.innerHTML =
            "";


        if (
            !filtered.length
        ) {

            if (emptyState) {

                emptyState.style.display =
                    "block";

                emptyState.classList.add(
                    "show"
                );

            }


            return;

        }


        if (emptyState) {

            emptyState.style.display =
                "none";

            emptyState.classList.remove(
                "show"
            );

        }


        filtered.forEach(
            order => {

                const card =
                    createOrderCard(
                        order
                    );


                ordersContainer.appendChild(
                    card
                );

            }
        );


        attachOrderEvents();

    }


    /* =====================================================
       CREATE ORDER CARD
    ===================================================== */

    function createOrderCard(
        order
    ) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "order-card";


        const orderId =
            String(
                order._id ||
                order.id ||
                ""
            );


        const displayStatus =
            normalizeStatus(
                order.orderStatus
            );


        const items =
            Array.isArray(
                order.items
            )
                ? order.items
                : [];


        const firstItem =
            items[0] || {};


        const total =
            getOrderTotal(
                order
            );


        const itemCount =
            getItemCount(
                order
            );


        const payment =
            String(
                order.paymentMethod ||
                "COD"
            ).toUpperCase();


        const paymentText =
            payment === "COD"
                ? "Cash on Delivery"
                : "Online Payment";


        const extraItems =
            items.length > 1
                ? ` + ${items.length - 1} more`
                : "";


        card.innerHTML = `

            <div class="order-top">

                <div class="order-number">

                    <strong>
                        #${escapeHtml(orderId)}
                    </strong>

                    <span>
                        ${formatDate(order.createdAt)}
                    </span>

                </div>

                <span class="status ${getStatusClass(
                    order.orderStatus
                )}">

                    ${escapeHtml(displayStatus)}

                </span>

            </div>


            <div class="order-content">

                <div class="order-product">

                    <div class="product-image">

                        ${
                            firstItem.image
                                ? `
                                    <img
                                        src="${escapeHtml(
                                            firstItem.image
                                        )}"
                                        alt="${escapeHtml(
                                            firstItem.name ||
                                            "SoleAI Product"
                                        )}"
                                        onerror="
                                            this.style.display='none';
                                            this.parentElement.querySelector('i').style.display='block';
                                        "
                                    >
                                  `
                                : ""
                        }

                        <i
                            class="bi bi-box"
                            style="${
                                firstItem.image
                                    ? "display:none;"
                                    : "display:block;"
                            }">
                        </i>

                    </div>


                    <div class="product-details">

                        <h3>

                            ${escapeHtml(
                                firstItem.name ||
                                "SoleAI Product"
                            )}

                            ${escapeHtml(
                                extraItems
                            )}

                        </h3>


                        <p>

                            ${
                                firstItem.size
                                    ? `Size ${escapeHtml(
                                        firstItem.size
                                    )}`
                                    : ""
                            }

                            ${
                                firstItem.color
                                    ? ` · ${escapeHtml(
                                        firstItem.color
                                    )}`
                                    : ""
                            }

                            · Qty ${itemCount}

                        </p>


                        <div class="price">

                            ${formatPrice(total)}

                        </div>

                    </div>

                </div>


                <div class="order-meta">

                    <div class="meta-item">

                        <span>
                            ORDER DATE
                        </span>

                        <strong>
                            ${formatDate(
                                order.createdAt
                            )}
                        </strong>

                    </div>


                    <div class="meta-item">

                        <span>
                            PAYMENT
                        </span>

                        <strong>
                            ${escapeHtml(
                                paymentText
                            )}
                        </strong>

                    </div>


                    <div class="meta-item">

                        <span>
                            ITEMS
                        </span>

                        <strong>
                            ${itemCount}
                        </strong>

                    </div>


                    <div class="meta-item">

                        <span>
                            TOTAL
                        </span>

                        <strong>
                            ${formatPrice(total)}
                        </strong>

                    </div>

                </div>

            </div>


            <div class="order-footer">

                <div class="payment">

                    <i class="bi bi-check-circle-fill"></i>

                    ${escapeHtml(
                        paymentText
                    )}

                </div>


                <div class="order-actions">

                    <button
                        class="secondary-button view-order"
                        data-id="${escapeHtml(orderId)}"
                        type="button">

                        <i class="bi bi-eye"></i>

                        View Details

                    </button>


                    ${
                        String(
                            order.orderStatus
                        ).toUpperCase() !==
                        "CANCELLED"
                            ? `
                                <button
                                    class="primary-button track-order"
                                    data-id="${escapeHtml(orderId)}"
                                    type="button">

                                    <i class="bi bi-geo-alt"></i>

                                    Track Order

                                </button>
                              `
                            : ""
                    }

                </div>

            </div>

        `;


        return card;

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHtml(
        value
    ) {

        return String(
            value ?? ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }


    /* =====================================================
       ATTACH ORDER EVENTS
    ===================================================== */

    function attachOrderEvents() {

        document
            .querySelectorAll(
                ".view-order"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const order =
                                orders.find(
                                    item =>
                                        String(
                                            item._id
                                        ) ===
                                        String(
                                            button.dataset.id
                                        )
                                );


                            if (order) {

                                openOrderModal(
                                    order
                                );

                            }

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".track-order"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const order =
                                orders.find(
                                    item =>
                                        String(
                                            item._id
                                        ) ===
                                        String(
                                            button.dataset.id
                                        )
                                );


                            if (!order) {

                                return;

                            }


                            openOrderModal(
                                order
                            );


                            showToast(
                                "Order Tracking",
                                `Order #${order._id} is ${normalizeStatus(
                                    order.orderStatus
                                ).toLowerCase()}.`
                            );

                        }
                    );

                }
            );

    }


    /* =====================================================
       OPEN ORDER MODAL
    ===================================================== */

    function openOrderModal(
        order
    ) {

        selectedOrder =
            order;


        const orderId =
            String(
                order._id ||
                order.id ||
                ""
            );


        const items =
            Array.isArray(
                order.items
            )
                ? order.items
                : [];


        const firstItem =
            items[0] || {};


        const total =
            getOrderTotal(
                order
            );


        const itemCount =
            getItemCount(
                order
            );


        const status =
            normalizeStatus(
                order.orderStatus
            );


        const payment =
            String(
                order.paymentMethod ||
                "COD"
            ).toUpperCase();


        const paymentText =
            payment === "COD"
                ? "Cash on Delivery"
                : "Online Payment";


        const modalOrderId =
            document.getElementById(
                "modalOrderId"
            );


        const modalProductName =
            document.getElementById(
                "modalProductName"
            );


        const modalProductInfo =
            document.getElementById(
                "modalProductInfo"
            );


        const modalDate =
            document.getElementById(
                "modalDate"
            );


        const modalTotal =
            document.getElementById(
                "modalTotal"
            );


        const modalPayment =
            document.getElementById(
                "modalPayment"
            );


        const modalStatus =
            document.getElementById(
                "modalStatus"
            );


        const imageContainer =
            document.getElementById(
                "modalImage"
            );


        if (modalOrderId) {

            modalOrderId.textContent =
                "#" + orderId;

        }


        if (modalProductName) {

            modalProductName.textContent =
                firstItem.name ||
                "SoleAI Product";

        }


        if (modalProductInfo) {

            modalProductInfo.textContent =
                `Size ${
                    firstItem.size || "-"
                } · ${
                    firstItem.color || "-"
                } · Qty ${
                    itemCount
                }`;

        }


        if (modalDate) {

            modalDate.textContent =
                formatDate(
                    order.createdAt
                );

        }


        if (modalTotal) {

            modalTotal.textContent =
                formatPrice(
                    total
                );

        }


        if (modalPayment) {

            modalPayment.textContent =
                paymentText;

        }


        if (modalStatus) {

            modalStatus.textContent =
                status;

        }


        if (imageContainer) {

            imageContainer.innerHTML =
                "";


            if (
                firstItem.image
            ) {

                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    firstItem.image;


                image.alt =
                    firstItem.name ||
                    "SoleAI Product";


                image.style.maxWidth =
                    "100%";


                image.style.maxHeight =
                    "100%";


                image.style.objectFit =
                    "contain";


                imageContainer.appendChild(
                    image
                );

            } else {

                imageContainer.textContent =
                    "📦";

            }

        }


        updateTracking(
            order.orderStatus
        );


        if (modal) {

            modal.classList.add(
                "show"
            );


            modal.setAttribute(
                "aria-hidden",
                "false"
            );

        }

    }


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeOrderModal() {

        if (!modal) {

            return;

        }


        modal.classList.remove(
            "show"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeOrderModal
        );

    }


    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            closeOrderModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeOrderModal();

                }

            }
        );

    }


    /* =====================================================
       TRACKING
    ===================================================== */

    function updateTracking(
        status
    ) {

        const steps =
            document.querySelectorAll(
                ".tracking-step"
            );


        const value =
            String(
                status || ""
            ).toUpperCase();


        let current = 1;


        if (
            value === "PLACED" ||
            value === "CONFIRMED"
        ) {

            current = 2;

        }


        if (
            value === "SHIPPED"
        ) {

            current = 3;

        }


        if (
            value === "DELIVERED"
        ) {

            current = 4;

        }


        if (
            value === "CANCELLED"
        ) {

            current = 1;

        }


        steps.forEach(
            (
                step,
                index
            ) => {

                step.classList.toggle(
                    "completed",
                    index < current
                );

            }
        );

    }


    /* =====================================================
       TRACK MODAL BUTTON
    ===================================================== */

    if (trackModalButton) {

        trackModalButton.addEventListener(
            "click",
            () => {

                if (!selectedOrder) {

                    return;

                }


                updateTracking(
                    selectedOrder.orderStatus
                );


                showToast(
                    "Order Tracking",
                    `Your order is currently ${normalizeStatus(
                        selectedOrder.orderStatus
                    ).toLowerCase()}.`
                );

            }
        );

    }


    /* =====================================================
       CANCEL ORDER
    ===================================================== */

    async function cancelOrder(
        order
    ) {

        const status =
            String(
                order.orderStatus ||
                ""
            ).toUpperCase();


        if (
            status === "SHIPPED" ||
            status === "DELIVERED"
        ) {

            showToast(
                "Cannot Cancel",
                "This order can no longer be cancelled."
            );


            return;

        }


        if (
            status === "CANCELLED"
        ) {

            showToast(
                "Already Cancelled",
                "This order is already cancelled."
            );


            return;

        }


        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this order?"
            );


        if (!confirmed) {

            return;

        }


        try {

            const response =
                await fetch(
                    `${ORDERS_API}/${order._id}/cancel`,
                    {

                        method: "PATCH",

                        headers: {

                            "Authorization":
                                `Bearer ${getToken()}`,

                            "Content-Type":
                                "application/json"

                        }

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to cancel order."
                );

            }


            showToast(
                "Order Cancelled",
                "Your order has been cancelled."
            );


            closeOrderModal();


            await loadOrders();


        } catch (error) {

            console.error(
                "Cancel order error:",
                error
            );


            showToast(
                "Cancellation Failed",
                error.message ||
                "Unable to cancel order."
            );

        }

    }


    /* =====================================================
       CANCEL SUPPORT
       Creates a cancel button inside modal
       only when appropriate.
    ===================================================== */

    function addCancelButton(
        order
    ) {

        const existing =
            document.getElementById(
                "modalCancelButton"
            );


        if (existing) {

            existing.remove();

        }


        const status =
            String(
                order.orderStatus ||
                ""
            ).toUpperCase();


        if (
            status === "SHIPPED" ||
            status === "DELIVERED" ||
            status === "CANCELLED"
        ) {

            return;

        }


        const button =
            document.createElement(
                "button"
            );


        button.id =
            "modalCancelButton";


        button.type =
            "button";


        button.className =
            "secondary-button";


        button.textContent =
            "Cancel Order";


        button.addEventListener(
            "click",
            () => {

                cancelOrder(
                    order
                );

            }
        );


        const footer =
            document.querySelector(
                ".modal-footer"
            );


        if (footer) {

            footer.insertBefore(
                button,
                footer.firstChild
            );

        }

    }


    /* =====================================================
       WRAP MODAL OPEN TO ADD CANCEL
    ===================================================== */

    const originalOpenOrderModal =
        openOrderModal;


    window.openSoleAIOrder =
        function (
            order
        ) {

            originalOpenOrderModal(
                order
            );

            addCancelButton(
                order
            );

        };


    /* =====================================================
       REPLACE EVENT HANDLER FOR VIEW
    ===================================================== */

    function refreshOrderEvents() {

        document
            .querySelectorAll(
                ".view-order"
            )
            .forEach(
                button => {

                    button.onclick =
                        () => {

                            const order =
                                orders.find(
                                    item =>
                                        String(
                                            item._id
                                        ) ===
                                        String(
                                            button.dataset.id
                                        )
                                );


                            if (order) {

                                window.openSoleAIOrder(
                                    order
                                );

                            }

                        };

                }
            );


        document
            .querySelectorAll(
                ".track-order"
            )
            .forEach(
                button => {

                    button.onclick =
                        () => {

                            const order =
                                orders.find(
                                    item =>
                                        String(
                                            item._id
                                        ) ===
                                        String(
                                            button.dataset.id
                                        )
                                );


                            if (order) {

                                window.openSoleAIOrder(
                                    order
                                );

                                showToast(
                                    "Order Tracking",
                                    `Order #${order._id} is ${normalizeStatus(
                                        order.orderStatus
                                    ).toLowerCase()}.`
                                );

                            }

                        };

                }
            );

    }


    /* =====================================================
       FILTER TABS
    ===================================================== */

    tabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    tabs.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    tab.classList.add(
                        "active"
                    );


                    activeStatus =
                        tab.dataset.status ||
                        "all";


                    renderOrders();

                    refreshOrderEvents();

                }
            );

        }
    );


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                renderOrders();

                refreshOrderEvents();

            }
        );

    }


    /* =====================================================
       CART COUNT
    ===================================================== */

    async function updateCartCount() {

        const cartCount =
            document.getElementById(
                "cartCount"
            );


        if (!cartCount) {

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/cart`,
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


            if (
                response.ok &&
                data.cart &&
                Array.isArray(
                    data.cart.items
                )
            ) {

                const count =
                    data.cart.items.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            (
                                Number(
                                    item.quantity
                                ) || 0
                            ),
                        0
                    );


                cartCount.textContent =
                    count;

            }

        } catch (error) {

            console.error(
                "Cart count error:",
                error
            );

        }

    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(
        title,
        message
    ) {

        const toast =
            document.getElementById(
                "toast"
            );


        const toastMessage =
            document.getElementById(
                "toastMessage"
            );


        if (!toast) {

            return;

        }


        if (toastMessage) {

            toastMessage.textContent =
                `${title}: ${message}`;

        }


        toast.classList.add(
            "show"
        );


        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateStats();

    renderOrders();

    refreshOrderEvents();

    loadOrders();

});
