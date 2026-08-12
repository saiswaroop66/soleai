"use strict";


/* =========================================================
   SOLEAI ADMIN — COUPONS
========================================================= */


/* =========================================================
   COUPON DATA
========================================================= */

const coupons = [

    {
        id: 1,

        code: "SOLEAI20",

        type: "percentage",

        value: 20,

        minOrder: 2999,

        usage: 428,

        limit: 1000,

        start: "2026-08-01",

        expiry: "2026-08-31",

        status: "active"

    },


    {
        id: 2,

        code: "WELCOME10",

        type: "percentage",

        value: 10,

        minOrder: 1499,

        usage: 682,

        limit: 1000,

        start: "2026-07-01",

        expiry: "2026-08-15",

        status: "active"

    },


    {
        id: 3,

        code: "RUN500",

        type: "fixed",

        value: 500,

        minOrder: 4999,

        usage: 214,

        limit: 500,

        start: "2026-08-01",

        expiry: "2026-08-20",

        status: "active"

    },


    {
        id: 4,

        code: "SNEAKER15",

        type: "percentage",

        value: 15,

        minOrder: 2499,

        usage: 186,

        limit: 500,

        start: "2026-08-10",

        expiry: "2026-08-18",

        status: "scheduled"

    },


    {
        id: 5,

        code: "FREESHIP",

        type: "fixed",

        value: 199,

        minOrder: 1999,

        usage: 95,

        limit: 300,

        start: "2026-07-15",

        expiry: "2026-08-12",

        status: "active"

    },


    {
        id: 6,

        code: "SPORT25",

        type: "percentage",

        value: 25,

        minOrder: 5999,

        usage: 156,

        limit: 250,

        start: "2026-06-01",

        expiry: "2026-07-31",

        status: "expired"

    },


    {
        id: 7,

        code: "CASUAL300",

        type: "fixed",

        value: 300,

        minOrder: 2499,

        usage: 65,

        limit: 200,

        start: "2026-08-01",

        expiry: "2026-08-25",

        status: "active"

    },


    {
        id: 8,

        code: "PREMIUM30",

        type: "percentage",

        value: 30,

        minOrder: 7999,

        usage: 20,

        limit: 100,

        start: "2026-08-20",

        expiry: "2026-09-20",

        status: "scheduled"

    }

];


let filteredCoupons =
    [...coupons];


let editingCouponId =
    null;


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeCoupons
);


