"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const photoInput =
        document.getElementById("photo-input");

    const uploadArea =
        document.getElementById("upload-area");

    const uploadPlaceholder =
        document.getElementById("upload-placeholder");

    const uploadedPreview =
        document.getElementById("uploaded-preview");

    const userPhoto =
        document.getElementById("user-photo");

    const processingState =
        document.getElementById("processing-state");

    const shoeSelection =
        document.getElementById("shoe-selection");

    const tryonButton =
        document.getElementById("tryon-btn");

    const tryonMessage =
        document.getElementById("tryon-message");

    const resultSection =
        document.getElementById("tryon-result");

    const beforeImage =
        document.getElementById("before-image");

    const afterImage =
        document.getElementById("after-image");

    const resultProductImage =
        document.getElementById(
            "result-product-image"
        );

    const resultProductName =
        document.getElementById(
            "result-product-name"
        );

    const resultProductBrand =
        document.getElementById(
            "result-product-brand"
        );

    const resultProductPrice =
        document.getElementById(
            "result-product-price"
        );

    const wishlistButton =
        document.getElementById(
            "wishlist-btn"
        );

    const addCartButton =
        document.getElementById(
            "add-cart-btn"
        );

    const clearPreviewButton =
        document.getElementById(
            "clear-preview"
        );

    const backToTop =
        document.getElementById(
            "backToTop"
        );


    // ==========================================
    // STATE
    // ==========================================

    let selectedProduct = null;

    let uploadedImage = null;

    let imageObjectURL = null;

    let isProcessing = false;


    // ==========================================
    // FALLBACK PRODUCTS
    // ==========================================

    const fallbackProducts = [

        {
            id: "nike-pegasus-41",
            name: "Nike Air Zoom Pegasus 41",
            brand: "Nike",
            price: 6999,
            image:
                "./assets/images/products/download3.png"
        },

        {
            id: "adidas-adizero-sl",
            name: "Adidas Adizero SL",
            brand: "Adidas",
            price: 6499,
            image:
                "./assets/images/products/download1.png"
        },

        {
            id: "puma-future-rider",
            name: "Puma Future Rider",
            brand: "Puma",
            price: 4999,
            image:
                "./assets/images/products/download5.png"
        },

        {
            id: "new-balance-1080",
            name: "New Balance Fresh Foam 1080",
            brand: "New Balance",
            price: 7999,
            image:
                "./assets/images/products/download2.png"
        },

        {
            id: "nike-revolution-7",
            name: "Nike Revolution 7",
            brand: "Nike",
            price: 4299,
            image:
                "./assets/images/products/download4.png"
        },

        {
            id: "adidas-runfalcon",
            name: "Adidas Runfalcon 5",
            brand: "Adidas",
            price: 3899,
            image:
                "./assets/images/products/download2.png"
        }

    ];


    // ==========================================
    // GET PRODUCTS
    // ==========================================

    function getProducts() {

        let data = null;


        if (
            typeof products !== "undefined" &&
            Array.isArray(products)
        ) {

            data = products;

        }

        else if (
            typeof productData !== "undefined" &&
            Array.isArray(productData)
        ) {

            data = productData;

        }

        else if (
            Array.isArray(window.products)
        ) {

            data = window.products;

        }

        else if (
            Array.isArray(window.productData)
        ) {

            data = window.productData;

        }


        if (
            !data ||
            !data.length
        ) {

            return fallbackProducts;

        }


        return data.map(function (product) {

            return {

                id:
                    product.id ||
                    product.slug ||
                    createSlug(
                        product.name ||
                        product.title ||
                        "shoe"
                    ),

                name:
                    product.name ||
                    product.title ||
                    "SoleAI Shoe",

                brand:
                    product.brand ||
                    "SoleAI",

                price:
                    Number(
                        product.price ||
                        product.salePrice ||
                        product.currentPrice ||
                        0
                    ),

                image:
                    product.image ||
                    (
                        Array.isArray(product.images)
                            ? product.images[0]
                            : ""
                    ) ||
                    "./assets/images/products/download3.png"

            };

        });

    }


    // ==========================================
    // CREATE SLUG
    // ==========================================

    function createSlug(text) {

        return String(text)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    }


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    function formatPrice(price) {

        return "₹" +
            Number(price || 0)
                .toLocaleString("en-IN");

    }


    // ==========================================
    // LOAD SHOES
    // ==========================================

    function renderShoes() {

        if (!shoeSelection) {
            return;
        }


        const products =
            getProducts();


        shoeSelection.innerHTML = "";


        products
            .slice(0, 8)
            .forEach(function (product, index) {

                const option =
                    document.createElement("button");


                option.type =
                    "button";


                option.className =
                    "shoe-option";


                option.dataset.productId =
                    product.id;


                option.innerHTML = `

                    <div class="shoe-option-image">

                        <img
                            src="${escapeAttribute(product.image)}"
                            alt=""
                            loading="lazy"
                        >

                    </div>

                    <div class="shoe-option-info">

                        <strong></strong>

                        <span>
                            ${formatPrice(product.price)}
                        </span>

                    </div>

                    <div class="shoe-check">

                        <i class="bi bi-check"></i>

                    </div>

                `;


                const nameElement =
                    option.querySelector(
                        ".shoe-option-info strong"
                    );


                if (nameElement) {

                    nameElement.textContent =
                        product.name;

                }


                const image =
                    option.querySelector("img");


                if (image) {

                    image.addEventListener(
                        "error",
                        function () {

                            this.src =
                                "./assets/images/products/download3.png";

                        }
                    );

                }


                option.addEventListener(
                    "click",
                    function () {

                        selectProduct(
                            product,
                            option
                        );

                    }
                );


                shoeSelection.appendChild(
                    option
                );


                // Select first shoe automatically

                if (index === 0) {

                    selectProduct(
                        product,
                        option
                    );

                }

            });

    }


    // ==========================================
    // SELECT PRODUCT
    // ==========================================

    function selectProduct(
        product,
        selectedOption
    ) {

        selectedProduct =
            product;


        document
            .querySelectorAll(
                ".shoe-option"
            )
            .forEach(function (option) {

                option.classList.remove(
                    "active"
                );

            });


        if (selectedOption) {

            selectedOption.classList.add(
                "active"
            );

        }


        updateTryOnButton();

        showMessage(
            product.name +
            " selected."
        );

    }


    // ==========================================
    // PHOTO UPLOAD
    // ==========================================

    if (photoInput) {

        photoInput.addEventListener(
            "change",
            function (event) {

                const file =
                    event.target.files &&
                    event.target.files[0];


                if (!file) {
                    return;
                }


                handlePhoto(file);

            }
        );

    }


    // ==========================================
    // HANDLE PHOTO
    // ==========================================

    function handlePhoto(file) {

        const allowedTypes = [

            "image/jpeg",

            "image/png",

            "image/webp"

        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showMessage(
                "Please upload JPG, PNG or WEBP image."
            );

            resetFileInput();

            return;

        }


        const maxSize =
            10 * 1024 * 1024;


        if (
            file.size > maxSize
        ) {

            showMessage(
                "Image must be smaller than 10MB."
            );

            resetFileInput();

            return;

        }


        if (imageObjectURL) {

            URL.revokeObjectURL(
                imageObjectURL
            );

        }


        imageObjectURL =
            URL.createObjectURL(file);


        uploadedImage =
            imageObjectURL;


        if (userPhoto) {

            userPhoto.src =
                uploadedImage;

        }


        if (beforeImage) {

            beforeImage.src =
                uploadedImage;

        }


        if (afterImage) {

            // Demo mode:
            // Uses uploaded photo as preview.
            afterImage.src =
                uploadedImage;

        }


        if (uploadPlaceholder) {

            uploadPlaceholder.style.display =
                "none";

        }


        if (uploadedPreview) {

            uploadedPreview.style.display =
                "flex";

        }


        updateTryOnButton();


        showMessage(
            "Photo uploaded successfully."
        );

    }


    // ==========================================
    // UPDATE BUTTON
    // ==========================================

    function updateTryOnButton() {

        if (!tryonButton) {
            return;
        }


        const ready =
            selectedProduct &&
            uploadedImage;


        tryonButton.disabled =
            !ready;


        if (ready) {

            tryonButton.innerHTML = `

                <i class="bi bi-stars"></i>

                Generate AI Try-On

                <i class="bi bi-arrow-right"></i>

            `;

        }

    }


    // ==========================================
    // GENERATE TRY-ON
    // ==========================================

    if (tryonButton) {

        tryonButton.addEventListener(
            "click",
            generateTryOn
        );

    }


    function generateTryOn() {

        if (isProcessing) {
            return;
        }


        if (!uploadedImage) {

            showMessage(
                "Please upload your photo first."
            );

            return;

        }


        if (!selectedProduct) {

            showMessage(
                "Please select a shoe first."
            );

            return;

        }


        isProcessing =
            true;


        tryonButton.disabled =
            true;


        if (processingState) {

            processingState.style.display =
                "flex";

        }


        showMessage(
            "Preparing your AI preview..."
        );


        // Demo processing time

        setTimeout(
            function () {

                finishTryOn();

            },
            1600
        );

    }


    // ==========================================
    // FINISH TRY-ON
    // ==========================================

    function finishTryOn() {

        isProcessing =
            false;


        if (processingState) {

            processingState.style.display =
                "none";

        }


        if (beforeImage) {

            beforeImage.src =
                uploadedImage;

        }


        /*
         * Demo mode:
         *
         * There is no AI image-generation API
         * connected yet, so the uploaded photo is
         * displayed as the visualization.
         *
         * Later we can replace this with the
         * actual AI generated image.
         */

        if (afterImage) {

            afterImage.src =
                uploadedImage;

        }


        updateResultProduct();


        if (resultSection) {

            resultSection.style.display =
                "block";


            setTimeout(
                function () {

                    resultSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                },
                100
            );

        }


        tryonButton.disabled =
            false;


        showMessage(
            "Your virtual preview is ready!"
        );

    }


    // ==========================================
    // UPDATE RESULT PRODUCT
    // ==========================================

    function updateResultProduct() {

        if (!selectedProduct) {
            return;
        }


        if (resultProductImage) {

            resultProductImage.src =
                selectedProduct.image;

        }


        if (resultProductName) {

            resultProductName.textContent =
                selectedProduct.name;

        }


        if (resultProductBrand) {

            resultProductBrand.textContent =
                selectedProduct.brand;

        }


        if (resultProductPrice) {

            resultProductPrice.textContent =
                formatPrice(
                    selectedProduct.price
                );

        }

    }


    // ==========================================
    // CLEAR PREVIEW
    // ==========================================

    if (clearPreviewButton) {

        clearPreviewButton.addEventListener(
            "click",
            resetTryOn
        );

    }


    function resetTryOn() {

        uploadedImage =
            null;


        selectedProduct =
            null;


        isProcessing =
            false;


        if (imageObjectURL) {

            URL.revokeObjectURL(
                imageObjectURL
            );

            imageObjectURL =
                null;

        }


        resetFileInput();


        if (uploadPlaceholder) {

            uploadPlaceholder.style.display =
                "block";

        }


        if (uploadedPreview) {

            uploadedPreview.style.display =
                "none";

        }


        if (userPhoto) {

            userPhoto.removeAttribute(
                "src"
            );

        }


        if (beforeImage) {

            beforeImage.removeAttribute(
                "src"
            );

        }


        if (afterImage) {

            afterImage.removeAttribute(
                "src"
            );

        }


        if (resultSection) {

            resultSection.style.display =
                "none";

        }


        if (processingState) {

            processingState.style.display =
                "none";

        }


        if (tryonMessage) {

            tryonMessage.textContent =
                "";

        }


        document
            .querySelectorAll(
                ".shoe-option"
            )
            .forEach(function (option) {

                option.classList.remove(
                    "active"
                );

            });


        if (tryonButton) {

            tryonButton.disabled =
                true;

        }


        showMessage(
            "Preview cleared."
        );

    }


    // ==========================================
    // RESET FILE INPUT
    // ==========================================

    function resetFileInput() {

        if (photoInput) {

            photoInput.value =
                "";

        }

    }


    // ==========================================
    // WISHLIST
    // ==========================================

    if (wishlistButton) {

        wishlistButton.addEventListener(
            "click",
            function () {

                if (!selectedProduct) {

                    showMessage(
                        "Select a shoe first."
                    );

                    return;

                }


                const key =
                    "soleaiWishlist";


                let wishlist = [];


                try {

                    wishlist =
                        JSON.parse(
                            localStorage.getItem(
                                key
                            )
                        ) || [];

                } catch (error) {

                    wishlist = [];

                }


                const exists =
                    wishlist.some(
                        function (item) {

                            return item.id ===
                                selectedProduct.id;

                        }
                    );


                if (!exists) {

                    wishlist.push(
                        selectedProduct
                    );


                    localStorage.setItem(
                        key,
                        JSON.stringify(
                            wishlist
                        )
                    );


                    wishlistButton.classList.add(
                        "active"
                    );


                    wishlistButton.innerHTML =
                        '<i class="bi bi-heart-fill"></i>';


                    showMessage(
                        "Added to wishlist."
                    );

                } else {

                    showMessage(
                        "Already in your wishlist."
                    );

                }

            }
        );

    }


    // ==========================================
    // ADD TO CART
    // ==========================================

    if (addCartButton) {

        addCartButton.addEventListener(
            "click",
            function () {

                if (!selectedProduct) {

                    showMessage(
                        "Please select a shoe first."
                    );

                    return;

                }


                addToCart(
                    selectedProduct
                );

            }
        );

    }


    function addToCart(product) {

        const key =
            "soleaiCart";


        let cart = [];


        try {

            cart =
                JSON.parse(
                    localStorage.getItem(
                        key
                    )
                ) || [];

        } catch (error) {

            cart = [];

        }


        const existing =
            cart.find(
                function (item) {

                    return item.id ===
                        product.id;

                }
            );


        if (existing) {

            existing.quantity =
                Number(
                    existing.quantity || 1
                ) + 1;

        } else {

            cart.push({

                id: product.id,

                name: product.name,

                brand: product.brand,

                price: product.price,

                image: product.image,

                quantity: 1

            });

        }


        localStorage.setItem(
            key,
            JSON.stringify(cart)
        );


        addCartButton.classList.add(
            "added"
        );


        addCartButton.innerHTML = `

            Added to Cart

            <i class="bi bi-check-lg"></i>

        `;


        showMessage(
            product.name +
            " added to cart."
        );


        setTimeout(
            function () {

                if (!addCartButton) {
                    return;
                }


                addCartButton.classList.remove(
                    "added"
                );


                addCartButton.innerHTML = `

                    Add to Cart

                    <i class="bi bi-bag"></i>

                `;

            },
            1800
        );

    }


    // ==========================================
    // MESSAGE
    // ==========================================

    function showMessage(message) {

        if (!tryonMessage) {
            return;
        }


        tryonMessage.textContent =
            message;


        tryonMessage.style.opacity =
            "1";


        clearTimeout(
            showMessage.timer
        );


        showMessage.timer =
            setTimeout(
                function () {

                    if (tryonMessage) {

                        tryonMessage.style.opacity =
                            "0";

                    }

                },
                3000
            );

    }


    // ==========================================
    // BACK TO TOP
    // ==========================================

    if (backToTop) {

        window.addEventListener(
            "scroll",
            function () {

                if (
                    window.scrollY >
                    500
                ) {

                    backToTop.classList.add(
                        "show"
                    );

                } else {

                    backToTop.classList.remove(
                        "show"
                    );

                }

            }
        );


        backToTop.addEventListener(
            "click",
            function () {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    // ==========================================
    // UPLOAD AREA CLICK
    // ==========================================

    if (uploadArea && photoInput) {

        uploadArea.addEventListener(
            "dragover",
            function (event) {

                event.preventDefault();

                uploadArea.classList.add(
                    "dragging"
                );

            }
        );


        uploadArea.addEventListener(
            "dragleave",
            function () {

                uploadArea.classList.remove(
                    "dragging"
                );

            }
        );


        uploadArea.addEventListener(
            "drop",
            function (event) {

                event.preventDefault();


                uploadArea.classList.remove(
                    "dragging"
                );


                const file =
                    event.dataTransfer.files &&
                    event.dataTransfer.files[0];


                if (file) {

                    handlePhoto(file);

                }

            }
        );

    }


    // ==========================================
    // ESCAPE ATTRIBUTE
    // ==========================================

    function escapeAttribute(value) {

        return String(
            value || ""
        )
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    }


    // ==========================================
    // INITIALIZE PAGE
    // ==========================================

    renderShoes();

    updateTryOnButton();

});