"use strict";


/* =========================================================
   SOLEAI ADMIN — INVENTORY
========================================================= */


/* =========================================================
   INVENTORY DATA
========================================================= */

const inventoryProducts = [

    {
        id: 1,

        name:
            "Nike Air Zoom Pegasus 41",

        brand:
            "Nike",

        category:
            "running",

        sku:
            "NK-P41-001",

        stock:
            42,

        price:
            6999,

        image:
            "../assets/images/products/download3.png"

    },


    {
        id: 2,

        name:
            "Adidas Adizero SL",

        brand:
            "Adidas",

        category:
            "running",

        sku:
            "AD-SL-002",

        stock:
            8,

        price:
            6499,

        image:
            "../assets/images/products/download1.png"

    },


    {
        id: 3,

        name:
            "Puma Future Rider",

        brand:
            "Puma",

        category:
            "lifestyle",

        sku:
            "PM-FR-003",

        stock:
            24,

        price:
            4999,

        image:
            "../assets/images/products/download5.png"

    },


    {
        id: 4,

        name:
            "New Balance Fresh Foam 1080",

        brand:
            "New Balance",

        category:
            "running",

        sku:
            "NB-1080-004",

        stock:
            5,

        price:
            7999,

        image:
            "../assets/images/products/download2.png"

    },


    {
        id: 5,

        name:
            "Nike Revolution 7",

        brand:
            "Nike",

        category:
            "running",

        sku:
            "NK-R7-005",

        stock:
            0,

        price:
            4299,

        image:
            "../assets/images/products/download4.png"

    },


    {
        id: 6,

        name:
            "Adidas Runfalcon 5",

        brand:
            "Adidas",

        category:
            "running",

        sku:
            "AD-RF-006",

        stock:
            18,

        price:
            3899,

        image:
            "../assets/images/products/download2.png"

    },


    {
        id: 7,

        name:
            "SoleAI Court Pro",

        brand:
            "SoleAI",

        category:
            "sports",

        sku:
            "SA-CP-007",

        stock:
            67,

        price:
            5799,

        image:
            "../assets/images/products/download3.png"

    },


    {
        id: 8,

        name:
            "SoleAI Street Classic",

        brand:
            "SoleAI",

        category:
            "casual",

        sku:
            "SA-SC-008",

        stock:
            13,

        price:
            4499,

        image:
            "../assets/images/products/download5.png"

    }

];


let filteredProducts =
    [...inventoryProducts];

let currentPage = 1;

const productsPerPage = 6;


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeInventory
);


function initializeInventory() {

    renderInventory();

    updateStatistics();

    setupSearch();

    setupFilters();

    setupSorting();

    setupRefresh();

    setupAddStock();

    setupMobileMenu();

    setupLogout();

}


/* =========================================================
   STATUS
========================================================= */

function getStockStatus(
    stock
) {

    if (stock <= 0) {

        return {
            className:
                "status-out-stock",

            label:
                "Out of Stock"

        };

    }


    if (stock <= 10) {

        return {
            className:
                "status-low-stock",

            label:
                "Low Stock"

        };

    }


    return {

        className:
            "status-in-stock",

        label:
            "In Stock"

    };

}


/* =========================================================
   RENDER
========================================================= */

