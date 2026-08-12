/* ============================================================
   SOLEAI — AI SIZE GUIDE
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    AISizeGuide.init();

});


const AISizeGuide = {

    state: {

        footLength: null,

        width: "regular",

        fit: "regular"

    },


    /* ========================================================
       INIT
    ======================================================== */

    init() {

        this.bindWidthOptions();

        this.bindFitOptions();

        this.bindCalculator();

        this.bindFootInput();

    },


    /* ========================================================
       WIDTH OPTIONS
    ======================================================== */

    bindWidthOptions() {

        const options =
            document.querySelectorAll(
                ".width-option"
            );


        options.forEach(option => {

            option.addEventListener(
                "click",
                () => {

                    options.forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                    option.classList.add(
                        "active"
                    );


                    this.state.width =
                        option.dataset.width;

                }
            );

        });

    },


    /* ========================================================
       FIT OPTIONS
    ======================================================== */

    bindFitOptions() {

        const options =
            document.querySelectorAll(
                ".fit-option"
            );


        options.forEach(option => {

            option.addEventListener(
                "click",
                () => {

                    options.forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                    option.classList.add(
                        "active"
                    );


                    this.state.fit =
                        option.dataset.fit;

                }
            );

        });

    },


    /* ========================================================
       FOOT LENGTH INPUT
    ======================================================== */

    bindFootInput() {

        const input =
            document.getElementById(
                "foot-length"
            );


        if (!input) {
            return;
        }


        input.addEventListener(
            "input",
            () => {

                const value =
                    parseFloat(
                        input.value
                    );


                if (
                    !isNaN(value)
                ) {

                    this.state.footLength =
                        value;

                }

            }
        );


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    this.calculate();

                }

            }
        );

    },


    /* ========================================================
       CALCULATOR
    ======================================================== */

    bindCalculator() {

        const button =
            document.getElementById(
                "calculate-size"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            () => {

                this.calculate();

            }
        );

    },


    /* ========================================================
       CALCULATE
    ======================================================== */

    calculate() {

        const input =
            document.getElementById(
                "foot-length"
            );


        const error =
            document.getElementById(
                "size-error"
            );


        if (!input) {
            return;
        }


        const length =
            parseFloat(
                input.value
            );


        /*
         * Validation
         */

        if (
            isNaN(length)
        ) {

            this.showError(
                "Please enter your foot length in centimeters."
            );

            input.focus();

            return;

        }


        if (
            length < 18 ||
            length > 35
        ) {

            this.showError(
                "Please enter a foot length between 18 cm and 35 cm."
            );

            input.focus();

            return;

        }


        if (error) {
            error.textContent = "";
        }


        this.state.footLength =
            length;


        /*
         * Calculate recommendation
         */

        const result =
            this.calculateSize(
                length,
                this.state.width,
                this.state.fit
            );


        /*
         * Show result
         */

        this.displayResult(
            result
        );

    },


    /* ========================================================
       SIZE CALCULATION
    ======================================================== */

    calculateSize(
        length,
        width,
        fit
    ) {

        /*
         * Approximate UK/India
         * sizing based on foot length.
         *
         * We round to the closest half/whole
         * size and then adjust for fit preference.
         */


        let ukSize =
            this.cmToUK(length);


        /*
         * Fit adjustment
         */

        if (
            fit === "snug"
        ) {

            ukSize -= 0.5;

        }


        if (
            fit === "roomy"
        ) {

            ukSize += 0.5;

        }


        /*
         * Wide feet may benefit from
         * a little additional room.
         */

        if (
            width === "wide" &&
            fit !== "snug"
        ) {

            ukSize += 0.5;

        }


        /*
         * Keep sensible limits
         */

        ukSize =
            Math.max(
                3,
                Math.min(
                    13,
                    ukSize
                )
            );


        /*
         * Convert sizes
         */

        const usSize =
            ukSize + 1;


        const euSize =
            this.ukToEU(
                ukSize
            );


        const recommendedCM =
            this.sizeToCM(
                ukSize
            );


        /*
         * Confidence
         */

        let confidence = 94;


        if (
            length >= 23 &&
            length <= 30
        ) {

            confidence += 2;

        }


        if (
            width === "wide"
        ) {

            confidence -= 1;

        }


        if (
            fit === "regular"
        ) {

            confidence += 1;

        }


        confidence =
            Math.min(
                98,
                Math.max(
                    88,
                    confidence
                )
            );


        /*
         * Fit description
         */

        let fitTitle =
            "Excellent fit";


        let fitText =
            "This size should provide a comfortable everyday fit.";


        if (
            fit === "snug"
        ) {

            fitTitle =
                "Secure fit";


            fitText =
                "This recommendation gives you a closer, more secure fit around the foot.";

        }


        if (
            fit === "roomy"
        ) {

            fitTitle =
                "Roomy comfort";


            fitText =
                "This recommendation leaves additional space for a relaxed and comfortable fit.";

        }


        if (
            width === "wide"
        ) {

            fitText +=
                " Your wide-foot preference has been considered.";

        }


        return {

            uk:
                this.formatSize(
                    ukSize
                ),

            us:
                this.formatSize(
                    usSize
                ),

            eu:
                euSize,

            cm:
                recommendedCM,

            confidence,

            fitTitle,

            fitText

        };

    },


    /* ========================================================
       CM → UK
    ======================================================== */

    cmToUK(cm) {

        /*
         * Practical approximate mapping.
         */

        const table = [

            {
                cm: 22.5,
                size: 3
            },

            {
                cm: 23.5,
                size: 4
            },

            {
                cm: 24.0,
                size: 5
            },

            {
                cm: 25.0,
                size: 6
            },

            {
                cm: 26.0,
                size: 7
            },

            {
                cm: 27.0,
                size: 8
            },

            {
                cm: 28.0,
                size: 9
            },

            {
                cm: 29.0,
                size: 10
            },

            {
                cm: 30.0,
                size: 11
            },

            {
                cm: 31.0,
                size: 12
            },

            {
                cm: 32.0,
                size: 13
            }

        ];


        let closest =
            table[0];


        let smallestDifference =
            Math.abs(
                cm -
                closest.cm
            );


        table.forEach(item => {

            const difference =
                Math.abs(
                    cm -
                    item.cm
                );


            if (
                difference <
                smallestDifference
            ) {

                closest =
                    item;

                smallestDifference =
                    difference;

            }

        });


        return closest.size;

    },


    /* ========================================================
       UK → EU
    ======================================================== */

    ukToEU(uk) {

        const rounded =
            Math.round(
                uk * 2
            ) / 2;


        const map = {

            3: 36,

            3.5: 36.5,

            4: 37,

            4.5: 37.5,

            5: 38,

            5.5: 38.5,

            6: 39,

            6.5: 40,

            7: 41,

            7.5: 42,

            8: 42.5,

            8.5: 43,

            9: 44,

            9.5: 44.5,

            10: 45,

            10.5: 45.5,

            11: 46,

            11.5: 47,

            12: 48,

            13: 49

        };


        return (
            map[rounded] ||
            Math.round(
                33 +
                uk * 1.35
            )
        );

    },


    /* ========================================================
       SIZE → CM
    ======================================================== */

    sizeToCM(uk) {

        const map = {

            3: 22.5,

            3.5: 23,

            4: 23.5,

            4.5: 24,

            5: 24.5,

            5.5: 25,

            6: 25.5,

            6.5: 26,

            7: 26.5,

            7.5: 27,

            8: 27.5,

            8.5: 28,

            9: 28.5,

            9.5: 29,

            10: 29.5,

            10.5: 30,

            11: 30.5,

            11.5: 31,

            12: 31.5,

            13: 32.5

        };


        return (
            map[uk] ||
            (22.5 +
                (uk - 3) *
                .9)
                .toFixed(1)
        );

    },


    /* ========================================================
       FORMAT SIZE
    ======================================================== */

    formatSize(size) {

        if (
            Number.isInteger(size)
        ) {

            return String(size);

        }


        return String(
            Number(
                size.toFixed(1)
            )
        );

    },


    /* ========================================================
       DISPLAY RESULT
    ======================================================== */

    displayResult(result) {

        const empty =
            document.getElementById(
                "result-empty"
            );


        const content =
            document.getElementById(
                "size-result-content"
            );


        if (
            empty
        ) {

            empty.style.display =
                "none";

        }


        if (
            content
        ) {

            content.style.display =
                "block";

        }


        /*
         * Recommended size
         */

        this.setText(
            "recommended-size",
            result.uk
        );


        this.setText(
            "uk-size",
            result.uk
        );


        this.setText(
            "us-size",
            result.us
        );


        this.setText(
            "eu-size",
            result.eu
        );


        this.setText(
            "cm-size",
            result.cm
        );


        this.setText(
            "confidence-score",
            result.confidence
        );


        this.setText(
            "fit-result-title",
            result.fitTitle
        );


        this.setText(
            "fit-result-text",
            result.fitText
        );


        /*
         * Animate confidence
         */

        this.animateConfidence(
            result.confidence
        );


        /*
         * Scroll result into view
         */

        setTimeout(() => {

            const resultPanel =
                document.querySelector(
                    ".size-result"
                );


            if (
                window.innerWidth < 900 &&
                resultPanel
            ) {

                resultPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }, 150);

    },


    /* ========================================================
       SET TEXT
    ======================================================== */

    setText(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );


        if (
            element
        ) {

            element.textContent =
                value;

        }

    },


    /* ========================================================
       CONFIDENCE ANIMATION
    ======================================================== */

    animateConfidence(
        target
    ) {

        const element =
            document.getElementById(
                "confidence-score"
            );


        if (!element) {
            return;
        }


        let current = 0;


        const duration =
            650;


        const start =
            performance.now();


        function animate(
            timestamp
        ) {

            const progress =
                Math.min(
                    (timestamp - start) /
                    duration,
                    1
                );


            current =
                Math.round(
                    progress *
                    target
                );


            element.textContent =
                current;


            if (
                progress < 1
            ) {

                requestAnimationFrame(
                    animate
                );

            }

        }


        requestAnimationFrame(
            animate
        );

    },


    /* ========================================================
       ERROR
    ======================================================== */

    showError(message) {

        const error =
            document.getElementById(
                "size-error"
            );


        if (!error) {
            return;
        }


        error.textContent =
            message;


        error.animate(
            [
                {
                    opacity: 0
                },

                {
                    opacity: 1
                }
            ],
            {
                duration: 250
            }
        );

    }

};