"use strict";


/* =========================================================
   SOLEAI ADMIN — CATEGORIES
========================================================= */


/* =========================================================
   DATA
========================================================= */

const categories = [

    {
        id: 1,

        name: "Running",

        description:
            "Performance shoes designed for running, training and everyday movement.",

        products: 42,

        status: "active",

        icon: "bi-lightning-charge",

        color: "blue"

    },


    {
        id: 2,

        name: "Sneakers",

        description:
            "Modern sneakers combining street style, comfort and everyday versatility.",

        products: 31,

        status: "active",

        icon: "bi-stars",

        color: "purple"

    },


    {
        id: 3,

        name: "Sports",

        description:
            "High-performance footwear built for sports and active lifestyles.",

        products: 28,

        status: "active",

        icon: "bi-trophy",

        color: "green"

    },


    {
        id: 4,

        name: "Casual",

        description:
            "Comfortable everyday shoes designed for relaxed and casual occasions.",

        products: 24,

        status: "active",

        icon: "bi-person-walking",

        color: "orange"

    },


    {
        id: 5,

        name: "Lifestyle",

        description:
            "Fashion-focused footwear made for modern everyday lifestyles.",

        products: 18,

        status: "active",

        icon: "bi-heart",

        color: "pink"

    },


    {
        id: 6,

        name: "Walking",

        description:
            "Supportive footwear designed for walking and all-day comfort.",

        products: 7,

        status: "active",

        icon: "bi-signpost-2",

        color: "cyan"

    },


    {
        id: 7,

        name: "Training",

        description:
            "Stable and responsive footwear for gym workouts and training.",

        products: 4,

        status: "inactive",

        icon: "bi-barbell",

        color: "yellow"

    },


    {
        id: 8,

        name: "Premium",
        
        description:
            "Premium footwear with advanced materials and elevated craftsmanship.",

        products: 2,

        status: "active",

        icon: "bi-gem",

        color: "red"

    }

];


let filteredCategories =
    [...categories];


let editingCategoryId =
    null;


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeCategories
);


function initializeCategories() {

    renderCategories();

    updateStats();

    setupSearch();

    setupFilters();

    setupModal();

    setupRefresh();

    setupMobileMenu();

    setupLogout();

}


/* =========================================================
   RENDER
========================================================= */

function renderCategories() {

    const grid =
        document.getElementById(
            "categoryGrid"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (!grid) return;


    grid.innerHTML = "";


    if (
        filteredCategories.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";

        }

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    filteredCategories.forEach(
        category => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "category-card";


            const statusClass =
                category.status ===
                "active"

                    ? "status-active"

                    : "status-inactive";


            const statusText =
                category.status ===
                "active"

                    ? "Active"

                    : "Inactive";


            card.innerHTML = `

                <div class="category-card-top">

                    <div class="
                        category-icon
                        ${category.color}
                    ">

                        <i class="
                            bi
                            ${category.icon}
                        "></i>

                    </div>


                    <div class="category-actions">

                        <button
                            type="button"
                            class="category-action"
                            title="Edit category"
                            data-action="edit"
                            data-id="${category.id}">

                            <i class="bi bi-pencil"></i>

                        </button>


                        <button
                            type="button"
                            class="
                                category-action
                                delete
                            "
                            title="Delete category"
                            data-action="delete"
                            data-id="${category.id}">

                            <i class="bi bi-trash3"></i>

                        </button>

                    </div>

                </div>


                <h3>
                    ${escapeHTML(category.name)}
                </h3>


                <p class="category-card-description">

                    ${escapeHTML(
                        category.description
                    )}

                </p>


                <div class="category-meta">

                    <span class="product-count">

                        <strong>
                            ${category.products}
                        </strong>

                        products

                    </span>


                    <span class="
                        category-status
                        ${statusClass}
                    ">

                        ${statusText}

                    </span>

                </div>

            `;


            grid.appendChild(card);

        }
    );


    setupCardActions();

}


/* =========================================================
   STATS
========================================================= */

function updateStats() {

    const total =
        categories.length;


    const active =
        categories.filter(
            category =>
                category.status ===
                "active"
        ).length;


    const products =
        categories.reduce(
            (
                sum,
                category
            ) =>
                sum +
                Number(
                    category.products
                ),
            0
        );


    const top =
        [...categories]
            .sort(
                (a, b) =>
                    b.products -
                    a.products
            )[0];


    setText(
        "totalCategories",
        total
    );


    setText(
        "activeCategories",
        active
    );


    setText(
        "totalProducts",
        products
    );


    setText(
        "topCategory",
        top
            ? top.name
            : "-"
    );

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "categorySearch"
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

    const status =
        document.getElementById(
            "statusFilter"
        );


    const sort =
        document.getElementById(
            "sortFilter"
        );


    if (status) {

        status.addEventListener(
            "change",
            applyFilters
        );

    }


    if (sort) {

        sort.addEventListener(
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
                "categorySearch"
            )
            ?.value
            .trim()
            .toLowerCase() || "";


    const status =
        document
            .getElementById(
                "statusFilter"
            )
            ?.value || "all";


    const sort =
        document
            .getElementById(
                "sortFilter"
            )
            ?.value || "name";


    filteredCategories =
        categories.filter(
            category => {

                const matchesSearch =
                    !search ||

                    category.name
                        .toLowerCase()
                        .includes(search) ||

                    category.description
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =
                    status === "all" ||
                    category.status ===
                        status;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    if (
        sort === "name"
    ) {

        filteredCategories.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }


    if (
        sort === "products-high"
    ) {

        filteredCategories.sort(
            (a, b) =>
                b.products -
                a.products
        );

    }


    if (
        sort === "products-low"
    ) {

        filteredCategories.sort(
            (a, b) =>
                a.products -
                b.products
        );

    }


    renderCategories();

}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearFilters() {

    const search =
        document.getElementById(
            "categorySearch"
        );


    const status =
        document.getElementById(
            "statusFilter"
        );


    const sort =
        document.getElementById(
            "sortFilter"
        );


    if (search) {
        search.value = "";
    }


    if (status) {
        status.value = "all";
    }


    if (sort) {
        sort.value = "name";
    }


    filteredCategories =
        [...categories];


    renderCategories();

}


/* =========================================================
   CARD ACTIONS
========================================================= */

function setupCardActions() {

    document
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const action =
                            button.dataset.action;


                        const id =
                            Number(
                                button.dataset.id
                            );


                        if (
                            action ===
                            "edit"
                        ) {

                            openEditModal(id);

                        }


                        if (
                            action ===
                            "delete"
                        ) {

                            deleteCategory(id);

                        }

                    }
                );

            }
        );

}


