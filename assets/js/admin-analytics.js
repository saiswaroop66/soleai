"use strict";


/* =========================================================
   SOLEAI ADMIN — ANALYTICS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeAnalytics
);


function initializeAnalytics() {

    initializeCharts();

    setupDateRange();

    setupExport();

    setupMobileSidebar();

    setupLogout();

}


/* =========================================================
   CHART DEFAULTS
========================================================= */

function initializeCharts() {

    if (typeof Chart === "undefined") {

        console.warn(
            "Chart.js is not loaded."
        );

        return;

    }


    Chart.defaults.font.family =
        "Inter, Arial, sans-serif";

    Chart.defaults.color =
        "#94a3b8";


    createRevenueChart();

    createOrdersChart();

    createCategoryChart();

}


/* =========================================================
   REVENUE CHART
========================================================= */

function createRevenueChart() {

    const canvas =
        document.getElementById(
            "revenueChart"
        );

    if (!canvas) return;


    new Chart(
        canvas,
        {
            type: "line",

            data: {

                labels: [
                    "01",
                    "05",
                    "10",
                    "15",
                    "20",
                    "25",
                    "30"
                ],

                datasets: [

                    {
                        label: "Revenue",

                        data: [
                            18500,
                            26400,
                            34800,
                            29500,
                            43200,
                            51800,
                            68200
                        ],

                        borderColor: "#2563eb",

                        backgroundColor:
                            "rgba(37,99,235,.08)",

                        borderWidth: 3,

                        fill: true,

                        tension: .4,

                        pointRadius: 3,

                        pointHoverRadius: 6,

                        pointBackgroundColor:
                            "#2563eb"
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {
                    intersect: false,
                    mode: "index"
                },

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        backgroundColor:
                            "#111827",

                        padding: 12,

                        displayColors: false,

                        callbacks: {

                            label:
                                context =>
                                    " ₹" +
                                    Number(
                                        context.parsed.y
                                    ).toLocaleString(
                                        "en-IN"
                                    )

                        }

                    }

                },

                scales: {

                    x: {

                        grid: {
                            display: false
                        },

                        border: {
                            display: false
                        }

                    },

                    y: {

                        beginAtZero: true,

                        border: {
                            display: false
                        },

                        grid: {
                            color: "#edf1f5"
                        },

                        ticks: {

                            callback:
                                value =>
                                    "₹" +
                                    (
                                        value / 1000
                                    ) +
                                    "k"

                        }

                    }

                }

            }

        }
    );

}


/* =========================================================
   ORDERS CHART
========================================================= */

function createOrdersChart() {

    const canvas =
        document.getElementById(
            "ordersChart"
        );

    if (!canvas) return;


    new Chart(
        canvas,
        {
            type: "bar",

            data: {

                labels: [
                    "01",
                    "05",
                    "10",
                    "15",
                    "20",
                    "25",
                    "30"
                ],

                datasets: [

                    {
                        label: "Orders",

                        data: [
                            42,
                            57,
                            64,
                            52,
                            76,
                            88,
                            104
                        ],

                        backgroundColor:
                            "#7c3aed",

                        borderRadius: 6,

                        borderSkipped: false

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        backgroundColor:
                            "#111827",

                        padding: 12,

                        displayColors: false

                    }

                },

                scales: {

                    x: {

                        grid: {
                            display: false
                        },

                        border: {
                            display: false
                        }

                    },

                    y: {

                        beginAtZero: true,

                        border: {
                            display: false
                        },

                        grid: {
                            color: "#edf1f5"
                        }

                    }

                }

            }

        }
    );

}


/* =========================================================
   CATEGORY CHART
========================================================= */

function createCategoryChart() {

    const canvas =
        document.getElementById(
            "categoryChart"
        );

    if (!canvas) return;


    new Chart(
        canvas,
        {
            type: "doughnut",

            data: {

                labels: [
                    "Running",
                    "Lifestyle",
                    "Sports",
                    "Casual"
                ],

                datasets: [

                    {
                        data: [
                            48,
                            27,
                            17,
                            8
                        ],

                        backgroundColor: [
                            "#2563eb",
                            "#7c3aed",
                            "#16a34a",
                            "#ea580c"
                        ],

                        borderWidth: 0,

                        hoverOffset: 7

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "72%",

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        backgroundColor:
                            "#111827",

                        padding: 12

                    }

                }

            }

        }
    );

}


/* =========================================================
   DATE RANGE
========================================================= */

function setupDateRange() {

    const select =
        document.getElementById(
            "dateRange"
        );

    if (!select) return;


    select.addEventListener(
        "change",
        event => {

            const days =
                event.target.value;


            updateAnalytics(days);

        }
    );

}


function updateAnalytics(
    days
) {

    const revenue =
        document.getElementById(
            "revenueValue"
        );

    const orders =
        document.getElementById(
            "ordersValue"
        );

    const customers =
        document.getElementById(
            "customersValue"
        );

    const average =
        document.getElementById(
            "averageValue"
        );


    const multiplier = {

        "7": .24,

        "30": 1,

        "90": 2.8,

        "365": 11.7

    };


    const factor =
        multiplier[days] || 1;


    const revenueValue =
        Math.round(
            842650 * factor
        );


    const ordersValue =
        Math.round(
            1284 * factor
        );


    const customersValue =
        Math.round(
            1248 * factor
        );


    const averageValue =
        ordersValue > 0
            ? Math.round(
                revenueValue /
                ordersValue
            )
            : 0;


    if (revenue) {

        revenue.textContent =
            "₹" +
            revenueValue.toLocaleString(
                "en-IN"
            );

    }


    if (orders) {

        orders.textContent =
            ordersValue.toLocaleString(
                "en-IN"
            );

    }


    if (customers) {

        customers.textContent =
            customersValue.toLocaleString(
                "en-IN"
            );

    }


    if (average) {

        average.textContent =
            "₹" +
            averageValue.toLocaleString(
                "en-IN"
            );

    }

}


/* =========================================================
   EXPORT
========================================================= */

function setupExport() {

    const button =
        document.getElementById(
            "exportReportBtn"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        exportReport
    );

}


function exportReport() {

    const data = [

        [
            "Metric",
            "Value"
        ],

        [
            "Total Revenue",
            "842650"
        ],

        [
            "Total Orders",
            "1284"
        ],

        [
            "Customers",
            "1248"
        ],

        [
            "Average Order Value",
            "2146"
        ],

        [
            "Conversion Rate",
            "4.82%"
        ],

        [
            "Repeat Customers",
            "64.8%"
        ],

        [
            "Customer Rating",
            "4.8 / 5"
        ]

    ];


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
        "soleai-analytics-report.csv";


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
        .querySelectorAll("a")
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


            window.location.href =
                "../index.html";

        }
    );

}