function initializeCoupons() {

    renderCoupons();

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

function renderCoupons() {

    const tbody =
        document.getElementById(
            "couponTableBody"
        );


    const empty =
        document.getElementById(
            "emptyState"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    if (
        filteredCoupons.length === 0
    ) {

        if (empty) {

            empty.style.display =
                "block";

        }

        return;

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    filteredCoupons.forEach(
        coupon => {

            const row =
                document.createElement(
                    "tr"
                );


            const discount =
                coupon.type ===
                "percentage"

                    ? coupon.value + "% OFF"

                    : formatCurrency(
                        coupon.value
                    ) + " OFF";


            const usagePercentage =
                coupon.limit > 0

                    ? Math.min(
                        (
                            coupon.usage /
                            coupon.limit
                        ) * 100,
                        100
                    )

                    : 0;


            const status =
                getStatusInfo(
                    coupon.status
                );


            row.innerHTML = `

                <td>

                    <div class="coupon-cell">

                        <div class="coupon-icon">

                            <i class="bi bi-ticket-perforated"></i>

                        </div>


                        <div class="coupon-info">

                            <strong>
                                ${escapeHTML(
                                    coupon.code
                                )}
                            </strong>

                            <span>
                                ${formatDate(
                                    coupon.start
                                )}
                                -
                                ${formatDate(
                                    coupon.expiry
                                )}
                            </span>

                        </div>

                    </div>

                </td>


                <td>

                    <span class="discount-value">

                        ${discount}

                    </span>

                </td>


                <td>

                    ${formatCurrency(
                        coupon.minOrder
                    )}

                </td>


                <td>

                    <div class="usage-info">

                        <div class="usage-text">

                            <span>
                                ${coupon.usage}
                            </span>

                            <strong>
                                ${coupon.limit}
                            </strong>

                        </div>


                        <div class="usage-bar">

                            <div
                                class="usage-fill"
                                style="width:${usagePercentage}%">
                            </div>

                        </div>

                    </div>

                </td>


                <td>

                    ${formatDate(
                        coupon.expiry
                    )}

                </td>


                <td>

                    <span class="
                        status-badge
                        ${status.className}
                    ">

                        ${status.label}

                    </span>

                </td>


                <td>

                    <div class="action-group">


                        <button
                            type="button"
                            class="action-btn"
                            title="Copy coupon"
                            data-action="copy"
                            data-id="${coupon.id}">

                            <i class="bi bi-copy"></i>

                        </button>


                        <button
                            type="button"
                            class="action-btn"
                            title="Edit coupon"
                            data-action="edit"
                            data-id="${coupon.id}">

                            <i class="bi bi-pencil"></i>

                        </button>


                        <button
                            type="button"
                            class="action-btn delete"
                            title="Delete coupon"
                            data-action="delete"
                            data-id="${coupon.id}">

                            <i class="bi bi-trash3"></i>

                        </button>


                    </div>

                </td>

            `;


            tbody.appendChild(row);

        }
    );


    setupActions();

}


/* =========================================================
   STATUS
========================================================= */

function getStatusInfo(
    status
) {

    if (
        status === "expired"
    ) {

        return {

            className:
                "status-expired",

            label:
                "Expired"

        };

    }


    if (
        status === "scheduled"
    ) {

        return {

            className:
                "status-scheduled",

            label:
                "Scheduled"

        };

    }


    return {

        className:
            "status-active",

        label:
            "Active"

    };

}


/* =========================================================
   STATS
========================================================= */

function updateStats() {

    const total =
        coupons.length;


    const active =
        coupons.filter(
            coupon =>
                coupon.status ===
                "active"
        ).length;


    const expiring =
        coupons.filter(
            coupon =>
                isExpiringSoon(
                    coupon
                )
        ).length;


    const redemptions =
        coupons.reduce(
            (
                total,
                coupon
            ) =>
                total +
                coupon.usage,
            0
        );


    setText(
        "totalCoupons",
        total
    );


    setText(
        "activeCoupons",
        active
    );


    setText(
        "expiringCoupons",
        expiring
    );


    setText(
        "totalRedemptions",
        redemptions.toLocaleString(
            "en-IN"
        )
    );

}


/* =========================================================
   EXPIRING SOON
========================================================= */

function isExpiringSoon(
    coupon
) {

    if (
        coupon.status !==
        "active"
    ) {

        return false;

    }


    const today =
        new Date();


    const expiry =
        new Date(
            coupon.expiry
        );


    const difference =
        (
            expiry.getTime() -
            today.getTime()
        ) /
        (
            1000 *
            60 *
            60 *
            24
        );


    return (
        difference >= 0 &&
        difference <= 7
    );

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "couponSearch"
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


    const discount =
        document.getElementById(
            "discountFilter"
        );


    if (status) {

        status.addEventListener(
            "change",
            applyFilters
        );

    }


    if (discount) {

        discount.addEventListener(
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
                "couponSearch"
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


    const discount =
        document
            .getElementById(
                "discountFilter"
            )
            ?.value || "all";


    filteredCoupons =
        coupons.filter(
            coupon => {

                const matchesSearch =
                    !search ||
                    coupon.code
                        .toLowerCase()
                        .includes(
                            search
                        );


                const matchesStatus =
                    status === "all" ||
                    coupon.status ===
                        status;


                const matchesDiscount =
                    discount === "all" ||
                    coupon.type ===
                        discount;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesDiscount
                );

            }
        );


    renderCoupons();

}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearFilters() {

    document.getElementById(
        "couponSearch"
    ).value = "";


    document.getElementById(
        "statusFilter"
    ).value = "all";


    document.getElementById(
        "discountFilter"
    ).value = "all";


    filteredCoupons =
        [...coupons];


    renderCoupons();

}


/* =========================================================
   ACTIONS
========================================================= */

function setupActions() {

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


                        if (
                            action ===
                            "copy"
                        ) {

                            copyCoupon(id);

                        }


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

                            deleteCoupon(id);

                        }

                    }
                );

            }
        );

}


