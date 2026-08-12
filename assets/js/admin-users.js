"use strict";


/* =========================================================
   SOLEAI ADMIN — CUSTOMERS JS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCustomers();

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializeCustomers() {

    setupSearch();

    setupStatusFilter();

    setupSort();

    setupClearFilters();

    setupCustomerActions();

    setupRefresh();

    setupExport();

    setupPagination();

    setupMobileSidebar();

    setupLogout();

    updateCustomerCount();

}


/* =========================================================
   ELEMENTS
========================================================= */

function getCustomerRows() {

    return Array.from(
        document.querySelectorAll(
            "#customersTableBody tr"
        )
    );

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const search =
        document.getElementById(
            "customerSearch"
        );

    if (!search) return;


    search.addEventListener(
        "input",
        applyFilters
    );

}


/* =========================================================
   STATUS FILTER
========================================================= */

function setupStatusFilter() {

    const filter =
        document.getElementById(
            "customerStatus"
        );

    if (!filter) return;


    filter.addEventListener(
        "change",
        applyFilters
    );

}


/* =========================================================
   SORT
========================================================= */

function setupSort() {

    const sort =
        document.getElementById(
            "customerSort"
        );

    if (!sort) return;


    sort.addEventListener(
        "change",
        () => {

            sortCustomers(
                sort.value
            );

            applyFilters();

        }
    );

}


/* =========================================================
   APPLY FILTERS
========================================================= */

function applyFilters() {

    const searchInput =
        document.getElementById(
            "customerSearch"
        );

    const statusInput =
        document.getElementById(
            "customerStatus"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const status =
        statusInput
            ? statusInput.value
            : "all";


    const rows =
        getCustomerRows();


    let visibleCount = 0;


    rows.forEach(row => {

        const name =
            (
                row.dataset.name || ""
            ).toLowerCase();


        const email =
            (
                row.dataset.email || ""
            ).toLowerCase();


        const rowStatus =
            (
                row.dataset.status || ""
            ).toLowerCase();


        const matchesSearch =
            !search ||
            name.includes(search) ||
            email.includes(search);


        const matchesStatus =
            status === "all" ||
            rowStatus === status;


        const visible =
            matchesSearch &&
            matchesStatus;


        row.style.display =
            visible
                ? ""
                : "none";


        if (visible) {
            visibleCount++;
        }

    });


    updateCustomerCount(
        visibleCount
    );


    toggleEmptyState(
        visibleCount === 0
    );

}


/* =========================================================
   COUNT
========================================================= */

function updateCustomerCount(
    count = null
) {

    const result =
        document.getElementById(
            "customerResultCount"
        );


    if (!result) return;


    if (count === null) {

        count =
            getCustomerRows()
                .length;

    }


    result.textContent =
        count;

}


/* =========================================================
   EMPTY STATE
========================================================= */

function toggleEmptyState(
    show
) {

    const empty =
        document.getElementById(
            "emptyCustomers"
        );

    const table =
        document.querySelector(
            ".table-scroll"
        );


    if (!empty) return;


    empty.style.display =
        show
            ? "block"
            : "none";


    if (table) {

        table.style.display =
            show
                ? "none"
                : "block";

    }

}


/* =========================================================
   SORT CUSTOMERS
========================================================= */

function sortCustomers(
    type
) {

    const tbody =
        document.getElementById(
            "customersTableBody"
        );


    if (!tbody) return;


    const rows =
        getCustomerRows();


    rows.sort(
        (a, b) => {

            if (type === "orders") {

                return (
                    Number(b.dataset.orders || 0) -
                    Number(a.dataset.orders || 0)
                );

            }


            if (type === "spent") {

                return (
                    Number(b.dataset.spent || 0) -
                    Number(a.dataset.spent || 0)
                );

            }


            if (type === "oldest") {

                return (
                    getDateFromRow(a) -
                    getDateFromRow(b)
                );

            }


            return (
                getDateFromRow(b) -
                getDateFromRow(a)
            );

        }
    );


    rows.forEach(row => {

        tbody.appendChild(row);

    });

}


/* =========================================================
   DATE
========================================================= */

function getDateFromRow(row) {

    const dateElement =
        row.querySelector(
            ".order-date"
        );


    if (!dateElement) {
        return 0;
    }


    const timestamp =
        Date.parse(
            dateElement.textContent.trim()
        );


    return Number.isNaN(timestamp)
        ? 0
        : timestamp;

}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function setupClearFilters() {

    const button =
        document.getElementById(
            "clearCustomerFilters"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const search =
                document.getElementById(
                    "customerSearch"
                );

            const status =
                document.getElementById(
                    "customerStatus"
                );

            const sort =
                document.getElementById(
                    "customerSort"
                );


            if (search) {
                search.value = "";
            }


            if (status) {
                status.value = "all";
            }


            if (sort) {
                sort.value = "latest";
            }


            sortCustomers("latest");

            applyFilters();

        }
    );

}