/* =========================================================
   MODAL
========================================================= */

function setupModal() {

    const addButton =
        document.getElementById(
            "addCategoryBtn"
        );


    const closeButton =
        document.getElementById(
            "modalClose"
        );


    const cancelButton =
        document.getElementById(
            "cancelModal"
        );


    const overlay =
        document.getElementById(
            "categoryModal"
        );


    const form =
        document.getElementById(
            "categoryForm"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            openAddModal
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeModal
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    overlay
                ) {

                    closeModal();

                }

            }
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            saveCategory
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeModal();

            }

        }
    );

}


/* =========================================================
   ADD
========================================================= */

function openAddModal() {

    editingCategoryId =
        null;


    setText(
        "modalTitle",
        "Add Category"
    );


    document.getElementById(
        "categoryId"
    ).value = "";


    document.getElementById(
        "categoryName"
    ).value = "";


    document.getElementById(
        "categoryDescription"
    ).value = "";


    document.getElementById(
        "categoryProducts"
    ).value = "0";


    document.getElementById(
        "categoryStatus"
    ).value = "active";


    openModal();

}


/* =========================================================
   EDIT
========================================================= */

function openEditModal(id) {

    const category =
        categories.find(
            item =>
                item.id === id
        );


    if (!category) return;


    editingCategoryId =
        id;


    setText(
        "modalTitle",
        "Edit Category"
    );


    document.getElementById(
        "categoryId"
    ).value =
        category.id;


    document.getElementById(
        "categoryName"
    ).value =
        category.name;


    document.getElementById(
        "categoryDescription"
    ).value =
        category.description;


    document.getElementById(
        "categoryProducts"
    ).value =
        category.products;


    document.getElementById(
        "categoryStatus"
    ).value =
        category.status;


    openModal();

}


/* =========================================================
   OPEN / CLOSE
========================================================= */

function openModal() {

    const modal =
        document.getElementById(
            "categoryModal"
        );


    if (!modal) return;


    modal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(
        () => {

            document
                .getElementById(
                    "categoryName"
                )
                ?.focus();

        },
        100
    );

}


function closeModal() {

    const modal =
        document.getElementById(
            "categoryModal"
        );


    if (!modal) return;


    modal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";


    editingCategoryId =
        null;

}


/* =========================================================
   SAVE
========================================================= */

function saveCategory(
    event
) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "categoryName"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "categoryDescription"
            )
            .value
            .trim();


    const products =
        Number(
            document.getElementById(
                "categoryProducts"
            ).value
        );


    const status =
        document.getElementById(
            "categoryStatus"
        ).value;


    if (!name) {

        alert(
            "Please enter a category name."
        );

        return;

    }


    if (
        !Number.isFinite(products) ||
        products < 0
    ) {

        alert(
            "Please enter a valid product count."
        );

        return;

    }


    if (
        editingCategoryId
    ) {

        const category =
            categories.find(
                item =>
                    item.id ===
                    editingCategoryId
            );


        if (category) {

            category.name =
                name;

            category.description =
                description;

            category.products =
                Math.floor(
                    products
                );

            category.status =
                status;

        }

    } else {

        const newCategory = {

            id:
                Date.now(),

            name:
                name,

            description:
                description,

            products:
                Math.floor(
                    products
                ),

            status:
                status,

            icon:
                "bi-collection",

            color:
                "blue"

        };


        categories.push(
            newCategory
        );

    }


    filteredCategories =
        [...categories];


    updateStats();

    renderCategories();

    closeModal();

}


/* =========================================================
   DELETE
========================================================= */

function deleteCategory(id) {

    const category =
        categories.find(
            item =>
                item.id === id
        );


    if (!category) return;


    const confirmed =
        window.confirm(
            `Delete "${category.name}" category?`
        );


    if (!confirmed) {
        return;
    }


    const index =
        categories.findIndex(
            item =>
                item.id === id
        );


    if (index !== -1) {

        categories.splice(
            index,
            1
        );

    }


    filteredCategories =
        [...categories];


    updateStats();

    renderCategories();

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

            const original =
                button.innerHTML;


            button.disabled =
                true;


            button.innerHTML = `

                <i class="bi bi-arrow-repeat"></i>

                Refreshing...

            `;


            setTimeout(
                () => {

                    filteredCategories =
                        [...categories];

                    renderCategories();

                    updateStats();


                    button.disabled =
                        false;


                    button.innerHTML =
                        original;

                },
                600
            );

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

            const open =
                sidebar.classList.toggle(
                    "open"
                );


            if (overlay) {

                overlay.classList.toggle(
                    "show",
                    open
                );

            }


            document.body.style.overflow =
                open
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


/* =========================================================
   HELPERS
========================================================= */

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
            value;

    }

}


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