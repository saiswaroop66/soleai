"use strict";

/* ============================================================
   SOLEAI ADMIN PRODUCT MANAGEMENT
   File: admin-products.js

   Uses the existing:
   assets/js/product-data.js

   Important:
   products.html is inside /admin/
   Product images are inside /assets/
   Therefore image paths are converted:
   ./assets/...  ->  ../assets/...
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    ProductAdmin.init();

});


const ProductAdmin = {

    /* ========================================================
       STATE
    ======================================================== */

    products: [],

    filteredProducts: [],

    editingId: null,

    deletingId: null,

    currentView: "grid",

    toastTimer: null,


    /* ========================================================
       INITIALIZE
    ======================================================== */

    init() {

        this.cacheElements();

        this.loadProducts();

        this.bindEvents();

        this.updateStats();

        this.renderProducts();

    },


    /* ========================================================
       CACHE ELEMENTS
    ======================================================== */

    cacheElements() {

        this.container =
            document.getElementById(
                "products-container"
            );

        this.emptyState =
            document.getElementById(
                "products-empty"
            );

        this.search =
            document.getElementById(
                "product-search"
            );

        this.categoryFilter =
            document.getElementById(
                "product-category-filter"
            );

        this.statusFilter =
            document.getElementById(
                "product-status-filter"
            );

        this.sort =
            document.getElementById(
                "product-sort"
            );

        this.visibleCount =
            document.getElementById(
                "visible-products-count"
            );

        this.modal =
            document.getElementById(
                "product-modal"
            );

        this.deleteModal =
            document.getElementById(
                "delete-modal"
            );

        this.form =
            document.getElementById(
                "product-form"
            );

    },


    /* ========================================================
       LOAD EXISTING SOLEAI PRODUCTS
    ======================================================== */

    loadProducts() {

        /*
         * IMPORTANT
         *
         * Your product-data.js contains:
         *
         * const products = [...]
         *
         * It is loaded BEFORE this file in products.html.
         *
         * Therefore we directly use that same array.
         */

        if (
            typeof products === "undefined" ||
            !Array.isArray(products)
        ) {

            console.error(
                "SoleAI product-data.js was not loaded."
            );

            this.products = [];

            return;

        }


        this.products = products.map(
            (product, index) => {

                return {

                    id:
                        product.id ||
                        `product-${index + 1}`,

                    name:
                        product.name ||
                        "Unnamed Product",

                    brand:
                        product.brand ||
                        "",

                    category:
                        String(
                            product.category ||
                            "Other"
                        ).toLowerCase(),

                    price:
                        Number(
                            product.price
                        ) || 0,

                    originalPrice:
                        Number(
                            product.originalPrice
                        ) ||
                        Number(
                            product.price
                        ) ||
                        0,

                    discount:
                        Number(
                            product.discount
                        ) || 0,

                    rating:
                        Number(
                            product.rating
                        ) || 0,

                    reviews:
                        Number(
                            product.reviews
                        ) || 0,

                    /*
                     * THIS IS THE IMPORTANT PART.
                     *
                     * Your original path:
                     *
                     * ./assets/images/products/download3.png
                     *
                     * becomes:
                     *
                     * ../assets/images/products/download3.png
                     */

                    image:
                        this.adminImagePath(
                            product.image
                        ),

                    images:
                        Array.isArray(
                            product.images
                        )
                            ? product.images.map(
                                image =>
                                    this.adminImagePath(
                                        image
                                    )
                            )
                            : [],

                    colors:
                        Array.isArray(
                            product.colors
                        )
                            ? product.colors
                            : [],

                    sizes:
                        Array.isArray(
                            product.sizes
                        )
                            ? product.sizes
                            : [],

                    description:
                        product.description ||
                        product.shortDescription ||
                        "",

                    shortDescription:
                        product.shortDescription ||
                        "",

                    tags:
                        Array.isArray(
                            product.tags
                        )
                            ? product.tags
                            : [],

                    /*
                     * Your current product-data.js
                     * doesn't contain stock.
                     *
                     * Give admin a default stock value.
                     */

                    stock:
                        product.stock !== undefined
                            ? Number(product.stock)
                            : 25,

                    status:
                        product.status ||
                        "active"

                };

            }
        );

    },


    /* ========================================================
       ADMIN IMAGE PATH
    ======================================================== */

    adminImagePath(imagePath) {

        if (!imagePath) {

            return "";

        }


        imagePath =
            String(imagePath).trim();


        /*
         * Already converted.
         */

        if (
            imagePath.startsWith(
                "../assets/"
            )
        ) {

            return imagePath;

        }


        /*
         * Product data:
         *
         * ./assets/images/...
         */

        if (
            imagePath.startsWith(
                "./assets/"
            )
        ) {

            return (
                "../" +
                imagePath.substring(2)
            );

        }


        /*
         * Product data without ./:
         *
         * assets/images/...
         */

        if (
            imagePath.startsWith(
                "assets/"
            )
        ) {

            return (
                "../" +
                imagePath
            );

        }


        return imagePath;

    },


    /* ========================================================
       EVENTS
    ======================================================== */

    bindEvents() {


        /* Search */

        this.search?.addEventListener(
            "input",
            () => {

                this.renderProducts();

            }
        );


        /* Category */

        this.categoryFilter?.addEventListener(
            "change",
            () => {

                this.renderProducts();

            }
        );


        /* Status */

        this.statusFilter?.addEventListener(
            "change",
            () => {

                this.renderProducts();

            }
        );


        /* Sort */

        this.sort?.addEventListener(
            "change",
            () => {

                this.renderProducts();

            }
        );


        /* Grid/List */

        document
            .querySelectorAll(
                ".view-btn"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        this.changeView(
                            button.dataset.view
                        );

                    }
                );

            });


        /* Clear filters */

        document
            .getElementById(
                "clear-product-filters"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.clearFilters();

                }
            );


        /* Add */

        document
            .getElementById(
                "add-product-btn"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.openAddModal();

                }
            );


        document
            .getElementById(
                "empty-add-product"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.openAddModal();

                }
            );


        /* Close modal */

        document
            .getElementById(
                "close-product-modal"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.closeProductModal();

                }
            );


        document
            .getElementById(
                "cancel-product"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.closeProductModal();

                }
            );


        document
            .getElementById(
                "product-modal-overlay"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.closeProductModal();

                }
            );


        /* Product form */

        this.form?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                this.saveProduct();

            }
        );


        /* Image preview */

        document
            .getElementById(
                "product-image"
            )
            ?.addEventListener(
                "input",
                event => {

                    this.previewImage(
                        event.target.value
                    );

                }
            );


        /* Delete */

        document
            .getElementById(
                "cancel-delete"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.closeDeleteModal();

                }
            );


        document
            .getElementById(
                "confirm-delete"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.confirmDelete();

                }
            );


        document
            .querySelector(
                ".delete-modal-overlay"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.closeDeleteModal();

                }
            );


        /* Export */

        document
            .getElementById(
                "export-products-btn"
            )
            ?.addEventListener(
                "click",
                () => {

                    this.exportProducts();

                }
            );


        /* Escape */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    this.closeProductModal();

                    this.closeDeleteModal();

                }

            }
        );

    },


    /* ========================================================
       FILTER PRODUCTS
    ======================================================== */

    getFilteredProducts() {

        let result =
            [...this.products];


        const query =
            this.search?.value
                .trim()
                .toLowerCase() ||
            "";


        const category =
            this.categoryFilter?.value ||
            "all";


        const status =
            this.statusFilter?.value ||
            "all";


        const sort =
            this.sort?.value ||
            "latest";


        /* Search */

        if (query) {

            result =
                result.filter(
                    product => {

                        return (

                            product.name
                                .toLowerCase()
                                .includes(
                                    query
                                )

                            ||

                            product.brand
                                .toLowerCase()
                                .includes(
                                    query
                                )

                            ||

                            product.category
                                .toLowerCase()
                                .includes(
                                    query
                                )

                            ||

                            product.description
                                .toLowerCase()
                                .includes(
                                    query
                                )

                        );

                    }
                );

        }


        /* Category */

        if (
            category !== "all"
        ) {

            result =
                result.filter(
                    product =>
                        product.category ===
                        category
                );

        }


        /* Status */

        if (
            status !== "all"
        ) {

            result =
                result.filter(
                    product => {

                        if (
                            status === "out"
                        ) {

                            return (
                                product.stock <= 0 ||
                                product.status ===
                                    "out"
                            );

                        }


                        return (
                            product.status ===
                            status
                        );

                    }
                );

        }


        /* Sorting */

        switch (sort) {


            case "name":

                result.sort(
                    (a, b) =>
                        a.name.localeCompare(
                            b.name
                        )
                );

                break;


            case "price-low":

                result.sort(
                    (a, b) =>
                        a.price -
                        b.price
                );

                break;


            case "price-high":

                result.sort(
                    (a, b) =>
                        b.price -
                        a.price
                );

                break;


            case "stock-low":

                result.sort(
                    (a, b) =>
                        a.stock -
                        b.stock
                );

                break;


            default:

                break;

        }


        return result;

    },


    /* ========================================================
       RENDER PRODUCTS
    ======================================================== */

    renderProducts() {

        if (!this.container) {

            return;

        }


        const result =
            this.getFilteredProducts();


        this.filteredProducts =
            result;


        if (this.visibleCount) {

            this.visibleCount.textContent =
                result.length;

        }


        if (!result.length) {

            this.container.innerHTML = "";

            if (this.emptyState) {

                this.emptyState.style.display =
                    "block";

            }

            return;

        }


        if (this.emptyState) {

            this.emptyState.style.display =
                "none";

        }


        this.container.classList.toggle(
            "list-view",
            this.currentView ===
                "list"
        );


        this.container.innerHTML =
            result
                .map(
                    product =>
                        this.createProductCard(
                            product
                        )
                )
                .join("");

    },


    /* ========================================================
       CREATE PRODUCT CARD
    ======================================================== */

    createProductCard(product) {

        const stockClass =
            product.stock <= 0
                ? "danger"
                : product.stock <= 10
                    ? "warning"
                    : "";


        const stockText =
            product.stock <= 0
                ? "Out of stock"
                : `${product.stock} in stock`;


        let status =
            product.status;


        if (
            product.stock <= 0
        ) {

            status = "out";

        }


        const statusText =
            status === "active"
                ? "Active"
                : status === "draft"
                    ? "Draft"
                    : "Out of Stock";


        const image =
            product.image ||
            (
                product.images &&
                product.images[0]
            ) ||
            "";


        return `

            <article
                class="admin-product-card"
                data-id="${this.escape(
                    product.id
                )}">


                <div
                    class="admin-product-image">


                    ${
                        image
                            ? `

                                <img
                                    src="${this.escapeAttribute(
                                        image
                                    )}"
                                    alt="${this.escapeAttribute(
                                        product.name
                                    )}"
                                    loading="lazy"
                                    onerror="
                                        this.onerror=null;
                                        this.src='../assets/images/logo/logo.png';
                                    ">

                              `
                            : `

                                <i
                                    class="bi bi-image"
                                    style="
                                        font-size:40px;
                                        color:#cbd5e1;
                                    ">
                                </i>

                              `
                    }


                    <span
                        class="
                            product-status-badge
                            ${status}
                        ">

                        ${statusText}

                    </span>


                    <button
                        type="button"
                        class="product-menu-btn"
                        aria-label="Product menu"
                        onclick="
                            ProductAdmin.openProductMenu(
                                '${this.escapeJS(
                                    product.id
                                )}'
                            )
                        ">

                        <i
                            class="
                                bi
                                bi-three-dots-vertical
                            ">
                        </i>

                    </button>

                </div>


                <div
                    class="admin-product-info">


                    <span
                        class="product-category">

                        ${this.formatCategory(
                            product.category
                        )}

                    </span>


                    <h3
                        title="${this.escapeAttribute(
                            product.name
                        )}">

                        ${this.escape(
                            product.name
                        )}

                    </h3>


                    ${
                        product.brand
                            ? `

                                <div
                                    style="
                                        margin-top:5px;
                                        color:#64748b;
                                        font-size:9px;
                                        font-weight:700;
                                    ">

                                    ${this.escape(
                                        product.brand
                                    )}

                                </div>

                              `
                            : ""
                    }


                    <p
                        class="product-description">

                        ${this.escape(
                            product.shortDescription ||
                            product.description
                        )}

                    </p>


                    <div
                        class="product-card-bottom">


                        <div>

                            <strong
                                class="product-price">

                                ${this.currency(
                                    product.price
                                )}

                            </strong>


                            ${
                                product.originalPrice >
                                product.price
                                    ? `

                                        <div
                                            style="
                                                margin-top:3px;
                                                color:#94a3b8;
                                                font-size:8px;
                                                text-decoration:line-through;
                                            ">

                                            ${this.currency(
                                                product.originalPrice
                                            )}

                                            &nbsp;

                                            <span
                                                style="
                                                    color:#16a34a;
                                                    text-decoration:none;
                                                ">

                                                ${product.discount}% OFF

                                            </span>

                                        </div>

                                      `
                                    : ""
                            }


                            <span
                                class="product-stock">

                                <i
                                    class="
                                        stock-dot
                                        ${stockClass}
                                    ">
                                </i>

                                ${stockText}

                            </span>

                        </div>


                        ${
                            product.rating
                                ? `

                                    <div
                                        style="
                                            color:#f59e0b;
                                            font-size:9px;
                                            font-weight:700;
                                        ">

                                        <i
                                            class="bi bi-star-fill">
                                        </i>

                                        ${product.rating}

                                    </div>

                                  `
                                : ""
                        }

                    </div>


                    <div
                        class="product-actions">


                        <button
                            type="button"
                            class="product-action-btn"
                            onclick="
                                ProductAdmin.editProduct(
                                    '${this.escapeJS(
                                        product.id
                                    )}'
                                )
                            ">

                            <i
                                class="bi bi-pencil">
                            </i>

                            Edit

                        </button>


                        <button
                            type="button"
                            class="
                                product-action-btn
                                delete
                            "
                            onclick="
                                ProductAdmin.openDeleteModal(
                                    '${this.escapeJS(
                                        product.id
                                    )}'
                                )
                            ">

                            <i
                                class="bi bi-trash3">
                            </i>

                            Delete

                        </button>

                    </div>

                </div>

            </article>

        `;

    },


    /* ========================================================
       ADD PRODUCT
    ======================================================== */

    openAddModal() {

        this.editingId = null;


        if (this.form) {

            this.form.reset();

        }


        const id =
            document.getElementById(
                "product-id"
            );


        if (id) {

            id.value = "";

        }


        const title =
            document.getElementById(
                "product-modal-title"
            );


        if (title) {

            title.textContent =
                "Add New Product";

        }


        this.setImagePreview("");


        this.modal?.classList.add(
            "active"
        );


        this.modal?.setAttribute(
            "aria-hidden",
            "false"
        );

    },


    /* ========================================================
       EDIT PRODUCT
    ======================================================== */

    editProduct(id) {

        const product =
            this.products.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!product) {

            return;

        }


        this.editingId =
            product.id;


        this.setValue(
            "product-id",
            product.id
        );


        this.setText(
            "product-modal-title",
            "Edit Product"
        );


        this.setValue(
            "product-name",
            product.name
        );


        this.setValue(
            "product-price",
            product.price
        );


        this.setValue(
            "product-stock",
            product.stock
        );


        this.setValue(
            "product-category",
            product.category
        );


        this.setValue(
            "product-status",
            product.status === "out"
                ? "active"
                : product.status
        );


        this.setValue(
            "product-description",
            product.description
        );


        this.setValue(
            "product-image",
            product.image
        );


        this.setImagePreview(
            product.image
        );


        this.modal?.classList.add(
            "active"
        );


        this.modal?.setAttribute(
            "aria-hidden",
            "false"
        );

    },


    /* ========================================================
       SAVE PRODUCT
    ======================================================== */

    saveProduct() {

        const name =
            this.getValue(
                "product-name"
            ).trim();


        const price =
            Number(
                this.getValue(
                    "product-price"
                )
            );


        const stock =
            Number(
                this.getValue(
                    "product-stock"
                )
            );


        const category =
            this.getValue(
                "product-category"
            );


        const status =
            this.getValue(
                "product-status"
            );


        const description =
            this.getValue(
                "product-description"
            ).trim();


        const imageInput =
            this.getValue(
                "product-image"
            ).trim();


        if (!name) {

            this.notify(
                "Please enter a product name.",
                "error"
            );

            return;

        }


        if (
            Number.isNaN(price) ||
            price < 0
        ) {

            this.notify(
                "Please enter a valid price.",
                "error"
            );

            return;

        }


        if (
            Number.isNaN(stock) ||
            stock < 0
        ) {

            this.notify(
                "Please enter valid stock.",
                "error"
            );

            return;

        }


        const finalStatus =
            stock <= 0
                ? "out"
                : status;


        /*
         * Convert an admin path back into
         * the normal product-data path.
         *
         * Example:
         *
         * ../assets/images/products/test.png
         *
         * becomes:
         *
         * ./assets/images/products/test.png
         */

        const normalImagePath =
            this.storeImagePath(
                imageInput
            );


        const newProduct = {

            id:
                this.editingId ||
                `soleai-${Date.now()}`,

            name,

            brand: "",

            category,

            price,

            originalPrice:
                price,

            discount: 0,

            rating: 0,

            reviews: 0,

            image:
                normalImagePath,

            images:
                normalImagePath
                    ? [normalImagePath]
                    : [],

            colors: [],

            sizes: [],

            description,

            shortDescription:
                description,

            tags: [],

            stock,

            status:
                finalStatus

        };


        if (
            this.editingId
        ) {

            const index =
                this.products.findIndex(
                    product =>
                        String(
                            product.id
                        ) ===
                        String(
                            this.editingId
                        )
                );


            if (
                index !== -1
            ) {

                /*
                 * Preserve existing information
                 * that isn't edited by this form.
                 */

                this.products[index] = {

                    ...this.products[index],

                    ...newProduct

                };

            }


            this.notify(
                "Product updated successfully."
            );

        }

        else {

            this.products.unshift(
                newProduct
            );


            this.notify(
                "Product added successfully."
            );

        }


        /*
         * Save admin changes separately.
         */

        this.saveAdminProducts();


        this.updateStats();

        this.renderProducts();

        this.closeProductModal();

    },


    /* ========================================================
       SAVE ADMIN DATA
    ======================================================== */

    saveAdminProducts() {

        try {

            localStorage.setItem(
                "soleai-admin-products",
                JSON.stringify(
                    this.products
                )
            );

        }
        catch (error) {

            console.warn(
                "Could not save admin products.",
                error
            );

        }

    },


    /* ========================================================
       DELETE
    ======================================================== */

    openDeleteModal(id) {

        const product =
            this.products.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!product) {

            return;

        }


        this.deletingId =
            product.id;


        this.setText(
            "delete-product-name",
            product.name
        );


        this.deleteModal?.classList.add(
            "active"
        );


        this.deleteModal?.setAttribute(
            "aria-hidden",
            "false"
        );

    },


    confirmDelete() {

        if (
            !this.deletingId
        ) {

            return;

        }


        const product =
            this.products.find(
                item =>
                    String(item.id) ===
                    String(this.deletingId)
            );


        this.products =
            this.products.filter(
                item =>
                    String(item.id) !==
                    String(this.deletingId)
            );


        this.saveAdminProducts();

        this.updateStats();

        this.renderProducts();

        this.closeDeleteModal();


        this.notify(
            `"${product?.name || "Product"}" deleted successfully.`
        );


        this.deletingId =
            null;

    },


    closeDeleteModal() {

        this.deleteModal?.classList.remove(
            "active"
        );


        this.deleteModal?.setAttribute(
            "aria-hidden",
            "true"
        );

    },


    /* ========================================================
       CLOSE PRODUCT MODAL
    ======================================================== */

    closeProductModal() {

        this.modal?.classList.remove(
            "active"
        );


        this.modal?.setAttribute(
            "aria-hidden",
            "true"
        );

    },


    /* ========================================================
       IMAGE PREVIEW
    ======================================================== */

    previewImage(url) {

        const path =
            this.adminImagePath(
                url.trim()
            );


        this.setImagePreview(
            path
        );

    },


    setImagePreview(url) {

        const preview =
            document.getElementById(
                "product-image-preview"
            );


        if (!preview) {

            return;

        }


        if (!url) {

            preview.innerHTML = `

                <i
                    class="bi bi-image">
                </i>

            `;

            return;

        }


        preview.innerHTML = `

            <img
                src="${this.escapeAttribute(
                    url
                )}"
                alt="Product preview"
                onerror="
                    this.parentElement.innerHTML =
                    '<i class=&quot;bi bi-image&quot;></i>';
                ">

        `;

    },


    /* ========================================================
       GRID / LIST VIEW
    ======================================================== */

    changeView(view) {

        this.currentView =
            view === "list"
                ? "list"
                : "grid";


        document
            .querySelectorAll(
                ".view-btn"
            )
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.view ===
                    this.currentView
                );

            });


        this.renderProducts();

    },


    /* ========================================================
       CLEAR FILTERS
    ======================================================== */

    clearFilters() {

        if (this.search) {

            this.search.value = "";

        }


        if (this.categoryFilter) {

            this.categoryFilter.value =
                "all";

        }


        if (this.statusFilter) {

            this.statusFilter.value =
                "all";

        }


        if (this.sort) {

            this.sort.value =
                "latest";

        }


        this.renderProducts();

    },


    /* ========================================================
       UPDATE STATS
    ======================================================== */

    updateStats() {

        const total =
            this.products.length;


        const active =
            this.products.filter(
                product =>
                    product.status ===
                        "active" &&
                    product.stock > 0
            ).length;


        const lowStock =
            this.products.filter(
                product =>
                    product.stock > 0 &&
                    product.stock <= 10
            ).length;


        const categories =
            new Set(
                this.products.map(
                    product =>
                        product.category
                )
            ).size;


        this.setText(
            "total-products",
            total
        );


        this.setText(
            "active-products",
            active
        );


        this.setText(
            "low-stock-products",
            lowStock
        );


        this.setText(
            "total-categories",
            categories
        );


        this.setText(
            "product-count-badge",
            total
        );

    },


    /* ========================================================
       EXPORT
    ======================================================== */

    exportProducts() {

        const exportData =
            this.products.map(
                product => {

                    return {

                        id:
                            product.id,

                        name:
                            product.name,

                        brand:
                            product.brand,

                        category:
                            product.category,

                        price:
                            product.price,

                        originalPrice:
                            product.originalPrice,

                        discount:
                            product.discount,

                        rating:
                            product.rating,

                        reviews:
                            product.reviews,

                        image:
                            product.image,

                        stock:
                            product.stock,

                        status:
                            product.status

                    };

                }
            );


        const blob =
            new Blob(
                [
                    JSON.stringify(
                        exportData,
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
            `soleai-products-${this.dateString()}.json`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );


        this.notify(
            "Products exported successfully."
        );

    },


    /* ========================================================
       PRODUCT MENU
    ======================================================== */

    openProductMenu(id) {

        const product =
            this.products.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!product) {

            return;

        }


        /*
         * Simple fallback menu.
         * We can replace this with a
         * beautiful custom dropdown later.
         */

        const action =
            window.prompt(
                `Product: ${product.name}\n\n` +
                `Type EDIT to edit\n` +
                `Type DELETE to delete\n` +
                `Type CANCEL to close`,
                "CANCEL"
            );


        if (!action) {

            return;

        }


        const command =
            action
                .trim()
                .toLowerCase();


        if (
            command === "edit"
        ) {

            this.editProduct(
                product.id
            );

        }


        if (
            command === "delete"
        ) {

            this.openDeleteModal(
                product.id
            );

        }

    },


    /* ========================================================
       STORE IMAGE PATH
    ======================================================== */

    storeImagePath(path) {

        if (!path) {

            return "";

        }


        path =
            String(path).trim();


        if (
            path.startsWith(
                "../assets/"
            )
        ) {

            return (
                "./" +
                path.substring(3)
            );

        }


        if (
            path.startsWith(
                "./assets/"
            )
        ) {

            return path;

        }


        if (
            path.startsWith(
                "assets/"
            )
        ) {

            return (
                "./" +
                path
            );

        }


        return path;

    },


    /* ========================================================
       CURRENCY
    ======================================================== */

    currency(value) {

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
            Number(value) || 0
        );

    },


    /* ========================================================
       CATEGORY FORMAT
    ======================================================== */

    formatCategory(category) {

        return String(
            category || ""
        )
            .replace(
                /^./,
                letter =>
                    letter.toUpperCase()
            );

    },


    /* ========================================================
       SET VALUE
    ======================================================== */

    setValue(id, value) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.value =
                value ?? "";

        }

    },


    getValue(id) {

        const element =
            document.getElementById(
                id
            );


        return element
            ? element.value
            : "";

    },


    /* ========================================================
       SET TEXT
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
       DATE
    ======================================================== */

    dateString() {

        return new Date()
            .toISOString()
            .slice(
                0,
                10
            );

    },


    /* ========================================================
       ESCAPE HTML
    ======================================================== */

    escape(value) {

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


    /* ========================================================
       ESCAPE ATTRIBUTE
    ======================================================== */

    escapeAttribute(value) {

        return this.escape(
            value
        );

    },


    /* ========================================================
       ESCAPE JAVASCRIPT
    ======================================================== */

    escapeJS(value) {

        return String(
            value ?? ""
        )
            .replace(
                /\\/g,
                "\\\\"
            )
            .replace(
                /'/g,
                "\\'"
            )
            .replace(
                /"/g,
                '\\"'
            )
            .replace(
                /\n/g,
                "\\n"
            )
            .replace(
                /\r/g,
                "\\r"
            );

    },


    /* ========================================================
       TOAST
    ======================================================== */

    notify(
        message,
        type = "success"
    ) {

        let toast =
            document.getElementById(
                "product-admin-toast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );


            toast.id =
                "product-admin-toast";


            toast.innerHTML = `

                <i></i>

                <span></span>

            `;


            toast.style.cssText = `

                position:fixed;

                right:25px;

                bottom:25px;

                z-index:6000;

                display:flex;

                align-items:center;

                gap:10px;

                min-height:48px;

                padding:0 17px;

                border:1px solid #e5eaf0;

                border-radius:11px;

                background:#ffffff;

                color:#334155;

                box-shadow:
                    0 18px 45px
                    rgba(15,23,42,.14);

                font-family:
                    Inter,
                    Arial,
                    sans-serif;

                font-size:10px;

                font-weight:700;

                opacity:0;

                transform:
                    translateY(10px);

                transition:
                    .25s ease;

            `;


            document.body.appendChild(
                toast
            );

        }


        const icon =
            toast.querySelector(
                "i"
            );


        const text =
            toast.querySelector(
                "span"
            );


        icon.className =
            type === "error"
                ? "bi bi-exclamation-circle-fill"
                : "bi bi-check-circle-fill";


        icon.style.color =
            type === "error"
                ? "#dc2626"
                : "#16a34a";


        text.textContent =
            message;


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
                        "translateY(10px)";

                },
                2800
            );

    }

};