/* =========================================================
   COPY COUPON
========================================================= */

function copyCoupon(id) {

    const coupon =
        coupons.find(
            item =>
                item.id === id
        );


    if (!coupon) return;


    if (
        navigator.clipboard
    ) {

        navigator.clipboard
            .writeText(
                coupon.code
            )
            .then(
                () => {

                    alert(
                        `"${coupon.code}" copied to clipboard.`
                    );

                }
            )
            .catch(
                () => {

                    alert(
                        `Coupon: ${coupon.code}`
                    );

                }
            );

    } else {

        alert(
            `Coupon: ${coupon.code}`
        );

    }

}


/* =========================================================
   MODAL
========================================================= */

function setupModal() {

    const addButton =
        document.getElementById(
            "addCouponBtn"
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
            "couponModal"
        );


    const form =
        document.getElementById(
            "couponForm"
        );


    const generate =
        document.getElementById(
            "generateCode"
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
            saveCoupon
        );

    }


    if (generate) {

        generate.addEventListener(
            "click",
            generateCouponCode
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
   ADD MODAL
========================================================= */

function openAddModal() {

    editingCouponId =
        null;


    setText(
        "modalTitle",
        "Create Coupon"
    );


    document.getElementById(
        "couponId"
    ).value = "";


    document.getElementById(
        "couponCode"
    ).value = "";


    document.getElementById(
        "discountType"
    ).value =
        "percentage";


    document.getElementById(
        "discountValue"
    ).value = "";


    document.getElementById(
        "minOrder"
    ).value = "0";


    document.getElementById(
        "usageLimit"
    ).value = "100";


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    document.getElementById(
        "startDate"
    ).value =
        today;


    document.getElementById(
        "expiryDate"
    ).value = "";


    document.getElementById(
        "couponStatus"
    ).value =
        "active";


    openModal();

}


/* =========================================================
   EDIT MODAL
========================================================= */

function openEditModal(id) {

    const coupon =
        coupons.find(
            item =>
                item.id === id
        );


    if (!coupon) return;


    editingCouponId =
        id;


    setText(
        "modalTitle",
        "Edit Coupon"
    );


    document.getElementById(
        "couponId"
    ).value =
        coupon.id;


    document.getElementById(
        "couponCode"
    ).value =
        coupon.code;


    document.getElementById(
        "discountType"
    ).value =
        coupon.type;


    document.getElementById(
        "discountValue"
    ).value =
        coupon.value;


    document.getElementById(
        "minOrder"
    ).value =
        coupon.minOrder;


    document.getElementById(
        "usageLimit"
    ).value =
        coupon.limit;


    document.getElementById(
        "startDate"
    ).value =
        coupon.start;


    document.getElementById(
        "expiryDate"
    ).value =
        coupon.expiry;


    document.getElementById(
        "couponStatus"
    ).value =
        coupon.status;


    openModal();

}


/* =========================================================
   OPEN / CLOSE
========================================================= */

function openModal() {

    const modal =
        document.getElementById(
            "couponModal"
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
                    "couponCode"
                )
                ?.focus();

        },
        100
    );

}


function closeModal() {

    const modal =
        document.getElementById(
            "couponModal"
        );


    if (!modal) return;


    modal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";


    editingCouponId =
        null;

}


/* =========================================================
   SAVE COUPON
========================================================= */