function renderInventory() {

    const tbody =
        document.getElementById(
            "inventoryTableBody"
        );

    const emptyState =
        document.getElementById(
            "emptyState"
        );

    if (!tbody) return;


    const start =
        (currentPage - 1) *
        productsPerPage;


    const end =
        start +
        productsPerPage;


    const pageProducts =
        filteredProducts.slice(
            start,
            end
        );


    tbody.innerHTML = "";


    if (
        filteredProducts.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";

        }

        renderPagination();

        updateResultCount();

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    pageProducts.forEach(
        product => {

            const status =
                getStockStatus(
                    product.stock
                );


            const stockValue =
                product.stock *
                product.price;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <div class="product-cell">

                        <div class="product-image">

                            <img
                                src="${product.image}"
                                alt="${escapeHTML(product.name)}"
                                onerror="this.style.display='none';">

                        </div>


                        <div class="product-info">

                            <strong>
                                ${escapeHTML(product.name)}
                            </strong>

                            <span>
                                ${escapeHTML(product.brand)}
                            </span>

                        </div>

                    </div>

                </td>


                <td>
                    ${formatCategory(product.category)}
                </td>


                <td>

                    <span class="sku">
                        ${product.sku}
                    </span>

                </td>


                <td>

                    <span class="stock-number">
                        ${product.stock}
                    </span>

                    <span class="stock-unit">
                        units
                    </span>

                </td>


                <td>
                    ${formatCurrency(product.price)}
                </td>


                <td>
                    ${formatCurrency(stockValue)}
                </td>


                <td>

                    <span class="status-badge ${status.className}">
                        ${status.label}
                    </span>

                </td>


                <td>

                    <div class="action-group">


                        <button
                            type="button"
                            class="action-btn"
                            title="Add stock"
                            data-action="add"
                            data-id="${product.id}">

                            <i class="bi bi-plus-lg"></i>

                        </button>


                        <button
                            type="button"
                            class="action-btn"
                            title="Edit"
                            data-action="edit"
                            data-id="${product.id}">

                            <i class="bi bi-pencil"></i>

                        </button>


                        <button
                            type="button"
                            class="action-btn danger"
                            title="Delete"
                            data-action="delete"
                            data-id="${product.id}">

                            <i class="bi bi-trash3"></i>

                        </button>


                    </div>

                </td>

            `;


            tbody.appendChild(row);

        }
    );


    setupRowActions();

    renderPagination();

    updateResultCount();

}


/* =========================================================
   CATEGORY
========================================================= */

function formatCategory(
    category
) {

    return category
        .charAt(0)
        .toUpperCase() +
        category.slice(1);

}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(
    value
) {

    return "₹" +
        Number(value)
            .toLocaleString(
                "en-IN"
            );

}


/* =========================================================
   ESCAPE
========================================================= */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /[&<>"']/g,
            character => {

                const map = {

                    "&": "&amp;",

                    "<": "&lt;",

                    ">": "&gt;",

                    '"': "&quot;",

                    "'": "&#039;"

                };

                return map[
                    character
                ];

            }
        );

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

    const total =
        inventoryProducts.length;


    const inStock =
        inventoryProducts.filter(
            product =>
                product.stock > 10
        ).length;


    const lowStock =
        inventoryProducts.filter(
            product =>
                product.stock > 0 &&
                product.stock <= 10
        ).length;


    const outStock =
        inventoryProducts.filter(
            product =>
                product.stock <= 0
        ).length;


    const totalValue =
        inventoryProducts.reduce(
            (
                total,
                product
            ) =>
                total +
                (
                    product.stock *
                    product.price
                ),
            0
        );


    setText(
        "totalProducts",
        total
    );


    setText(
        "inStockProducts",
        inStock
    );


    setText(
        "lowStockProducts",
        lowStock
    );


    setText(
        "outStockProducts",
        outStock
    );


    setText(
        "inventoryValue",
        formatCurrency(
            totalValue
        )
    );


    const percentage =
        total > 0
            ? Math.round(
                (
                    inStock /
                    total
                ) * 100
            )
            : 0;


    const health =
        document.getElementById(
            "healthFill"
        );


    if (health) {

        health.style.width =
            percentage + "%";

    }

}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "inventorySearch"
        );

    if (!input) return;


    input.addEventListener(
        "input",
        applyFilters
    );

}


/* =========================================================
   FILTERS
========================================================= */

function setupFilters() {

    const category =
        document.getElementById(
            "categoryFilter"
        );

    const stock =
        document.getElementById(
            "stockFilter"
        );


    if (category) {

        category.addEventListener(
            "change",
            applyFilters
        );

    }


    if (stock) {

        stock.addEventListener(
            "change",
            applyFilters
        );

    }


    const clear =
        document.getElementById(
            "clearFilters"
        );


    if (clear) {

        clear.addEventListener(
            "click",
            clearFilters
        );

    }

}


/* =========================================================
   APPLY FILTERS
========================================================= */

function applyFilters() {

    const search =
        document
            .getElementById(
                "inventorySearch"
            )
            ?.value
            .trim()
            .toLowerCase() || "";


    const category =
        document
            .getElementById(
                "categoryFilter"
            )
            ?.value || "all";


    const stock =
        document
            .getElementById(
                "stockFilter"
            )
            ?.value || "all";


    filteredProducts =
        inventoryProducts.filter(
            product => {


                const matchesSearch =
                    !search ||
                    product.name
                        .toLowerCase()
                        .includes(search) ||
                    product.brand
                        .toLowerCase()
                        .includes(search) ||
                    product.category
                        .toLowerCase()
                        .includes(search) ||
                    product.sku
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    category === "all" ||
                    product.category ===
                        category;


                let matchesStock = true;


                if (
                    stock ===
                    "in-stock"
                ) {

                    matchesStock =
                        product.stock > 10;

                }


                if (
                    stock ===
                    "low-stock"
                ) {

                    matchesStock =
                        product.stock > 0 &&
                        product.stock <= 10;

                }


                if (
                    stock ===
                    "out-of-stock"
                ) {

                    matchesStock =
                        product.stock <= 0;

                }


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesStock
                );

            }
        );


    currentPage = 1;

    renderInventory();

}


/* =========================================================
   CLEAR
========================================================= */

function clearFilters() {

    const search =
        document.getElementById(
            "inventorySearch"
        );

    const category =
        document.getElementById(
            "categoryFilter"
        );

    const stock =
        document.getElementById(
            "stockFilter"
        );


    if (search) search.value = "";

    if (category) category.value = "all";

    if (stock) stock.value = "all";


    filteredProducts =
        [...inventoryProducts];


    currentPage = 1;

    renderInventory();

}


/* =========================================================
   SORT
========================================================= */

function setupSorting() {

    const select =
        document.getElementById(
            "sortInventory"
        );

    if (!select) return;


    select.addEventListener(
        "change",
        event => {

            const value =
                event.target.value;


            if (
                value === "name"
            ) {

                filteredProducts.sort(
                    (a, b) =>
                        a.name.localeCompare(
                            b.name
                        )
                );

            }


            if (
                value === "stock-low"
            ) {

                filteredProducts.sort(
                    (a, b) =>
                        a.stock -
                        b.stock
                );

            }


            if (
                value === "stock-high"
            ) {

                filteredProducts.sort(
                    (a, b) =>
                        b.stock -
                        a.stock
                );

            }


            if (
                value === "value-high"
            ) {

                filteredProducts.sort(
                    (a, b) =>
                        (
                            b.stock *
                            b.price
                        ) -
                        (
                            a.stock *
                            a.price
                        )
                );

            }


            currentPage = 1;

            renderInventory();

        }
    );

}


/* =========================================================
   RESULT COUNT
========================================================= */

function updateResultCount() {

    setText(
        "resultCount",
        filteredProducts.length
    );

}


/* =========================================================
   PAGINATION
========================================================= */

function renderPagination() {

    const container =
        document.getElementById(
            "pagination"
        );

    if (!container) return;


    const pages =
        Math.ceil(
            filteredProducts.length /
            productsPerPage
        );


    container.innerHTML = "";


    if (pages <= 1) {
        return;
    }


    for (
        let page = 1;
        page <= pages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type = "button";

        button.className =
            "page-btn" +
            (
                page === currentPage
                    ? " active"
                    : ""
            );


        button.textContent =
            page;


        button.addEventListener(
            "click",
            () => {

                currentPage =
                    page;

                renderInventory();

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );


        container.appendChild(
            button
        );

    }

}


/* =========================================================
   ROW ACTIONS
========================================================= */

function setupRowActions() {

    document
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.id
                            );


                        const action =
                            button.dataset.action;


                        handleAction(
                            action,
                            id
                        );

                    }
                );

            }
        );

}


/* =========================================================
   ACTION HANDLER
========================================================= */

function handleAction(
    action,
    id
) {

    const product =
        inventoryProducts.find(
            item =>
                item.id === id
        );


    if (!product) return;


    if (
        action === "add"
    ) {

        const amount =
            Number(
                window.prompt(
                    `Add stock for ${product.name}:`,
                    "10"
                )
            );


        if (
            Number.isFinite(amount) &&
            amount > 0
        ) {

            product.stock +=
                Math.floor(amount);


            filteredProducts =
                [...inventoryProducts];


            updateStatistics();

            renderInventory();

        }

    }


    if (
        action === "edit"
    ) {

        const newStock =
            Number(
                window.prompt(
                    `Update stock for ${product.name}:`,
                    String(
                        product.stock
                    )
                )
            );


        if (
            Number.isFinite(newStock) &&
            newStock >= 0
        ) {

            product.stock =
                Math.floor(
                    newStock
                );


            updateStatistics();

            renderInventory();

        }

    }


    if (
        action === "delete"
    ) {

        const confirmed =
            window.confirm(
                `Remove ${product.name} from inventory?`
            );


        if (!confirmed) {
            return;
        }


        const index =
            inventoryProducts.findIndex(
                item =>
                    item.id === id
            );


        if (index !== -1) {

            inventoryProducts.splice(
                index,
                1
            );

        }


        filteredProducts =
            [...inventoryProducts];


        updateStatistics();

        renderInventory();

    }

}


/* =========================================================
   REFRESH
========================================================= */

function setupRefresh() {

    const button =
        document.getElementById(
            "refreshBtn"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            button.disabled = true;


            const original =
                button.innerHTML;


            button.innerHTML = `

                <i class="bi bi-arrow-repeat"></i>

                Refreshing...

            `;


            setTimeout(
                () => {

                    button.disabled =
                        false;

                    button.innerHTML =
                        original;

                    updateStatistics();

                    renderInventory();

                },
                600
            );

        }
    );

}


/* =========================================================
   ADD STOCK
========================================================= */

function setupAddStock() {

    const button =
        document.getElementById(
            "addStockBtn"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const productName =
                window.prompt(
                    "Enter product name:"
                );


            if (!productName) {
                return;
            }


            const stock =
                Number(
                    window.prompt(
                        "Enter stock quantity:",
                        "10"
                    )
                );


            if (
                !Number.isFinite(stock) ||
                stock < 0
            ) {

                window.alert(
                    "Please enter a valid stock quantity."
                );

                return;

            }


            const price =
                Number(
                    window.prompt(
                        "Enter product price:",
                        "4999"
                    )
                );


            if (
                !Number.isFinite(price) ||
                price < 0
            ) {

                window.alert(
                    "Please enter a valid price."
                );

                return;

            }


            inventoryProducts.push({

                id:
                    Date.now(),

                name:
                    productName,

                brand:
                    "SoleAI",

                category:
                    "casual",

                sku:
                    "SA-" +
                    Date.now()
                        .toString()
                        .slice(-6),

                stock:
                    Math.floor(stock),

                price:
                    Math.floor(price),

                image:
                    "../assets/images/products/download3.png"

            });


            filteredProducts =
                [...inventoryProducts];


            currentPage = 1;

            updateStatistics();

            renderInventory();

        }
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const sidebar =
        document.getElementById(
            "adminSidebar"
        );

    const button =
        document.getElementById(
            "menuToggle"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (!sidebar || !button) {
        return;
    }


    function closeMenu() {

        sidebar.classList.remove(
            "open"
        );

        if (overlay) {

            overlay.classList.remove(
                "show"
            );

        }

        document.body.style.overflow =
            "";

    }


    button.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );


            if (overlay) {

                overlay.classList.toggle(
                    "show"
                );

            }


            document.body.style.overflow =
                sidebar.classList.contains(
                    "open"
                )
                    ? "hidden"
                    : "";

        }
    );


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeMenu
        );

    }


    sidebar
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            }
        );

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    const button =
        document.getElementById(
            "logoutBtn"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {
                return;
            }


            window.location.href =
                "../index.html";

        }
    );

}