"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const API_URL =
        "https://soleai-backend.onrender.com/api/auth/register";


    /* ==========================================
       ELEMENTS
    ========================================== */

    const form =
        document.getElementById("registerForm");

    const nameInput =
        document.getElementById("fullName");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const confirmInput =
        document.getElementById("confirmPassword");

    const termsInput =
        document.getElementById("terms");

    const registerButton =
        document.getElementById("registerButton");

    const passwordToggle =
        document.getElementById("passwordToggle");


    /* ==========================================
       CHECK FORM
    ========================================== */

    if (!form) {

        console.error(
            "registerForm not found."
        );

        return;
    }


    /* ==========================================
       PASSWORD SHOW / HIDE
    ========================================== */

    if (passwordToggle) {

        passwordToggle.addEventListener(
            "click",
            function () {

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
       ERROR FUNCTION
    ========================================== */

    function showError(
        id,
        message
    ) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                message;

        }

    }


    function clearErrors() {

        showError(
            "nameError",
            ""
        );

        showError(
            "emailError",
            ""
        );

        showError(
            "passwordError",
            ""
        );

        showError(
            "confirmError",
            ""
        );

        showError(
            "termsError",
            ""
        );

    }


    /* ==========================================
       SUBMIT
    ========================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            clearErrors();


            /* ==============================
               GET VALUES
            ============================== */

            const name =
                nameInput.value.trim();

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmInput.value;


            /* ==============================
               NAME VALIDATION
            ============================== */

            if (name.length < 2) {

                showError(
                    "nameError",
                    "Please enter your full name."
                );

                nameInput.focus();

                return;
            }


            /* ==============================
               EMAIL VALIDATION
            ============================== */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(email)
            ) {

                showError(
                    "emailError",
                    "Please enter a valid email address."
                );

                emailInput.focus();

                return;
            }


            /* ==============================
               PASSWORD VALIDATION
            ============================== */

            if (password.length < 6) {

                showError(
                    "passwordError",
                    "Password must contain at least 6 characters."
                );

                passwordInput.focus();

                return;
            }


            /* ==============================
               CONFIRM PASSWORD
            ============================== */

            if (
                password !==
                confirmPassword
            ) {

                showError(
                    "confirmError",
                    "Passwords do not match."
                );

                confirmInput.focus();

                return;
            }


            /* ==============================
               TERMS
            ============================== */

            if (
                !termsInput.checked
            ) {

                showError(
                    "termsError",
                    "Please accept the Terms and Privacy Policy."
                );

                return;
            }


            /* ==============================
               LOADING
            ============================== */

            if (registerButton) {

                registerButton.disabled =
                    true;

                registerButton.classList.add(
                    "loading"
                );

            }


            try {

                /* ==============================
                   SEND TO BACKEND
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

                                    name:
                                        name,

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
                   BACKEND ERROR
                ============================== */

                if (!response.ok) {

                    if (
                        response.status ===
                        409
                    ) {

                        showError(
                            "emailError",
                            "An account with this email already exists."
                        );

                        emailInput.focus();

                    } else if (
                        data.message
                    ) {

                        showError(
                            "emailError",
                            data.message
                        );

                    } else {

                        showError(
                            "emailError",
                            "Unable to create account. Please try again."
                        );

                    }


                    return;
                }


                /* ==============================
                   SUCCESS
                ============================== */

                console.log(
                    "ACCOUNT CREATED:",
                    data.user
                );


                showToast(
                    "Account Created!",
                    "Your SoleAI account was created successfully."
                );


                /* ==============================
                   REDIRECT
                ============================== */

                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1800
                );


            } catch (error) {

                console.error(
                    "Registration request failed:",
                    error
                );


                showError(
                    "emailError",
                    "Unable to connect to the server. Make sure the SoleAI backend is running."
                );

            } finally {

                if (registerButton) {

                    registerButton.disabled =
                        false;

                    registerButton.classList.remove(
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

            alert(
                title +
                "\n\n" +
                message
            );

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
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            1600
        );

    }

});