/* =========================================================
   CUSTOMER ACTIONS
========================================================= */

function setupCustomerActions() {

    const buttons =
        document.querySelectorAll(
            ".view-customer"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const row =
                    button.closest("tr");

                if (!row) return;


                openCustomerModal(
                    row
                );

            }
        );

    });

}


/* =========================================================
   CUSTOMER MODAL
========================================================= */

function openCustomerModal(
    row
) {

    const name =
        row.dataset.name || "Customer";


    const email =
        row.dataset.email || "—";


    const status =
        row.dataset.status || "—";


    const orders =
        row.dataset.orders || "0";


    const spent =
        row.dataset.spent || "0";


    const customerId =
        row.querySelector(
            ".customer-info span"
        )?.textContent.trim()
        || "—";


    const phone =
        row.querySelectorAll(
            ".customer-info span"
        )[1]?.textContent.trim()
        || "Not available";


    const avatar =
        row.querySelector(
            ".customer-avatar"
        )?.textContent.trim()
        || "CU";


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "customer-modal";


    modal.innerHTML = `

        <div class="customer-modal-backdrop"></div>

        <div class="customer-modal-box">

            <div class="customer-modal-header">

                <div>

                    <div class="eyebrow">
                        CUSTOMER PROFILE
                    </div>

                    <h2>
                        Customer Details
                    </h2>

                </div>

                <button
                    class="customer-modal-close"
                    type="button"
                    aria-label="Close">

                    <i class="bi bi-x-lg"></i>

                </button>

            </div>


            <div class="customer-modal-content">

                <div class="customer-profile">

                    <div class="customer-profile-avatar">
                        ${escapeHTML(avatar)}
                    </div>

                    <div class="customer-profile-info">

                        <h3>
                            ${escapeHTML(name)}
                        </h3>

                        <p>
                            ${escapeHTML(email)}
                        </p>

                    </div>

                </div>


                <div class="customer-details">

                    <div class="customer-detail">

                        <span>
                            CUSTOMER ID
                        </span>

                        <strong>
                            ${escapeHTML(customerId)}
                        </strong>

                    </div>


                    <div class="customer-detail">

                        <span>
                            STATUS
                        </span>

                        <strong>
                            ${escapeHTML(status)}
                        </strong>

                    </div>


                    <div class="customer-detail">

                        <span>
                            PHONE
                        </span>

                        <strong>
                            ${escapeHTML(phone)}
                        </strong>

                    </div>


                    <div class="customer-detail">

                        <span>
                            TOTAL ORDERS
                        </span>

                        <strong>
                            ${escapeHTML(orders)}
                        </strong>

                    </div>


                    <div class="customer-detail">

                        <span>
                            TOTAL SPENT
                        </span>

                        <strong>
                            ₹${formatNumber(spent)}
                        </strong>

                    </div>


                    <div class="customer-detail">

                        <span>
                            ACCOUNT
                        </span>

                        <strong>
                            SoleAI Customer
                        </strong>

                    </div>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    requestAnimationFrame(
        () => {

            modal.classList.add(
                "show"
            );

        }
    );


    const close =
        modal.querySelector(
            ".customer-modal-close"
        );


    const backdrop =
        modal.querySelector(
            ".customer-modal-backdrop"
        );


    close.addEventListener(
        "click",
        () => closeCustomerModal(modal)
    );


    backdrop.addEventListener(
        "click",
        () => closeCustomerModal(modal)
    );


    document.addEventListener(
        "keydown",
        function escapeHandler(event) {

            if (
                event.key === "Escape"
            ) {

                closeCustomerModal(
                    modal
                );

                document.removeEventListener(
                    "keydown",
                    escapeHandler
                );

            }

        }
    );

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeCustomerModal(
    modal
) {

    if (!modal) return;


    modal.classList.remove(
        "show"
    );


    setTimeout(
        () => {

            modal.remove();

        },
        200
    );

}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(
    value
) {

    return Number(value || 0)
        .toLocaleString("en-IN");

}


/* =========================================================
   SAFE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(value)
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


/* =========================================================
   REFRESH
========================================================= */

function setupRefresh() {

    const button =
        document.getElementById(
            "refreshCustomersBtn"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const icon =
                button.querySelector(
                    "i"
                );


            if (icon) {

                icon.classList.add(
                    "bi-spin"
                );

            }


            setTimeout(
                () => {

                    if (icon) {

                        icon.classList.remove(
                            "bi-spin"
                        );

                    }

                    applyFilters();

                },
                600
            );

        }
    );

}


/* =========================================================
   EXPORT CSV
========================================================= */

function setupExport() {

    const button =
        document.getElementById(
            "exportCustomersBtn"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        exportCustomers
    );

}


function exportCustomers() {

    const rows =
        getCustomerRows()
            .filter(
                row =>
                    row.style.display !== "none"
            );


    const data = [
        [
            "Customer",
            "Email",
            "Phone",
            "Orders",
            "Total Spent",
            "Status"
        ]
    ];


    rows.forEach(row => {

        const name =
            row.dataset.name || "";


        const email =
            row.dataset.email || "";


        const spans =
            row.querySelectorAll(
                ".customer-info span"
            );


        const phone =
            spans[1]
                ? spans[1].textContent.trim()
                : "";


        const orders =
            row.dataset.orders || "0";


        const spent =
            row.dataset.spent || "0";


        const status =
            row.dataset.status || "";


        data.push([
            name,
            email,
            phone,
            orders,
            spent,
            status
        ]);

    });


    const csv =
        data
            .map(
                row =>
                    row
                        .map(csvEscape)
                        .join(",")
            )
            .join("\n");


    const blob =
        new Blob(
            [csv],
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


    link.href = url;

    link.download =
        "soleai-customers.csv";


    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
        url
    );

}


function csvEscape(
    value
) {

    const string =
        String(value ?? "");


    if (
        string.includes(",") ||
        string.includes('"') ||
        string.includes("\n")
    ) {

        return `"${string.replace(
            /"/g,
            '""'
        )}"`;

    }


    return string;

}


/* =========================================================
   PAGINATION
========================================================= */

function setupPagination() {

    const buttons =
        document.querySelectorAll(
            ".pagination .page-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    button.querySelector(
                        "i"
                    )
                ) {

                    return;

                }


                buttons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );

            }
        );

    });

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function setupMobileSidebar() {

    const sidebar =
        document.querySelector(
            ".admin-sidebar"
        );


    const button =
        document.getElementById(
            "adminMenuToggle"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (!sidebar || !button) {
        return;
    }


    function openSidebar() {

        sidebar.classList.add(
            "open"
        );


        if (overlay) {

            overlay.classList.add(
                "show"
            );

        }

        document.body.style.overflow =
            "hidden";

    }


    function closeSidebar() {

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

            if (
                sidebar.classList.contains(
                    "open"
                )
            ) {

                closeSidebar();

            } else {

                openSidebar();

            }

        }
    );


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    sidebar
        .querySelectorAll(
            "a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 900
                    ) {

                        closeSidebar();

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

                closeSidebar();

            }

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

            const confirmLogout =
                window.confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            /*
             * Add real authentication
             * logout logic here later.
             */


            window.location.href =
                "../index.html";

        }
    );

}