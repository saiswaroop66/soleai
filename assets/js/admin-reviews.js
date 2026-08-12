"use strict";


/* =========================================================
   SOLEAI ADMIN — REVIEWS
========================================================= */


const reviews = [

    {
        id: 1,

        customer: "Rahul Kumar",

        email: "rahul@example.com",

        product: "Nike Air Zoom Pegasus 41",

        rating: 5,

        review:
            "Excellent running shoes. Very comfortable and the cushioning is amazing. I can easily wear them for long runs.",

        date: "2026-08-08",

        verified: true,

        status: "approved"

    },

    {
        id: 2,

        customer: "Priya Sharma",

        email: "priya@example.com",

        product: "Adidas Adizero SL",

        rating: 5,

        review:
            "Really lightweight and comfortable. The shoe looks premium and feels great while running.",

        date: "2026-08-07",

        verified: true,

        status: "approved"

    },

    {
        id: 3,

        customer: "Arjun Reddy",

        email: "arjun@example.com",

        product: "New Balance Fresh Foam 1080",

        rating: 4,

        review:
            "Very comfortable shoe with excellent cushioning. The only issue is that it feels slightly wide for my feet.",

        date: "2026-08-06",

        verified: true,

        status: "approved"

    },

    {
        id: 4,

        customer: "Sneha Rao",

        email: "sneha@example.com",

        product: "Puma Future Rider",

        rating: 5,

        review:
            "Loved the retro design. Super comfortable for daily use and the quality is excellent.",

        date: "2026-08-05",

        verified: true,

        status: "approved"

    },

    {
        id: 5,

        customer: "Vikram Singh",

        email: "vikram@example.com",

        product: "Nike Revolution 7",

        rating: 3,

        review:
            "The shoe is decent for the price. Comfort is okay but I expected slightly better cushioning.",

        date: "2026-08-04",

        verified: true,

        status: "pending"

    },

    {
        id: 6,

        customer: "Ananya Patel",

        email: "ananya@example.com",

        product: "Adidas Runfalcon 5",

        rating: 4,

        review:
            "Good everyday running shoe. Lightweight and comfortable for walking and short runs.",

        date: "2026-08-03",

        verified: true,

        status: "approved"

    },

    {
        id: 7,

        customer: "Karthik M",

        email: "karthik@example.com",

        product: "Nike Air Zoom Pegasus 41",

        rating: 2,

        review:
            "The size was not right for me and the shoe felt uncomfortable after a few hours.",

        date: "2026-08-02",

        verified: false,

        status: "pending"

    },

    {
        id: 8,

        customer: "Meghana Das",

        email: "meghana@example.com",

        product: "Puma Future Rider",

        rating: 1,

        review:
            "The product did not meet my expectations. I had issues with the fitting and overall comfort.",

        date: "2026-08-01",

        verified: false,

        status: "rejected"

    }

];


let filteredReviews =
    [...reviews];


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeReviews
);


function initializeReviews() {

    renderReviews();

    updateStats();

    setupSearch();

    setupFilters();

    setupModal();

    setupRefresh();

    setupMobileMenu();

    setupLogout();

}


/* =========================================================
   RENDER REVIEWS
========================================================= */

