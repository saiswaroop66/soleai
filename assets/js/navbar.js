/* ===========================================================
   SoleAI Navbar
   File : navbar.js
   Version : 2.0
   Features:
   - Sticky navbar
   - Mobile menu
   - Active menu
   - Dropdown animation
   - My SoleAI profile menu
   - Back to top
   - GSAP animation
=========================================================== */


/* ===========================================================
   DOCUMENT READY
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavbar();

});


/* ===========================================================
   INITIALIZE NAVBAR
=========================================================== */

function initializeNavbar() {

    stickyNavbar();

    mobileMenu();

    activeMenu();

    profileMenu();

    navbarAnimation();

    dropdownAnimation();

    backToTop();

}


/* ===========================================================
   STICKY NAVBAR
=========================================================== */

function stickyNavbar() {

    const navbar =
        document.querySelector(".navbar");

    if (!navbar) return;


    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    });

}


/* ===========================================================
   MOBILE MENU
=========================================================== */

function mobileMenu() {

    const menuBtn =
        document.getElementById("menu-toggle");

    const navMenu =
        document.querySelector(".nav-menu");

    if (!menuBtn || !navMenu) return;


    menuBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        navMenu.classList.toggle("active");


        const icon =
            menuBtn.querySelector("i");


        if (!icon) return;


        if (
            navMenu.classList.contains("active")
        ) {

            icon.classList.remove("bi-list");

            icon.classList.add("bi-x-lg");

        } else {

            icon.classList.remove("bi-x-lg");

            icon.classList.add("bi-list");

        }

    });

}


/* ===========================================================
   ACTIVE MENU
=========================================================== */

function activeMenu() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const links =
        document.querySelectorAll(
            ".nav-menu a"
        );


    links.forEach(link => {

        const href =
            link.getAttribute("href");


        if (
            href &&
            href === currentPage
        ) {

            link.classList.add("active");

        }

    });

}


/* ===========================================================
   PROFILE MENU
=========================================================== */

function profileMenu() {

    const profileButton =
        document.getElementById(
            "profile-toggle"
        );


    const profileMenu =
        document.getElementById(
            "profile-menu"
        );


    if (
        !profileButton ||
        !profileMenu
    ) {

        return;

    }


    /* -----------------------------------------
       Toggle profile menu
    ----------------------------------------- */

    profileButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();


            profileMenu.classList.toggle(
                "active"
            );


            profileButton.classList.toggle(
                "active"
            );

        }
    );


    /* -----------------------------------------
       Close profile menu
    ----------------------------------------- */

    document.addEventListener(
        "click",
        (event) => {

            if (
                !profileMenu.contains(
                    event.target
                ) &&
                !profileButton.contains(
                    event.target
                )
            ) {

                profileMenu.classList.remove(
                    "active"
                );

                profileButton.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* ===========================================================
   CLOSE MOBILE MENU
=========================================================== */

document.addEventListener(
    "click",
    (event) => {

        const navMenu =
            document.querySelector(
                ".nav-menu"
            );


        const menuBtn =
            document.getElementById(
                "menu-toggle"
            );


        if (
            !navMenu ||
            !menuBtn
        ) {

            return;

        }


        if (
            !navMenu.contains(
                event.target
            ) &&
            !menuBtn.contains(
                event.target
            )
        ) {

            navMenu.classList.remove(
                "active"
            );


            const icon =
                menuBtn.querySelector("i");


            if (icon) {

                icon.classList.remove(
                    "bi-x-lg"
                );

                icon.classList.add(
                    "bi-list"
                );

            }

        }

    }
);


/* ===========================================================
   GSAP NAVBAR
=========================================================== */

function navbarAnimation() {

    if (
        typeof gsap === "undefined"
    ) {

        return;

    }


    const navbar =
        document.querySelector(
            ".navbar"
        );


    if (!navbar) return;


    gsap.from(
        navbar,
        {

            y: -80,

            opacity: 0,

            duration: 1,

            ease: "power3.out"

        }
    );

}


/* ===========================================================
   DROPDOWN ANIMATION
=========================================================== */

function dropdownAnimation() {

    const dropdowns =
        document.querySelectorAll(
            ".dropdown"
        );


    dropdowns.forEach(
        dropdown => {

            dropdown.addEventListener(
                "mouseenter",
                () => {

                    if (
                        typeof gsap ===
                        "undefined"
                    ) {

                        return;

                    }


                    const menu =
                        dropdown.querySelector(
                            ".dropdown-menu"
                        );


                    if (!menu) return;


                    gsap.fromTo(

                        menu,

                        {

                            opacity: 0,

                            y: 15

                        },

                        {

                            opacity: 1,

                            y: 0,

                            duration: .35,

                            ease: "power2.out"

                        }

                    );

                }
            );

        }
    );

}


/* ===========================================================
   BACK TO TOP
=========================================================== */

function backToTop() {

    const backBtn =
        document.getElementById(
            "backToTop"
        );


    if (!backBtn) return;


    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY > 500
            ) {

                backBtn.classList.add(
                    "show"
                );

            } else {

                backBtn.classList.remove(
                    "show"
                );

            }

        }
    );


    backBtn.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* ===========================================================
   END OF FILE
=========================================================== */