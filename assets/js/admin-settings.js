"use strict";


/* =========================================================
   SOLEAI ADMIN SETTINGS
========================================================= */


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const defaultSettings = {

    storeName:
        "SoleAI",

    storeEmail:
        "support@soleai.com",

    storePhone:
        "+91 98765 43210",

    country:
        "India",

    timezone:
        "Asia/Kolkata (IST)",

    storeAddress:
        "SoleAI Headquarters, Visakhapatnam, Andhra Pradesh, India",

    autoConfirm:
        true,

    allowCancellation:
        true,

    guestCheckout:
        true,

    phoneVerification:
        false,

    freeShipping:
        "2999",

    standardShipping:
        "99",

    expressShipping:
        "199",

    deliveryDays:
        "3 - 5 Business Days",

    expressEnabled:
        true,

    newOrderNotification:
        true,

    lowStockNotification:
        true,

    reviewNotification:
        true,

    promoNotification:
        false,

    loginAlerts:
        true,

    sessionTimeout:
        "30 minutes",

    currency:
        "INR — Indian Rupee",

    taxRate:
        "18",

    codEnabled:
        true,

    onlinePayments:
        true

};


/* =========================================================
   CURRENT SETTINGS
========================================================= */

let settings = loadSettings();


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeSettings
);


function initializeSettings() {

    loadFormValues();

    setupTabs();

    setupSave();

    setupReset();

    setupMobileMenu();

    setupLogout();

    setupTwoFactor();

}


/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadSettings() {

    try {

        const saved =
            localStorage.getItem(
                "soleaiAdminSettings"
            );


        if (!saved) {

            return {
                ...defaultSettings
            };

        }


        return {

            ...defaultSettings,

            ...JSON.parse(saved)

        };

    }

    catch (error) {

        console.error(
            "Unable to load settings:",
            error
        );


        return {
            ...defaultSettings
        };

    }

}


/* =========================================================
   LOAD FORM VALUES
========================================================= */

function loadFormValues() {

    setInput(
        "storeName",
        settings.storeName
    );

    setInput(
        "storeEmail",
        settings.storeEmail
    );

    setInput(
        "storePhone",
        settings.storePhone
    );

    setInput(
        "country",
        settings.country
    );

    setInput(
        "timezone",
        settings.timezone
    );

    setInput(
        "storeAddress",
        settings.storeAddress
    );


    setChecked(
        "autoConfirm",
        settings.autoConfirm
    );

    setChecked(
        "allowCancellation",
        settings.allowCancellation
    );

    setChecked(
        "guestCheckout",
        settings.guestCheckout
    );

    setChecked(
        "phoneVerification",
        settings.phoneVerification
    );


    setInput(
        "freeShipping",
        settings.freeShipping
    );

    setInput(
        "standardShipping",
        settings.standardShipping
    );

    setInput(
        "expressShipping",
        settings.expressShipping
    );

    setInput(
        "deliveryDays",
        settings.deliveryDays
    );

    setChecked(
        "expressEnabled",
        settings.expressEnabled
    );


    setChecked(
        "newOrderNotification",
        settings.newOrderNotification
    );

    setChecked(
        "lowStockNotification",
        settings.lowStockNotification
    );

    setChecked(
        "reviewNotification",
        settings.reviewNotification
    );

    setChecked(
        "promoNotification",
        settings.promoNotification
    );


    setChecked(
        "loginAlerts",
        settings.loginAlerts
    );

    setInput(
        "sessionTimeout",
        settings.sessionTimeout
    );


    setInput(
        "currency",
        settings.currency
    );

    setInput(
        "taxRate",
        settings.taxRate
    );

    setChecked(
        "codEnabled",
        settings.codEnabled
    );

    setChecked(
        "onlinePayments",
        settings.onlinePayments
    );

}


/* =========================================================
   SETTINGS TABS
========================================================= */

function setupTabs() {

    const tabs =
        document.querySelectorAll(
            ".settings-tab"
        );


    const sections =
        document.querySelectorAll(
            ".settings-section"
        );


    tabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    const target =
                        tab.dataset.section;


                    tabs.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    sections.forEach(
                        section => {

                            section.classList.remove(
                                "active"
                            );

                        }
                    );


                    tab.classList.add(
                        "active"
                    );


                    const section =
                        document.getElementById(
                            target
                        );


                    if (section) {

                        section.classList.add(
                            "active"
                        );

                    }


                    if (
                        window.innerWidth <=
                        900
                    ) {

                        section?.scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });

                    }

                }
            );

        }
    );

}