function renderReviews() {

    const container =
        document.getElementById(
            "reviewsList"
        );

    const empty =
        document.getElementById(
            "emptyState"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        filteredReviews.length === 0
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


    filteredReviews.forEach(
        review => {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "review-item";


            const initials =
                getInitials(
                    review.customer
                );


            const status =
                getStatusInfo(
                    review.status
                );


            const stars =
                createStars(
                    review.rating
                );


            item.innerHTML = `

                <div class="customer-avatar">

                    ${initials}

                </div>


                <div class="customer-info">

                    <strong>
                        ${escapeHTML(
                            review.customer
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            review.email
                        )}
                    </span>

                    ${
                        review.verified
                            ? `
                                <div class="verified">

                                    <i class="bi bi-patch-check-fill"></i>

                                    Verified purchase

                                </div>
                            `
                            : ""
                    }

                </div>


                <div class="review-content">

                    <div class="product-name">

                        ${escapeHTML(
                            review.product
                        )}

                    </div>


                    <div class="stars">

                        ${stars}

                    </div>


                    <p class="review-text">

                        ${escapeHTML(
                            review.review
                        )}

                    </p>


                    <div class="review-date">

                        ${formatDate(
                            review.date
                        )}

                    </div>

                </div>


                <div class="review-actions">

                    <span class="
                        review-status
                        ${status.className}
                    ">

                        ${status.label}

                    </span>


                    <div class="action-row">


                        <button
                            type="button"
                            class="action-btn"
                            title="View review"
                            data-action="view"
                            data-id="${review.id}">

                            <i class="bi bi-eye"></i>

                        </button>


                        ${
                            review.status !== "approved"
                                ? `
                                    <button
                                        type="button"
                                        class="action-btn approve"
                                        title="Approve"
                                        data-action="approve"
                                        data-id="${review.id}">

                                        <i class="bi bi-check-lg"></i>

                                    </button>
                                `
                                : ""
                        }


                        ${
                            review.status !== "rejected"
                                ? `
                                    <button
                                        type="button"
                                        class="action-btn reject"
                                        title="Reject"
                                        data-action="reject"
                                        data-id="${review.id}">

                                        <i class="bi bi-x-lg"></i>

                                    </button>
                                `
                                : ""
                        }


                        <button
                            type="button"
                            class="action-btn delete"
                            title="Delete"
                            data-action="delete"
                            data-id="${review.id}">

                            <i class="bi bi-trash3"></i>

                        </button>

                    </div>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );


    setupReviewActions();

}


/* =========================================================
   STATS
========================================================= */

function updateStats() {

    const total =
        reviews.length;


    const verified =
        reviews.filter(
            review =>
                review.verified
        ).length;


    const pending =
        reviews.filter(
            review =>
                review.status ===
                "pending"
        ).length;


    const average =
        reviews.length
            ? reviews.reduce(
                (
                    total,
                    review
                ) =>
                    total +
                    review.rating,
                0
            ) / reviews.length
            : 0;


    setText(
        "totalReviews",
        total.toLocaleString(
            "en-IN"
        )
    );


    setText(
        "verifiedReviews",
        verified.toLocaleString(
            "en-IN"
        )
    );


    setText(
        "pendingReviews",
        pending
    );


    setText(
        "averageRating",
        average.toFixed(1)
    );

}


/* =========================================================
   STATUS
========================================================= */

function getStatusInfo(
    status
) {

    if (
        status === "approved"
    ) {

        return {

            className:
                "status-approved",

            label:
                "Approved"

        };

    }


    if (
        status === "rejected"
    ) {

        return {

            className:
                "status-rejected",

            label:
                "Rejected"

        };

    }


    return {

        className:
            "status-pending",

        label:
            "Pending"

    };

}


/* =========================================================
   STARS
========================================================= */

function createStars(
    rating
) {

    let output = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        output +=
            i <= rating
                ? '<i class="bi bi-star-fill"></i>'
                : '<i class="bi bi-star"></i>';

    }


    return output;

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "reviewSearch"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        applyFilters
    );

}


/* =========================================================
   FILTERS
========================================================= */

function setupFilters() {

    const rating =
        document.getElementById(
            "ratingFilter"
        );


    const status =
        document.getElementById(
            "statusFilter"
        );


    const clear =
        document.getElementById(
            "clearFilters"
        );


    if (rating) {

        rating.addEventListener(
            "change",
            applyFilters
        );

    }


    if (status) {

        status.addEventListener(
            "change",
            applyFilters
        );

    }


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
                "reviewSearch"
            )
            ?.value
            .trim()
            .toLowerCase() || "";


    const rating =
        document
            .getElementById(
                "ratingFilter"
            )
            ?.value || "all";


    const status =
        document
            .getElementById(
                "statusFilter"
            )
            ?.value || "all";


    filteredReviews =
        reviews.filter(
            review => {

                const text =
                    (
                        review.customer +
                        " " +
                        review.product +
                        " " +
                        review.review
                    )
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    text.includes(
                        search
                    );


                const matchesRating =
                    rating === "all" ||
                    review.rating ===
                        Number(
                            rating
                        );


                const matchesStatus =
                    status === "all" ||
                    review.status ===
                        status;


                return (
                    matchesSearch &&
                    matchesRating &&
                    matchesStatus
                );

            }
        );


    renderReviews();

}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearFilters() {

    document.getElementById(
        "reviewSearch"
    ).value = "";


    document.getElementById(
        "ratingFilter"
    ).value = "all";


    document.getElementById(
        "statusFilter"
    ).value = "all";


    filteredReviews =
        [...reviews];


    renderReviews();

}


/* =========================================================
   REVIEW ACTIONS
========================================================= */

function setupReviewActions() {

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
                            action === "view"
                        ) {

                            openReviewModal(
                                id
                            );

                        }


                        if (
                            action === "approve"
                        ) {

                            updateReviewStatus(
                                id,
                                "approved"
                            );

                        }


                        if (
                            action === "reject"
                        ) {

                            updateReviewStatus(
                                id,
                                "rejected"
                            );

                        }


                        if (
                            action === "delete"
                        ) {

                            deleteReview(
                                id
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   STATUS UPDATE
========================================================= */

function updateReviewStatus(
    id,
    status
) {

    const review =
        reviews.find(
            item =>
                item.id === id
        );


    if (!review) {
        return;
    }


    review.status =
        status;


    filteredReviews =
        [...reviews];


    applyFilters();

    updateStats();

}


/* =========================================================
   DELETE
========================================================= */

function deleteReview(
    id
) {

    const review =
        reviews.find(
            item =>
                item.id === id
        );


    if (!review) {
        return;
    }


    const confirmed =
        window.confirm(
            `Delete review from "${review.customer}"?`
        );


    if (!confirmed) {
        return;
    }


    const index =
        reviews.findIndex(
            item =>
                item.id === id
        );


    if (index !== -1) {

        reviews.splice(
            index,
            1
        );

    }


    filteredReviews =
        [...reviews];


    applyFilters();

    updateStats();

}


/* =========================================================
   MODAL
========================================================= */

function setupModal() {

    const modal =
        document.getElementById(
            "reviewModal"
        );


    const close =
        document.getElementById(
            "modalClose"
        );


    const closeButton =
        document.getElementById(
            "closeReviewBtn"
        );


    if (close) {

        close.addEventListener(
            "click",
            closeReviewModal
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeReviewModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    closeReviewModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeReviewModal();

            }

        }
    );

}


/* =========================================================
   OPEN REVIEW
========================================================= */

function openReviewModal(
    id
) {

    const review =
        reviews.find(
            item =>
                item.id === id
        );


    if (!review) {
        return;
    }


    setText(
        "modalAvatar",
        getInitials(
            review.customer
        )
    );


    setText(
        "modalCustomer",
        review.customer
    );


    setText(
        "modalProduct",
        review.product
    );


    const rating =
        document.getElementById(
            "modalRating"
        );


    if (rating) {

        rating.innerHTML =
            createStars(
                review.rating
            );

    }


    setText(
        "modalReviewText",
        review.review
    );


    setText(
        "modalDate",
        formatDate(
            review.date
        )
    );


    setText(
        "modalStatus",
        getStatusInfo(
            review.status
        ).label
    );


    const modal =
        document.getElementById(
            "reviewModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE REVIEW
========================================================= */

function closeReviewModal() {

    const modal =
        document.getElementById(
            "reviewModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   REFRESH
========================================================= */

function setupRefresh() {

    const button =
        document.getElementById(
            "refreshBtn"
        );


    if (!button) {
        return;
    }


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

                    filteredReviews =
                        [...reviews];

                    renderReviews();

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


    const menu =
        document.getElementById(
            "menuToggle"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (
        !sidebar ||
        !menu
    ) {
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


    menu.addEventListener(
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


    if (!button) {
        return;
    }


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

function getInitials(
    name
) {

    return name
        .split(" ")
        .map(
            word =>
                word.charAt(0)
        )
        .slice(0, 2)
        .join("")
        .toUpperCase();

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