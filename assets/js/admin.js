/* ============================================================
   SOLEAI ADMIN
   admin.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    Admin.init();

});


const Admin = {

    /* ========================================================
       INITIALIZE
    ======================================================== */

    init() {

        this.cacheElements();

        this.sidebar();

        this.search();

        this.notifications();

        this.profileMenu();

        this.chart();

        this.exportData();

        this.logout();

        this.loadDashboardData();

        this.updateActivePage();

    },


    /* ========================================================
       CACHE ELEMENTS
    ======================================================== */

    cacheElements() {

        this.sidebarElement =
            document.getElementById("adminSidebar");

        this.sidebarToggle =
            document.getElementById("sidebar-toggle");

        this.sidebarOverlay =
            document.getElementById(
                "admin-sidebar-overlay"
            );

        this.searchButton =
            document.getElementById(
                "admin-search-btn"
            );

        this.searchModal =
            document.getElementById(
                "admin-search-modal"
            );

        this.searchInput =
            document.getElementById(
                "admin-search-input"
            );

        this.searchResults =
            document.getElementById(
                "admin-search-results"
            );

        this.closeSearch =
            document.getElementById(
                "close-search"
            );

        this.notificationButton =
            document.getElementById(
                "notification-btn"
            );

        this.notificationPanel =
            document.getElementById(
                "notification-panel"
            );

        this.closeNotifications =
            document.getElementById(
                "close-notifications"
            );

        this.logoutButton =
            document.getElementById(
                "admin-logout"
            );

        this.exportButton =
            document.getElementById(
                "export-data-btn"
            );

        this.revenuePeriod =
            document.getElementById(
                "revenue-period"
            );

    },


    /* ========================================================
       SIDEBAR
    ======================================================== */

    sidebar() {

        if (!this.sidebarToggle) {
            return;
        }


        this.sidebarToggle.addEventListener(
            "click",
            () => {

                this.sidebarElement
                    ?.classList
                    .toggle("active");

                this.sidebarOverlay
                    ?.classList
                    .toggle("active");

                document.body.classList.toggle(
                    "admin-menu-open"
                );

            }
        );


        this.sidebarOverlay?.addEventListener(
            "click",
            () => {

                this.closeSidebar();

            }
        );


        document
            .querySelectorAll(
                ".admin-nav-link"
            )
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        if (
                            window.innerWidth <= 900
                        ) {

                            this.closeSidebar();

                        }

                    }
                );

            });


        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth > 900
                ) {

                    this.closeSidebar();

                }

            }
        );

    },


    closeSidebar() {

        this.sidebarElement
            ?.classList
            .remove("active");

        this.sidebarOverlay
            ?.classList
            .remove("active");

        document.body.classList.remove(
            "admin-menu-open"
        );

    },


    /* ========================================================
       SEARCH
    ======================================================== */

    search() {

        this.searchButton?.addEventListener(
            "click",
            () => {

                this.openSearch();

            }
        );


        this.closeSearch?.addEventListener(
            "click",
            () => {

                this.closeSearchModal();

            }
        );


        this.searchModal?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    this.searchModal
                ) {

                    this.closeSearchModal();

                }

            }
        );


        this.searchInput?.addEventListener(
            "input",
            event => {

                this.performSearch(
                    event.target.value.trim()
                );

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "/" &&
                    !this.isTyping(event.target)
                ) {

                    event.preventDefault();

                    this.openSearch();

                }


                if (
                    event.key === "Escape"
                ) {

                    this.closeSearchModal();

                    this.closeNotificationPanel();

                }

            }
        );

    },


    openSearch() {

        if (!this.searchModal) {
            return;
        }


        this.searchModal.classList.add(
            "active"
        );


        this.searchModal.setAttribute(
            "aria-hidden",
            "false"
        );


        setTimeout(
            () => {

                this.searchInput?.focus();

            },
            80
        );

    },


    closeSearchModal() {

        if (!this.searchModal) {
            return;
        }


        this.searchModal.classList.remove(
            "active"
        );


        this.searchModal.setAttribute(
            "aria-hidden",
            "true"
        );


        if (this.searchInput) {

            this.searchInput.value = "";

        }


        if (this.searchResults) {

            this.searchResults.innerHTML = `

                <span>
                    Start typing to search.
                </span>

            `;

        }

    },


    performSearch(query) {

        if (!this.searchResults) {
            return;
        }


        if (!query) {

            this.searchResults.innerHTML = `

                <span>
                    Start typing to search.
                </span>

            `;

            return;

        }


        const searchablePages = [

            {
                name: "Dashboard",
                type: "Page",
                url: "dashboard.html",
                icon: "bi-grid-1x2-fill"
            },

            {
                name: "Products",
                type: "Store",
                url: "products.html",
                icon: "bi-box-seam"
            },

            {
                name: "Orders",
                type: "Store",
                url: "orders.html",
                icon: "bi-bag-check"
            },

            {
                name: "Inventory",
                type: "Store",
                url: "inventory.html",
                icon: "bi-boxes"
            },

            {
                name: "Customers",
                type: "Customers",
                url: "users.html",
                icon: "bi-people"
            },

            {
                name: "Analytics",
                type: "Main",
                url: "analytics.html",
                icon: "bi-bar-chart-line"
            },

            {
                name: "Categories",
                type: "Store",
                url: "categories.html",
                icon: "bi-grid"
            },

            {
                name: "Coupons",
                type: "Marketing",
                url: "coupons.html",
                icon: "bi-ticket-perforated"
            },

            {
                name: "Reviews",
                type: "Customers",
                url: "reviews.html",
                icon: "bi-star"
            },

            {
                name: "Settings",
                type: "System",
                url: "settings.html",
                icon: "bi-gear"
            }

        ];


        const results =
            searchablePages.filter(
                item =>
                    item.name
                        .toLowerCase()
                        .includes(
                            query.toLowerCase()
                        )
            );


        if (!results.length) {

            this.searchResults.innerHTML = `

                <span>
                    No results found for
                    "<strong>${this.escapeHTML(query)}</strong>"
                </span>

            `;

            return;

        }


        this.searchResults.innerHTML =
            results.map(item => `

                <a
                    href="${item.url}"
                    class="admin-search-result"
                    style="
                        display:flex;
                        align-items:center;
                        gap:10px;
                        padding:10px;
                        margin-bottom:4px;
                        border-radius:9px;
                        text-decoration:none;
                        color:#475569;
                    ">

                    <span
                        style="
                            width:30px;
                            height:30px;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            border-radius:8px;
                            background:#eff6ff;
                            color:#2563eb;
                        ">

                        <i class="bi ${item.icon}"></i>

                    </span>

                    <span style="flex:1">

                        <strong
                            style="
                                display:block;
                                font-size:8px;
                                color:#0f172a;
                            ">

                            ${this.escapeHTML(item.name)}

                        </strong>

                        <small
                            style="
                                display:block;
                                margin-top:3px;
                                font-size:6px;
                                color:#94a3b8;
                            ">

                            ${this.escapeHTML(item.type)}

                        </small>

                    </span>

                    <i
                        class="bi bi-arrow-up-right"
                        style="font-size:8px;color:#94a3b8;">
                    </i>

                </a>

            `).join("");

    },


    /* ========================================================
       NOTIFICATIONS
    ======================================================== */

    notifications() {

        this.notificationButton?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                this.toggleNotificationPanel();

            }
        );


        this.closeNotifications?.addEventListener(
            "click",
            () => {

                this.closeNotificationPanel();

            }
        );


        document.addEventListener(
            "click",
            event => {

                if (
                    this.notificationPanel &&
                    !this.notificationPanel.contains(
                        event.target
                    ) &&
                    !this.notificationButton?.contains(
                        event.target
                    )
                ) {

                    this.closeNotificationPanel();

                }

            }
        );

    },


    toggleNotificationPanel() {

        this.notificationPanel
            ?.classList
            .toggle("active");

    },


    closeNotificationPanel() {

        this.notificationPanel
            ?.classList
            .remove("active");

    },


    /* ========================================================
       PROFILE MENU
    ======================================================== */

    profileMenu() {

        const profileButton =
            document.querySelector(
                ".admin-profile-menu"
            );


        profileButton?.addEventListener(
            "click",
            () => {

                this.showToast(
                    "Admin profile settings are coming soon."
                );

            }
        );


        const topbarUser =
            document.querySelector(
                ".topbar-user"
            );


        topbarUser?.addEventListener(
            "click",
            () => {

                this.showToast(
                    "Administrator account"
                );

            }
        );

    },


    /* ========================================================
       CHART
    ======================================================== */

    chart() {

        if (!this.revenuePeriod) {
            return;
        }


        this.revenuePeriod.addEventListener(
            "change",
            event => {

                const period =
                    event.target.value;


                this.updateChart(
                    period
                );

            }
        );


        this.addChartHover();

    },


    updateChart(period) {

        const tooltip =
            document.getElementById(
                "chart-tooltip"
            );


        const values = {

            "Last 7 days": {
                amount: "₹32,480",
                growth: "+8.2%"
            },

            "Last 30 days": {
                amount: "₹1,24,580",
                growth: "+18.4%"
            },

            "Last 90 days": {
                amount: "₹3,48,920",
                growth: "+24.8%"
            },

            "This year": {
                amount: "₹12,84,650",
                growth: "+31.6%"
            }

        };


        const selected =
            values[period] ||
            values["Last 30 days"];


        const summary =
            document.querySelector(
                ".chart-summary strong"
            );


        const growth =
            document.querySelector(
                ".chart-summary span"
            );


        if (summary) {

            summary.textContent =
                selected.amount;

        }


        if (growth) {

            growth.innerHTML = `

                <i class="bi bi-arrow-up"></i>

                ${selected.growth}

            `;

        }


        if (tooltip) {

            tooltip.querySelector(
                "strong"
            ).textContent =
                selected.amount;

        }


        this.showToast(
            `Revenue updated: ${period}`
        );

    },


    addChartHover() {

        const chart =
            document.getElementById(
                "revenue-chart"
            );


        const tooltip =
            document.getElementById(
                "chart-tooltip"
            );


        if (
            !chart ||
            !tooltip
        ) {

            return;

        }


        chart.addEventListener(
            "mousemove",
            event => {

                const rect =
                    chart.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const percent =
                    Math.max(
                        10,
                        Math.min(
                            90,
                            (x / rect.width) *
                            100
                        )
                    );


                tooltip.style.left =
                    `${percent}%`;

            }
        );

    },


    /* ========================================================
       EXPORT DATA
    ======================================================== */

    exportData() {

        this.exportButton?.addEventListener(
            "click",
            () => {

                const data =
                    this.createExportData();


                const blob =
                    new Blob(
                        [
                            JSON.stringify(
                                data,
                                null,
                                2
                            )
                        ],
                        {
                            type:
                                "application/json"
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
                    `soleai-admin-export-${this.getDateString()}.json`;


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                URL.revokeObjectURL(
                    url
                );


                this.showToast(
                    "Dashboard data exported successfully."
                );

            }
        );

    },


    createExportData() {

        return {

            exportedAt:
                new Date().toISOString(),

            platform:
                "SoleAI",

            dashboard: {

                revenue:
                    document
                        .getElementById(
                            "total-revenue"
                        )
                        ?.textContent
                        .trim(),

                orders:
                    document
                        .getElementById(
                            "total-orders"
                        )
                        ?.textContent
                        .trim(),

                customers:
                    document
                        .getElementById(
                            "total-customers"
                        )
                        ?.textContent
                        .trim(),

                products:
                    document
                        .getElementById(
                            "total-products"
                        )
                        ?.textContent
                        .trim()

            },

            localStorage: {
                cart:
                    this.getStorage(
                        "soleai-cart"
                    ),

                wishlist:
                    this.getStorage(
                        "soleai-wishlist"
                    ),

                orders:
                    this.getStorage(
                        "soleai-orders"
                    )

            }

        };

    },


    /* ========================================================
       LOAD DASHBOARD DATA
    ======================================================== */

    loadDashboardData() {

        const products =
            this.getStorage(
                "soleai-products"
            );


        const cart =
            this.getStorage(
                "soleai-cart"
            );


        const orders =
            this.getStorage(
                "soleai-orders"
            );


        /*
         * Product count
         */

        if (
            Array.isArray(products) &&
            products.length
        ) {

            this.setText(
                "total-products",
                products.length
            );


            this.setText(
                "product-count-badge",
                products.length
            );

        }


        /*
         * Cart/order count.
         *
         * This does not overwrite the
         * demo numbers unless real
         * order data exists.
         */

        if (
            Array.isArray(orders) &&
            orders.length
        ) {

            this.setText(
                "total-orders",
                orders.length
            );


            this.setText(
                "order-count-badge",
                orders.length
            );

        }


        /*
         * Refresh product count
         * from product-data.js
         */

        this.loadProductData();

    },


    /* ========================================================
       PRODUCT DATA INTEGRATION
    ======================================================== */

    loadProductData() {

        let productList = null;


        if (
            typeof products !== "undefined" &&
            Array.isArray(products)
        ) {

            productList =
                products;

        }


        else if (
            typeof productData !== "undefined" &&
            Array.isArray(productData)
        ) {

            productList =
                productData;

        }


        else if (
            typeof PRODUCT_DATA !== "undefined" &&
            Array.isArray(PRODUCT_DATA)
        ) {

            productList =
                PRODUCT_DATA;

        }


        else if (
            typeof PRODUCTS !== "undefined" &&
            Array.isArray(PRODUCTS)
        ) {

            productList =
                PRODUCTS;

        }


        if (
            Array.isArray(productList)
        ) {

            this.setText(
                "total-products",
                productList.length
            );


            this.setText(
                "product-count-badge",
                productList.length
            );

        }

    },


    /* ========================================================
       LOGOUT
    ======================================================== */

    logout() {

        this.logoutButton?.addEventListener(
            "click",
            () => {

                const confirmed =
                    window.confirm(
                        "Are you sure you want to leave the SoleAI Admin Panel?"
                    );


                if (!confirmed) {
                    return;
                }


                /*
                 * Frontend prototype:
                 * remove admin session if present.
                 */

                localStorage.removeItem(
                    "soleai-admin-session"
                );


                this.showToast(
                    "Admin session ended."
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "../index.html";

                    },
                    800
                );

            }
        );

    },


    /* ========================================================
       ACTIVE PAGE
    ======================================================== */

    updateActivePage() {

        const currentPage =
            window.location.pathname
                .split("/")
                .pop();


        document
            .querySelectorAll(
                ".admin-nav-link"
            )
            .forEach(link => {

                const href =
                    link
                        .getAttribute("href")
                        ?.split("/")
                        .pop();


                if (
                    href === currentPage
                ) {

                    link.classList.add(
                        "active"
                    );

                }

                else {

                    link.classList.remove(
                        "active"
                    );

                }

            });

    },


    /* ========================================================
       TOAST
    ======================================================== */

    showToast(message) {

        let toast =
            document.getElementById(
                "admin-toast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );


            toast.id =
                "admin-toast";


            toast.innerHTML = `

                <i class="bi bi-check-circle-fill"></i>

                <span></span>

            `;


            toast.style.cssText = `

                position:fixed;
                right:24px;
                bottom:24px;
                z-index:5000;

                display:flex;
                align-items:center;
                gap:9px;

                min-height:42px;
                padding:0 14px;

                border:1px solid #e2e8f0;
                border-radius:10px;

                background:#ffffff;

                color:#334155;

                box-shadow:
                    0 18px 45px
                    rgba(15,23,42,.12);

                font-family:Inter,Arial,sans-serif;
                font-size:8px;
                font-weight:700;

                transform:
                    translateY(15px);

                opacity:0;

                transition:
                    opacity .25s ease,
                    transform .25s ease;

            `;


            document.body.appendChild(
                toast
            );

        }


        const text =
            toast.querySelector(
                "span"
            );


        if (text) {

            text.textContent =
                message;

        }


        requestAnimationFrame(
            () => {

                toast.style.opacity =
                    "1";

                toast.style.transform =
                    "translateY(0)";

            }
        );


        clearTimeout(
            this.toastTimer
        );


        this.toastTimer =
            setTimeout(
                () => {

                    toast.style.opacity =
                        "0";

                    toast.style.transform =
                        "translateY(15px)";

                },
                2600
            );

    },


    /* ========================================================
       STORAGE HELPER
    ======================================================== */

    getStorage(key) {

        try {

            const value =
                localStorage.getItem(
                    key
                );


            if (!value) {

                return [];

            }


            return JSON.parse(
                value
            );

        }
        catch {

            return [];

        }

    },


    /* ========================================================
       TEXT HELPER
    ======================================================== */

    setText(id, value) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.textContent =
                value;

        }

    },


    /* ========================================================
       TYPING CHECK
    ======================================================== */

    isTyping(element) {

        if (!element) {
            return false;
        }


        const tag =
            element.tagName?.toLowerCase();


        return (
            tag === "input" ||
            tag === "textarea" ||
            tag === "select" ||
            element.isContentEditable
        );

    },


    /* ========================================================
       ESCAPE HTML
    ======================================================== */

    escapeHTML(value) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            value ?? "";


        return div.innerHTML;

    },


    /* ========================================================
       DATE
    ======================================================== */

    getDateString() {

        const date =
            new Date();


        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );


        return `${year}-${month}-${day}`;

    }

};