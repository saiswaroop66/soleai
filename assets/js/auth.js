"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const API_URL =
        "https://soleai-backend.onrender.com/api/auth/login";


    /* ==========================================
       ELEMENTS
    ========================================== */

    const form =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    const loginButton =
        document.getElementById("loginButton");

    const passwordToggle =
        document.getElementById("passwordToggle");


    /* ==========================================
       CHECK FORM
    ========================================== */

    if (!form) {

        console.error(
            "loginForm not found."
        );

        return;
    }


    /* ==========================================
       PASSWORD SHOW / HIDE
    ========================================== */

    if (passwordToggle) {

        passwordToggle.addEventListener(
            "click",
            () => {

                if (
                    passwordInput.type ===
                    "password"
                ) {

                    passwordInput.type =
                        "text";

                    passwordToggle.innerHTML =
                        '<i class="bi bi-eye-slash"></i>';

                } else {

                    passwordInput.type =
                        "password";

                    passwordToggle.innerHTML =
                        '<i class="bi bi-eye"></i>';

                }

            }
        );

    }


    /* ==========================================
       EMAIL VALIDATION
    ========================================== */

    function validateEmail() {

        const email =
            emailInput.value
                .trim()
                .toLowerCase();


        emailError.textContent = "";

        emailInput.classList.remove(
            "invalid"
        );


        if (!email) {

            emailError.textContent =
                "Please enter your email.";

            emailInput.classList.add(
                "invalid"
            );

            return false;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(email)
        ) {

            emailError.textContent =
                "Please enter a valid email.";

            emailInput.classList.add(
                "invalid"
            );

            return false;
        }


        return true;

    }


    /* ==========================================
       PASSWORD VALIDATION
    ========================================== */

    function validatePassword() {

        const password =
            passwordInput.value;


        passwordError.textContent = "";

        passwordInput.classList.remove(
            "invalid"
        );


        if (!password) {

            passwordError.textContent =
                "Please enter your password.";

            passwordInput.classList.add(
                "invalid"
            );

            return false;
        }


        return true;

    }


    /* ==========================================
       LOGIN
    ========================================== */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const emailValid =
                validateEmail();

            const passwordValid =
                validatePassword();


            if (
                !emailValid ||
                !passwordValid
            ) {

                return;
            }


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;


            /* ==============================
               BUTTON LOADING
            ============================== */

            if (loginButton) {

                loginButton.disabled =
                    true;

                loginButton.classList.add(
                    "loading"
                );

            }


            try {

                /* ==============================
                   SEND LOGIN REQUEST
                ============================== */

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    email:
                                        email,

                                    password:
                                        password

                                })

                        }
                    );


                const data =
                    await response.json();


                /* ==============================
                   LOGIN FAILED
                ============================== */

                if (!response.ok) {

                    passwordError.textContent =
                        data.message ||
                        "Invalid email or password.";

                    passwordInput.classList.add(
                        "invalid"
                    );

                    return;
                }


                /* ==============================
                   CHECK TOKEN
                ============================== */

                if (!data.token) {

                    console.error(
                        "JWT token missing:",
                        data
                    );

                    passwordError.textContent =
                        "Login succeeded, but authentication token was not received.";

                    return;
                }


                /* ==============================
                   LOGIN SUCCESS
                ============================== */

                console.log(
                    "LOGIN SUCCESS:",
                    data.user
                );


                console.log(
                    "JWT TOKEN RECEIVED"
                );


                /* ==============================
                   SAVE JWT TOKEN
                ============================== */

                localStorage.setItem(
                    "soleaiToken",
                    data.token
                );


                /* ==============================
                   CREATE USER SESSION
                ============================== */

                const userSession = {

                    loggedIn: true,

                    id:
                        data.user.id,

                    name:
                        data.user.name,

                    email:
                        data.user.email,

                    role:
                        data.user.role,

                    loginTime:
                        new Date().toISOString()

                };


                sessionStorage.setItem(
                    "soleaiUserSession",
                    JSON.stringify(
                        userSession
                    )
                );


                /* ==============================
                   SUCCESS MESSAGE
                ============================== */

                showToast(
                    "Welcome",
                    "Login successful."
                );


                /* ==============================
                   REDIRECT
                ============================== */

                setTimeout(
                    () => {

                        window.location.href =
                            "./checkout.html";

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Login request failed:",
                    error
                );


                passwordError.textContent =
                    "Unable to connect to the server. Make sure the SoleAI backend is running.";

            } finally {

                if (loginButton) {

                    loginButton.disabled =
                        false;

                    loginButton.classList.remove(
                        "loading"
                    );

                }

            }

        }
    );


    /* ==========================================
       TOAST
    ========================================== */

    function showToast(
        title,
        message
    ) {

        const toast =
            document.getElementById(
                "toast"
            );

        const toastTitle =
            document.getElementById(
                "toastTitle"
            );

        const toastMessage =
            document.getElementById(
                "toastMessage"
            );


        if (!toast) {

            return;

        }


        if (toastTitle) {

            toastTitle.textContent =
                title;

        }


        if (toastMessage) {

            toastMessage.textContent =
                message;

        }


        toast.classList.add(
            "show"
        );


        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

    }


    /* ==========================================
       LIVE VALIDATION
    ========================================== */

    emailInput.addEventListener(
        "blur",
        validateEmail
    );


    passwordInput.addEventListener(
        "blur",
        validatePassword
    );

});