function saveCoupon(
    event
) {

    event.preventDefault();


    const code =
        document
            .getElementById(
                "couponCode"
            )
            .value
            .trim()
            .toUpperCase();


    const type =
        document.getElementById(
            "discountType"
        ).value;


    const value =
        Number(
            document.getElementById(
                "discountValue"
            ).value
        );


    const minOrder =
        Number(
            document.getElementById(
                "minOrder"
            ).value
        );


    const limit =
        Number(
            document.getElementById(
                "usageLimit"
            ).value
        );


    const start =
        document.getElementById(
            "startDate"
        ).value;


    const expiry =
        document.getElementById(
            "expiryDate"
        ).value;


    const status =
        document.getElementById(
            "couponStatus"
        ).value;


    if (
        !code ||
        code.length < 3
    ) {

        alert(
            "Please enter a valid coupon code."
        );

        return;

    }


    if (
        !Number.isFinite(value) ||
        value <= 0
    ) {

        alert(
            "Please enter a valid discount."
        );

        return;

    }


    if (
        type === "percentage" &&
        value > 100
    ) {

        alert(
            "Percentage discount cannot exceed 100%."
        );

        return;

    }


    if (
        minOrder < 0
    ) {

        alert(
            "Minimum order cannot be negative."
        );

        return;

    }


    if (
        limit <= 0
    ) {

        alert(
            "Usage limit must be greater than zero."
        );

        return;

    }


    if (!start || !expiry) {

        alert(
            "Please select both dates."
        );

        return;

    }


    if (
        new Date(expiry) <
        new Date(start)
    ) {

        alert(
            "Expiry date must be after the start date."
        );

        return;

    }


    const duplicate =
        coupons.some(
            coupon =>
                coupon.code === code &&
                coupon.id !==
                    editingCouponId
        );


    if (duplicate) {

        alert(
            "This coupon code already exists."
        );

        return;

    }


    if (
        editingCouponId
    ) {

        const coupon =
            coupons.find(
                item =>
                    item.id ===
                    editingCouponId
            );


        if (coupon) {

            coupon.code =
                code;

            coupon.type =
                type;

            coupon.value =
                value;

            coupon.minOrder =
                minOrder;

            coupon.limit =
                limit;

            coupon.start =
                start;

            coupon.expiry =
                expiry;

            coupon.status =
                status;

        }

    } else {

        coupons.push({

            id:
                Date.now(),

            code:
                code,

            type:
                type,

            value:
                value,

            minOrder:
                minOrder,

            usage:
                0,

            limit:
                limit,

            start:
                start,

            expiry:
                expiry,

            status:
                status

        });

    }


    filteredCoupons =
        [...coupons];


    updateStats();

    renderCoupons();

    closeModal();

}


/* =========================================================
   DELETE
========================================================= */

function deleteCoupon(id) {

    const coupon =
        coupons.find(
            item =>
                item.id === id
        );


    if (!coupon) return;


    const confirmed =
        window.confirm(
            `Delete coupon "${coupon.code}"?`
        );


    if (!confirmed) {
        return;
    }


    const index =
        coupons.findIndex(
            item =>
                item.id === id
        );


    if (index !== -1) {

        coupons.splice(
            index,
            1
        );

    }


    filteredCoupons =
        [...coupons];


    updateStats();

    renderCoupons();

}


/* =========================================================
   GENERATE COUPON
========================================================= */

function generateCouponCode() {

    const prefix =
        "SOLEAI";


    const random =
        Math.random()
            .toString(36)
            .substring(
                2,
                7
            )
            .toUpperCase();


    const code =
        prefix +
        random;


    document.getElementById(
        "couponCode"
    ).value =
        code;

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

                    filteredCoupons =
                        [...coupons];

                    renderCoupons();

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

function formatCurrency(
    value
) {

    return "₹" +
        Number(value)
            .toLocaleString(
                "en-IN"
            );

}


function formatDate(
    dateString
) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",

            month: "short",

            year: "numeric"
        }
    );

}


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