"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("adminLoginForm");

    const emailInput =
        document.getElementById("adminEmail");

    const passwordInput =
        document.getElementById("adminPassword");

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    const loginButton =
        document.getElementById("adminLoginButton");

    const passwordToggle =
        document.getElementById("passwordToggle");


    // ==========================================
    // SHOW / HIDE PASSWORD
    // ==========================================

    if (passwordToggle) {

        passwordToggle.addEventListener("click", () => {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                passwordToggle.innerHTML =
                    '<i class="bi bi-eye-slash"></i>';

            } else {

                passwordInput.type = "password";

                passwordToggle.innerHTML =
                    '<i class="bi bi-eye"></i>';

            }

        });

    }


    // ==========================================
    // LOGIN
    // ==========================================

    form.addEventListener("submit", (event) => {

        event.preventDefault();


        // Clear errors

        if (emailError) {
            emailError.textContent = "";
        }

        if (passwordError) {
            passwordError.textContent = "";
        }

        emailInput.classList.remove("invalid");
        passwordInput.classList.remove("invalid");


        // Get values

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        // ======================================
        // EMAIL REQUIRED
        // ======================================

        if (!email) {

            if (emailError) {

                emailError.textContent =
                    "Please enter your email.";

            }

            emailInput.classList.add("invalid");

            return;
        }


        // ======================================
        // PASSWORD REQUIRED
        // ======================================

        if (!password) {

            if (passwordError) {

                passwordError.textContent =
                    "Please enter your password.";

            }

            passwordInput.classList.add("invalid");

            return;
        }


        // ======================================
        // ANY CREDENTIALS ACCEPTED
        // ======================================

        const adminSession = {

            authenticated: true,

            role: "admin",

            email: email,

            loginTime:
                new Date().toISOString()

        };


        // Store only the temporary session.
        // Password is NOT stored.

        sessionStorage.setItem(
            "soleaiAdminSession",
            JSON.stringify(adminSession)
        );


        // ======================================
        // BUTTON LOADING
        // ======================================

        if (loginButton) {

            loginButton.disabled = true;

            loginButton.classList.add("loading");

        }


        // ======================================
        // REDIRECT
        // ======================================

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 500);

    });

});