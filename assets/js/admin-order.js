"use strict";

/* =========================================================
   SOLEAI ADMIN ORDERS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    OrdersPage.init();

});


const OrdersPage = {

    orders: [],

    filtered: [],

    activeStatus: "all",

    currentPage: 1,

    perPage: 8,

    selectedOrder: null,

    toastTimer: null,


    /* =====================================================
       INIT
    ===================================================== */

    init: function () {

        this.cache();

        this.loadOrders();

        this.events();

        this.updateStats();

        this.render();

    },


    /* =====================================================
       CACHE
    ===================================================== */

    cache: function () {

        this.body =
            document.getElementById(
                "orders-body"
            );

        this.search =
            document.getElementById(
                "search-input"
            );

        this.payment =
            document.getElementById(
                "payment-filter"
            );

        this.date =
            document.getElementById(
                "date-filter"
            );

        this.sort =
            document.getElementById(
                "sort-filter"
            );

        this.empty =
            document.getElementById(
                "empty-state"
            );

        this.pagination =
            document.getElementById(
                "pagination"
            );

        this.detailsModal =
            document.getElementById(
                "details-modal"
            );

        this.statusModal =
            document.getElementById(
                "status-modal"
            );

    },


    /* =====================================================
       LOAD ORDERS
    ===================================================== */

    loadOrders: function () {

        const saved =
            localStorage.getItem(
                "soleai_orders"
            );


        if (saved) {

            try {

                const parsed =
                    JSON.parse(saved);


                if (
                    Array.isArray(parsed) &&
                    parsed.length > 0
                ) {

                    this.orders = parsed;

                    return;

                }

            } catch (error) {

                console.log(
                    "Saved orders could not be loaded."
                );

            }

        }


        this.orders =
            this.demoOrders();


        this.save();

    },


    /* =====================================================
       DEMO ORDERS
    ===================================================== */

    demoOrders: function () {

        return [

            this.makeOrder(
                "SA-10482",
                "Rahul Sharma",
                "rahul@example.com",
                "Nike Air Zoom Pegasus 41",
                6999,
                "paid",
                "processing",
                1,
                0
            ),

            this.makeOrder(
                "SA-10481",
                "Ananya Reddy",
                "ananya@example.com",
                "Adidas Adizero SL",
                6499,
                "paid",
                "shipped",
                1,
                1
            ),

            this.makeOrder(
                "SA-10480",
                "Arjun Kumar",
                "arjun@example.com",
                "Puma Future Rider",
                4999,
                "paid",
                "delivered",
                2,
                2
            ),

            this.makeOrder(
                "SA-10479",
                "Priya Singh",
                "priya@example.com",
                "New Balance Fresh Foam 1080",
                7999,
                "pending",
                "pending",
                1,
                3
            ),

            this.makeOrder(
                "SA-10478",
                "Vikram Rao",
                "vikram@example.com",
                "Nike Revolution 7",
                4299,
                "paid",
                "shipped",
                1,
                4
            ),

            this.makeOrder(
                "SA-10477",
                "Sneha Patel",
                "sneha@example.com",
                "Adidas Runfalcon 5",
                3899,
                "paid",
                "delivered",
                1,
                5
            ),

            this.makeOrder(
                "SA-10476",
                "Kiran Reddy",
                "kiran@example.com",
                "Nike Air Zoom Pegasus 41",
                6999,
                "failed",
                "cancelled",
                1,
                6
            ),

            this.makeOrder(
                "SA-10475",
                "Meghana Das",
                "meghana@example.com",
                "Puma Future Rider",
                9998,
                "paid",
                "processing",
                2,
                7
            ),

            this.makeOrder(
                "SA-10474",
                "Rohit Verma",
                "rohit@example.com",
                "Adidas Adizero SL",
                6499,
                "paid",
                "delivered",
                1,
                9
            ),

            this.makeOrder(
                "SA-10473",
                "Divya Rao",
                "divya@example.com",
                "New Balance Fresh Foam 1080",
                7999,
                "refunded",
                "cancelled",
                1,
                11
            )

        ];

    },


    /* =====================================================
       CREATE ORDER
    ===================================================== */

    makeOrder: function (
        id,
        customer,
        email,
        product,
        total,
        payment,
        status,
        quantity,
        days
    ) {

        const date =
            new Date();

        date.setDate(
            date.getDate() - days
        );


        return {

            id: id,

            customer: {

                name: customer,

                email: email,

                phone:
                    "+91 98765 43210",

                initials:
                    this.initials(
                        customer
                    )

            },

            product: product,

            quantity: quantity,

            total: total,

            payment: payment,

            status: status,

            date:
                date.toISOString(),

            address: {
                line:
                    "12 Main Road",

                city:
                    "Visakhapatnam",

                state:
                    "Andhra Pradesh",

                pin:
                    "530001"
            }

        };

    },


    /* =====================================================
       SAVE
    ===================================================== */

    save: function () {

        localStorage.setItem(
            "soleai_orders",
            JSON.stringify(
                this.orders
            )
        );

    },


    /* =====================================================
       EVENTS
    ===================================================== */

    events: function () {

        /* Search */

        this.search.addEventListener(
            "input",
            () => {

                this.currentPage = 1;

                this.render();

            }
        );


        /* Payment */

        this.payment.addEventListener(
            "change",
            () => {

                this.currentPage = 1;

                this.render();

            }
        );


        /* Date */

        this.date.addEventListener(
            "change",
            () => {

                this.currentPage = 1;

                this.render();

            }
        );


        /* Sort */

        this.sort.addEventListener(
            "change",
            () => {

                this.render();

            }
        );


        /* Status */

        document
            .querySelectorAll(
                ".status-tab"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        this.activeStatus =
                            button.dataset.status;

                        this.currentPage =
                            1;


                        document
                            .querySelectorAll(
                                ".status-tab"
                            )
                            .forEach(
                                item => {

                                    item.classList.toggle(
                                        "active",
                                        item ===
                                        button
                                    );

                                }
                            );


                        this.render();

                    }
                );

            });


        /* Clear */

        document
            .getElementById(
                "clear-btn"
            )
            .addEventListener(
                "click",
                () => {

                    this.clearFilters();

                }
            );


        document
            .getElementById(
                "empty-clear-btn"
            )
            .addEventListener(
                "click",
                () => {

                    this.clearFilters();

                }
            );


        /* Refresh */

        document
            .getElementById(
                "refresh-btn"
            )
            .addEventListener(
                "click",
                () => {

                    this.render();

                    this.toast(
                        "Orders refreshed successfully."
                    );

                }
            );


        /* Export */

        document
            .getElementById(
                "export-btn"
            )
            .addEventListener(
                "click",
                () => {

                    this.export();

                }
            );


        /* Mobile */

        document
            .getElementById(
                "mobile-menu-btn"
            )
            .addEventListener(
                "click",
                () => {

                    document
                        .getElementById(
                            "admin-sidebar"
                        )
                        .classList.add(
                            "open"
                        );

                    document
                        .getElementById(
                            "sidebar-overlay"
                        )
                        .classList.add(
                            "show"
                        );

                }
            );


        document
            .getElementById(
                "sidebar-overlay"
            )
            .addEventListener(
                "click",
                () => {

                    document
                        .getElementById(
                            "admin-sidebar"
                        )
                        .classList.remove(
                            "open"
                        );

                    document
                        .getElementById(
                            "sidebar-overlay"
                        )
                        .classList.remove(
                            "show"
                        );

                }
            );


        /* Logout */

        document
            .getElementById(
                "logout-btn"
            )
            .addEventListener(
                "click",
                () => {

                    if (
                        confirm(
                            "Are you sure you want to logout?"
                        )
                    ) {

                        window.location.href =
                            "../index.html";

                    }

                }
            );


        /* Modal closing */

        document
            .querySelectorAll(
                "[data-close-details]"
            )
            .forEach(
                element => {

                    element.addEventListener(
                        "click",
                        () => {

                            this.closeDetails();

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                "[data-close-status]"
            )
            .forEach(
                element => {

                    element.addEventListener(
                        "click",
                        () => {

                            this.closeStatus();

                        }
                    );

                }
            );


        document
            .getElementById(
                "save-status"
            )
            .addEventListener(
                "click",
                () => {

                    this.updateStatus();

                }
            );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    this.closeDetails();

                    this.closeStatus();

                }

            }
        );

    },


    /* =====================================================
       FILTER
    ===================================================== */

    getFiltered: function () {

        let result =
            [...this.orders];


        const query =
            this.search.value
                .trim()
                .toLowerCase();


        if (query) {

            result =
                result.filter(
                    order =>

                        order.id
                            .toLowerCase()
                            .includes(
                                query
                            )

                        ||

                        order.customer.name
                            .toLowerCase()
                            .includes(
                                query
                            )

                        ||

                        order.customer.email
                            .toLowerCase()
                            .includes(
                                query
                            )

                        ||

                        order.product
                            .toLowerCase()
                            .includes(
                                query
                            )

                );

        }


        if (
            this.activeStatus !==
            "all"
        ) {

            result =
                result.filter(
                    order =>
                        order.status ===
                        this.activeStatus
                );

        }


        if (
            this.payment.value !==
            "all"
        ) {

            result =
                result.filter(
                    order =>
                        order.payment ===
                        this.payment.value
                );

        }


        if (
            this.date.value !==
            "all"
        ) {

            const now =
                new Date();


            const cutoff =
                new Date();


            if (
                this.date.value ===
                "today"
            ) {

                cutoff.setHours(
                    0,
                    0,
                    0,
                    0
                );

            } else {

                cutoff.setDate(
                    cutoff.getDate() -
                    Number(
                        this.date.value
                    )
                );

            }


            result =
                result.filter(
                    order =>
                        new Date(
                            order.date
                        ) >=
                        cutoff
                );

        }


        switch (
            this.sort.value
        ) {

            case "oldest":

                result.sort(
                    (a, b) =>
                        new Date(a.date) -
                        new Date(b.date)
                );

                break;


            case "high":

                result.sort(
                    (a, b) =>
                        b.total -
                        a.total
                );

                break;


            case "low":

                result.sort(
                    (a, b) =>
                        a.total -
                        b.total
                );

                break;


            default:

                result.sort(
                    (a, b) =>
                        new Date(b.date) -
                        new Date(a.date)
                );

        }


        return result;

    },


    /* =====================================================
       RENDER
    ===================================================== */

    render: function () {

        this.filtered =
            this.getFiltered();


        document
            .getElementById(
                "visible-count"
            )
            .textContent =
            this.filtered.length;


        if (
            this.filtered.length ===
            0
        ) {

            this.body.innerHTML =
                "";

            this.empty.style.display =
                "block";

            this.pagination.innerHTML =
                "";

            return;

        }


        this.empty.style.display =
            "none";


        const start =
            (
                this.currentPage -
                1
            ) *
            this.perPage;


        const pageOrders =
            this.filtered.slice(
                start,
                start +
                this.perPage
            );


        this.body.innerHTML =
            pageOrders
                .map(
                    order =>
                        this.row(order)
                )
                .join("");


        this.paginationHTML();

    },


    /* =====================================================
       TABLE ROW
    ===================================================== */

    row: function (order) {

        const date =
            new Date(
                order.date
            );


        return `

            <tr>

                <td>

                    <span class="order-id">

                        #${this.escape(
                            order.id
                        )}

                    </span>

                    <span class="order-channel">

                        Online Store

                    </span>

                </td>


                <td>

                    <div class="customer">

                        <div class="customer-avatar">

                            ${this.escape(
                                order.customer.initials
                            )}

                        </div>


                        <div class="customer-info">

                            <strong>

                                ${this.escape(
                                    order.customer.name
                                )}

                            </strong>

                            <span>

                                ${this.escape(
                                    order.customer.email
                                )}

                            </span>

                        </div>

                    </div>

                </td>


                <td>

                    <span class="items-count">

                        <i class="bi bi-box"></i>

                        ${order.quantity}

                        ${
                            order.quantity === 1
                                ? "item"
                                : "items"
                        }

                    </span>

                </td>


                <td>

                    <span class="order-date">

                        ${this.formatDate(
                            date
                        )}

                    </span>

                    <span class="order-time">

                        ${this.formatTime(
                            date
                        )}

                    </span>

                </td>


                <td>

                    <span class="
                        payment-badge
                        payment-${order.payment}
                    ">

                        <i class="
                            bi
                            ${this.paymentIcon(
                                order.payment
                            )}
                        "></i>

                        ${this.paymentLabel(
                            order.payment
                        )}

                    </span>

                </td>


                <td>

                    <span class="order-total">

                        ${this.currency(
                            order.total
                        )}

                    </span>

                </td>


                <td>

                    <span class="
                        status-badge
                        status-${order.status}
                    ">

                        <i class="
                            bi
                            ${this.statusIcon(
                                order.status
                            )}
                        "></i>

                        ${this.statusLabel(
                            order.status
                        )}

                    </span>

                </td>


                <td>

                    <div class="action-group">


                        <button
                            type="button"
                            class="action-btn"
                            title="View Order"
                            onclick="
                                OrdersPage.view(
                                    '${this.js(
                                        order.id
                                    )}'
                                )
                            ">

                            <i class="bi bi-eye"></i>

                        </button>


                        <button
                            type="button"
                            class="action-btn"
                            title="Update Status"
                            onclick="
                                OrdersPage.openStatus(
                                    '${this.js(
                                        order.id
                                    )}'
                                )
                            ">

                            <i class="bi bi-arrow-repeat"></i>

                        </button>

                    </div>

                </td>

            </tr>

        `;

    },


    /* =====================================================
       VIEW ORDER
    ===================================================== */

    view: function (id) {

        const order =
            this.orders.find(
                item =>
                    item.id === id
            );


        if (!order) {
            return;
        }


        this.selectedOrder =
            order;


        document
            .getElementById(
                "details-order-id"
            )
            .textContent =
            "#" + order.id;


        document
            .getElementById(
                "details-content"
            )
            .innerHTML =
            this.detailsHTML(
                order
            );


        this.detailsModal.classList.add(
            "show"
        );

    },


    /* =====================================================
       DETAILS HTML
    ===================================================== */

    detailsHTML: function (order) {

        const date =
            new Date(
                order.date
            );


        return `

            <div class="detail-grid">

                <div class="detail-card">

                    <span>
                        ORDER DATE
                    </span>

                    <strong>
                        ${this.formatDate(
                            date
                        )}
                    </strong>

                </div>


                <div class="detail-card">

                    <span>
                        PAYMENT
                    </span>

                    <strong>
                        ${this.paymentLabel(
                            order.payment
                        )}
                    </strong>

                </div>


                <div class="detail-card">

                    <span>
                        STATUS
                    </span>

                    <strong>
                        ${this.statusLabel(
                            order.status
                        )}
                    </strong>

                </div>

            </div>



            <div class="detail-section">

                <div class="detail-title">
                    Customer
                </div>


                <div class="detail-customer">

                    <div class="detail-customer-avatar">

                        ${this.escape(
                            order.customer.initials
                        )}

                    </div>


                    <div>

                        <strong>
                            ${this.escape(
                                order.customer.name
                            )}
                        </strong>

                        <span>
                            ${this.escape(
                                order.customer.email
                            )}
                        </span>

                        <span>
                            ${this.escape(
                                order.customer.phone
                            )}
                        </span>

                    </div>

                </div>

            </div>



            <div class="detail-section">

                <div class="detail-title">
                    Product
                </div>


                <div class="detail-items">

                    <div class="detail-item">

                        <div class="detail-item-info">

                            <div class="detail-item-image">

                                <i
                                    class="bi bi-box-seam"
                                    style="
                                        font-size:20px;
                                        color:#2563eb;
                                    ">
                                </i>

                            </div>


                            <div
                                class="detail-item-name">

                                <strong>

                                    ${this.escape(
                                        order.product
                                    )}

                                </strong>

                                <span>

                                    Quantity:
                                    ${order.quantity}

                                </span>

                            </div>

                        </div>


                        <strong
                            class="detail-item-price">

                            ${this.currency(
                                order.total
                            )}

                        </strong>

                    </div>

                </div>


                <div class="detail-total">

                    <span>
                        Order Total
                    </span>

                    <strong>

                        ${this.currency(
                            order.total
                        )}

                    </strong>

                </div>

            </div>



            <div class="detail-section">

                <div class="detail-title">
                    Delivery Address
                </div>


                <div class="detail-customer">

                    <i
                        class="bi bi-geo-alt"
                        style="
                            color:#2563eb;
                            font-size:18px;
                        ">
                    </i>


                    <div>

                        <strong>
                            ${this.escape(
                                order.address.line
                            )}
                        </strong>

                        <span>

                            ${this.escape(
                                order.address.city
                            )},
                            ${this.escape(
                                order.address.state
                            )}

                        </span>

                        <span>

                            PIN:
                            ${this.escape(
                                order.address.pin
                            )}

                        </span>

                    </div>

                </div>

            </div>

        `;

    },


    /* =====================================================
       STATUS
    ===================================================== */

    openStatus: function (id) {

        const order =
            this.orders.find(
                item =>
                    item.id === id
            );


        if (!order) {
            return;
        }


        this.selectedOrder =
            order;


        document
            .getElementById(
                "new-status"
            )
            .value =
            order.status;


        this.statusModal.classList.add(
            "show"
        );

    },


    updateStatus: function () {

        if (!this.selectedOrder) {
            return;
        }


        const newStatus =
            document
                .getElementById(
                    "new-status"
                )
                .value;


        this.selectedOrder.status =
            newStatus;


        this.save();

        this.updateStats();

        this.render();

        this.closeStatus();


        this.toast(
            "Order status updated successfully."
        );

    },


    /* =====================================================
       CLOSE MODALS
    ===================================================== */

    closeDetails: function () {

        this.detailsModal.classList.remove(
            "show"
        );

    },


    closeStatus: function () {

        this.statusModal.classList.remove(
            "show"
        );

        this.selectedOrder =
            null;

    },


    /* =====================================================
       STATS
    ===================================================== */

    updateStats: function () {

        const total =
            this.orders.length;


        const pending =
            this.countStatus(
                "pending"
            );


        const shipped =
            this.countStatus(
                "shipped"
            );


        const revenue =
            this.orders
                .filter(
                    order =>
                        order.payment ===
                        "paid"
                )
                .reduce(
                    (
                        sum,
                        order
                    ) =>
                        sum +
                        order.total,
                    0
                );


        document
            .getElementById(
                "total-orders"
            )
            .textContent =
            total;


        document
            .getElementById(
                "pending-orders"
            )
            .textContent =
            pending;


        document
            .getElementById(
                "shipped-orders"
            )
            .textContent =
            shipped;


        document
            .getElementById(
                "total-revenue"
            )
            .textContent =
            this.currency(
                revenue
            );


        document
            .getElementById(
                "sidebar-order-count"
            )
            .textContent =
            total;


        this.setCount(
            "count-all",
            total
        );

        this.setCount(
            "count-pending",
            this.countStatus(
                "pending"
            )
        );

        this.setCount(
            "count-processing",
            this.countStatus(
                "processing"
            )
        );

        this.setCount(
            "count-shipped",
            this.countStatus(
                "shipped"
            )
        );

        this.setCount(
            "count-delivered",
            this.countStatus(
                "delivered"
            )
        );

        this.setCount(
            "count-cancelled",
            this.countStatus(
                "cancelled"
            )
        );

    },


    countStatus: function (status) {

        return this.orders.filter(
            order =>
                order.status ===
                status
        ).length;

    },


    setCount: function (
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );

        if (element) {
            element.textContent =
                value;
        }

    },


    /* =====================================================
       PAGINATION
    ===================================================== */

    paginationHTML: function () {

        const pages =
            Math.ceil(
                this.filtered.length /
                this.perPage
            );


        if (pages <= 1) {

            this.pagination.innerHTML =
                "";

            return;

        }


        let html = "";


        html += `

            <button
                class="page-btn"
                ${this.currentPage === 1
                    ? "disabled"
                    : ""}
                onclick="
                    OrdersPage.goPage(
                        ${this.currentPage - 1}
                    )
                ">

                <i class="bi bi-chevron-left"></i>

            </button>

        `;


        for (
            let i = 1;
            i <= pages;
            i++
        ) {

            html += `

                <button
                    class="
                        page-btn
                        ${
                            i ===
                            this.currentPage
                                ? "active"
                                : ""
                        }
                    "
                    onclick="
                        OrdersPage.goPage(
                            ${i}
                        )
                    ">

                    ${i}

                </button>

            `;

        }


        html += `

            <button
                class="page-btn"
                ${this.currentPage === pages
                    ? "disabled"
                    : ""}
                onclick="
                    OrdersPage.goPage(
                        ${this.currentPage + 1}
                    )
                ">

                <i class="bi bi-chevron-right"></i>

            </button>

        `;


        this.pagination.innerHTML =
            html;

    },


    goPage: function (page) {

        const pages =
            Math.ceil(
                this.filtered.length /
                this.perPage
            );


        if (
            page < 1 ||
            page > pages
        ) {
            return;
        }


        this.currentPage =
            page;


        this.render();

    },


    /* =====================================================
       CLEAR
    ===================================================== */

    clearFilters: function () {

        this.search.value =
            "";

        this.payment.value =
            "all";

        this.date.value =
            "all";

        this.sort.value =
            "latest";

        this.activeStatus =
            "all";

        this.currentPage =
            1;


        document
            .querySelectorAll(
                ".status-tab"
            )
            .forEach(
                button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.status ===
                        "all"
                    );

                }
            );


        this.render();

    },


    /* =====================================================
       EXPORT
    ===================================================== */

    export: function () {

        const csvRows = [];


        csvRows.push(
            [
                "Order ID",
                "Customer",
                "Email",
                "Product",
                "Quantity",
                "Payment",
                "Status",
                "Total",
                "Date"
            ].join(",")
        );


        this.orders.forEach(
            order => {

                csvRows.push(

                    [
                        order.id,
                        order.customer.name,
                        order.customer.email,
                        order.product,
                        order.quantity,
                        order.payment,
                        order.status,
                        order.total,
                        order.date
                    ]
                        .map(
                            value =>
                                `"${String(
                                    value
                                ).replace(
                                    /"/g,
                                    '""'
                                )}"`
                        )
                        .join(",")

                );

            }
        );


        const blob =
            new Blob(
                [
                    csvRows.join(
                        "\n"
                    )
                ],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;

        link.download =
            "soleai-orders.csv";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );


        this.toast(
            "Orders exported successfully."
        );

    },


    /* =====================================================
       HELPERS
    ===================================================== */

    currency: function (value) {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style:
                    "currency",

                currency:
                    "INR",

                maximumFractionDigits:
                    0
            }
        ).format(
            value || 0
        );

    },


    formatDate: function (date) {

        return date.toLocaleDateString(
            "en-IN",
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"
            }
        );

    },


    formatTime: function (date) {

        return date.toLocaleTimeString(
            "en-IN",
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit"
            }
        );

    },


    initials: function (name) {

        return name
            .split(" ")
            .map(
                part =>
                    part[0]
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();

    },


    paymentLabel: function (
        payment
    ) {

        const labels = {

            paid:
                "Paid",

            pending:
                "Pending",

            failed:
                "Failed",

            refunded:
                "Refunded"

        };


        return (
            labels[payment] ||
            payment
        );

    },


    paymentIcon: function (
        payment
    ) {

        const icons = {

            paid:
                "bi-check-circle",

            pending:
                "bi-clock",

            failed:
                "bi-x-circle",

            refunded:
                "bi-arrow-counterclockwise"

        };


        return (
            icons[payment] ||
            "bi-circle"
        );

    },


    statusLabel: function (
        status
    ) {

        const labels = {

            pending:
                "Pending",

            processing:
                "Processing",

            shipped:
                "Shipped",

            delivered:
                "Delivered",

            cancelled:
                "Cancelled"

        };


        return (
            labels[status] ||
            status
        );

    },


    statusIcon: function (
        status
    ) {

        const icons = {

            pending:
                "bi-clock",

            processing:
                "bi-gear",

            shipped:
                "bi-truck",

            delivered:
                "bi-check-circle",

            cancelled:
                "bi-x-circle"

        };


        return (
            icons[status] ||
            "bi-circle"
        );

    },


    escape: function (value) {

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

    },


    js: function (value) {

        return String(
            value
        )
            .replace(
                /\\/g,
                "\\\\"
            )
            .replace(
                /'/g,
                "\\'"
            );

    },


    /* =====================================================
       TOAST
    ===================================================== */

    toast: function (message) {

        const toast =
            document.getElementById(
                "toast"
            );


        document
            .getElementById(
                "toast-message"
            )
            .textContent =
            message;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            this.toastTimer
        );


        this.toastTimer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                2500
            );

    }

};