/* =========================================================
   SAVE
========================================================= */

function setupSave() {

    const button =
        document.getElementById(
            "saveBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        saveSettings
    );

}


function saveSettings() {

    settings = {

        storeName:
            getInput(
                "storeName"
            ),

        storeEmail:
            getInput(
                "storeEmail"
            ),

        storePhone:
            getInput(
                "storePhone"
            ),

        country:
            getInput(
                "country"
            ),

        timezone:
            getInput(
                "timezone"
            ),

        storeAddress:
            getInput(
                "storeAddress"
            ),


        autoConfirm:
            getChecked(
                "autoConfirm"
            ),

        allowCancellation:
            getChecked(
                "allowCancellation"
            ),

        guestCheckout:
            getChecked(
                "guestCheckout"
            ),

        phoneVerification:
            getChecked(
                "phoneVerification"
            ),


        freeShipping:
            getInput(
                "freeShipping"
            ),

        standardShipping:
            getInput(
                "standardShipping"
            ),

        expressShipping:
            getInput(
                "expressShipping"
            ),

        deliveryDays:
            getInput(
                "deliveryDays"
            ),

        expressEnabled:
            getChecked(
                "expressEnabled"
            ),


        newOrderNotification:
            getChecked(
                "newOrderNotification"
            ),

        lowStockNotification:
            getChecked(
                "lowStockNotification"
            ),

        reviewNotification:
            getChecked(
                "reviewNotification"
            ),

        promoNotification:
            getChecked(
                "promoNotification"
            ),


        loginAlerts:
            getChecked(
                "loginAlerts"
            ),

        sessionTimeout:
            getInput(
                "sessionTimeout"
            ),


        currency:
            getInput(
                "currency"
            ),

        taxRate:
            getInput(
                "taxRate"
            ),

        codEnabled:
            getChecked(
                "codEnabled"
            ),

        onlinePayments:
            getChecked(
                "onlinePayments"
            )

    };


    try {

        localStorage.setItem(
            "soleaiAdminSettings",
            JSON.stringify(
                settings
            )
        );

    }

    catch (error) {

        console.error(
            "Unable to save settings:",
            error
        );

    }


    showToast();

}


/* =========================================================
   RESET
========================================================= */

function setupReset() {

    const button =
        document.getElementById(
            "resetBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        resetSettings
    );

}


function resetSettings() {

    const confirmed =
        window.confirm(
            "Reset all settings to their default values?"
        );


    if (!confirmed) {
        return;
    }


    settings = {
        ...defaultSettings
    };


    loadFormValues();


    try {

        localStorage.removeItem(
            "soleaiAdminSettings"
        );

    }

    catch (error) {

        console.error(error);

    }


    showToast(
        "Settings Reset",
        "Default settings have been restored."
    );

}


/* =========================================================
   TWO FACTOR
========================================================= */

function setupTwoFactor() {

    const button =
        document.getElementById(
            "twoFactorBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            if (
                button.textContent.trim()
                === "Enable"
            ) {

                button.textContent =
                    "Enabled";

                button.style.color =
                    "#16a34a";

                button.style.borderColor =
                    "#bbf7d0";

                button.style.background =
                    "#f0fdf4";

            }

            else {

                button.textContent =
                    "Enable";

                button.style.color =
                    "";

                button.style.borderColor =
                    "";

                button.style.background =
                    "";

            }

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


        overlay?.classList.remove(
            "show"
        );


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


            overlay?.classList.toggle(
                "show",
                open
            );


            document.body.style.overflow =
                open
                    ? "hidden"
                    : "";

        }
    );


    overlay?.addEventListener(
        "click",
        closeMenu
    );


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
   TOAST
========================================================= */

function showToast(
    title = "Settings Saved",
    message =
        "Your changes have been saved successfully."
) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {
        return;
    }


    const strong =
        toast.querySelector(
            "strong"
        );


    const span =
        toast.querySelector(
            "span"
        );


    if (strong) {
        strong.textContent =
            title;
    }


    if (span) {
        span.textContent =
            message;
    }


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.soleaiToastTimer
    );


    window.soleaiToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   HELPERS
========================================================= */

function getInput(id) {

    const element =
        document.getElementById(
            id
        );


    return element
        ? element.value
        : "";

}


function setInput(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value;

    }

}


function getChecked(id) {

    const element =
        document.getElementById(
            id
        );


    return element
        ? element.checked
        : false;

}


function setChecked(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.checked =
            Boolean(
                value
            );

    }

}