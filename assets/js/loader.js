"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const container =
        document.getElementById("loader-container");

    if (!container) {
        return;
    }

    fetch("components/loader.html")
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Loader file could not be loaded."
                );
            }

            return response.text();

        })
        .then(data => {

            container.innerHTML = data;

            if (typeof gsap === "undefined") {
                container.style.display = "none";
                return;
            }

            gsap.from(".loader-logo", {
                y: -40,
                opacity: 0,
                duration: 1
            });

            gsap.from(".loader-icon", {
                scale: 0,
                duration: 1,
                delay: 0.4
            });

            gsap.to(".loader-progress-bar", {
                width: "100%",
                duration: 2,
                ease: "power2.out",

                onComplete: () => {

                    gsap.to(container, {
                        opacity: 0,
                        duration: 0.6,

                        onComplete: () => {
                            container.style.display = "none";
                        }

                    });

                }

            });

        })
        .catch(error => {

            console.error(
                "SoleAI Loader:",
                error
            );

            // Don't let the loader block the website
            container.style.display = "none";

        });

});