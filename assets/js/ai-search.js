"use strict";

document.addEventListener("DOMContentLoaded", () => {
    SoleAISearch.init();
});


const SoleAISearch = {

    products: [],

    state: {
        query: "",
        activity: "all",
        price: "all",
        comfortable: false,
        lightweight: false,
        trending: false
    },


    // ==========================================
    // INITIALIZE
    // ==========================================

    init() {

        this.loadProducts();

        this.createAIResponseArea();

        this.bindSearch();

        this.bindExampleSearches();

        this.bindFilters();

        this.bindSorting();

        this.bindReset();

        this.bindVoiceSearch();

        this.renderProducts(this.products);

    },


    // ==========================================
    // LOAD PRODUCTS
    // ==========================================

    loadProducts() {

        let data = [];

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

        else {
            data = this.fallbackProducts();
        }


        this.products = data.map(product => {

            return {

                ...product,

                _name: this.getName(product),

                _brand: this.getBrand(product),

                _price: this.getPrice(product),

                _rating: this.getRating(product),

                _text: this.getSearchText(product),

                _image: this.getImage(product)

            };

        });

    },


    // ==========================================
    // PRODUCT HELPERS
    // ==========================================

    getName(product) {

        return (
            product.name ||
            product.title ||
            product.productName ||
            "SoleAI Footwear"
        );

    },


    getBrand(product) {

        return (
            product.brand ||
            product.company ||
            "SoleAI"
        );

    },


    getPrice(product) {

        const price =
            product.price ??
            product.currentPrice ??
            product.salePrice ??
            0;

        return Number(
            String(price)
                .replace(/[₹,\s]/g, "")
        ) || 0;

    },


    getRating(product) {

        return Number(
            product.rating ??
            product.reviewsRating ??
            product.score ??
            4.5
        ) || 4.5;

    },


    getImage(product) {

        if (product.image) {
            return product.image;
        }

        if (
            Array.isArray(product.images) &&
            product.images.length > 0
        ) {
            return product.images[0];
        }

        if (product.thumbnail) {
            return product.thumbnail;
        }

        return "./assets/images/products/placeholder.jpg";

    },


    getSearchText(product) {

        const values = [

            product.name,
            product.title,
            product.productName,

            product.brand,
            product.company,

            product.category,

            product.description,

            product.activity,
            product.activities,

            product.features,

            product.style,

            product.color,
            product.colors,

            product.type,

            product.use,

            product.bestFor,

            product.tags

        ];


        return values
            .flat(Infinity)
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

    },


    // ==========================================
    // SEARCH
    // ==========================================

    bindSearch() {

        const input =
            document.getElementById(
                "smart-search-input"
            );

        const button =
            document.getElementById(
                "smart-search-btn"
            );


        if (button) {

            button.addEventListener(
                "click",
                () => this.askAI()
            );

        }


        if (input) {

            input.addEventListener(
                "keydown",
                event => {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        this.askAI();

                    }

                }
            );

        }

    },


    // ==========================================
    // MAIN SEARCH
    // ==========================================

    askAI() {

        const input =
            document.getElementById(
                "smart-search-input"
            );


        if (!input) {
            return;
        }


        const query =
            input.value.trim();


        if (!query) {

            this.showAIResponse(
                "What are you looking for?",
                "Try something like \"comfortable running shoes under ₹5000\"."
            );

            this.renderProducts(
                this.products
            );

            return;

        }


        this.state.query = query;

        this.showThinking();


        setTimeout(() => {

            const result =
                this.processQuery(query);


            this.showAIResponse(
                result.title,
                result.message,
                result.products
            );


            this.renderProducts(
                result.products
            );


            this.scrollToResults();

        }, 300);

    },


    // ==========================================
    // PROCESS QUERY
    // ==========================================

    processQuery(query) {

        const q =
            query.toLowerCase();


        const budget =
            this.extractBudget(q);


        const running =
            this.hasAny(q, [
                "running",
                "run",
                "jogging",
                "jog"
            ]);


        const walking =
            this.hasAny(q, [
                "walking",
                "walk"
            ]);


        const casual =
            this.hasAny(q, [
                "casual",
                "college",
                "everyday",
                "daily",
                "lifestyle"
            ]);


        const comfort =
            this.hasAny(q, [
                "comfortable",
                "comfort",
                "cushion",
                "cushioned",
                "soft"
            ]);


        const lightweight =
            this.hasAny(q, [
                "lightweight",
                "light weight"
            ]);


        const best =
            this.hasAny(q, [
                "best",
                "recommend",
                "suggest",
                "good"
            ]);


        const cheap =
            this.hasAny(q, [
                "cheap",
                "cheapest",
                "affordable",
                "budget"
            ]);


        const nike =
            q.includes("nike");


        const adidas =
            q.includes("adidas");


        const puma =
            q.includes("puma");


        const compare =
            this.hasAny(q, [
                "compare",
                "comparison",
                "versus",
                "vs"
            ]);


        const scored =
            this.products.map(product => {

                let score = 0;

                const text =
                    product._text;


                const words =
                    q
                        .replace(/[₹,]/g, "")
                        .split(/\s+/)
                        .filter(
                            word =>
                                word.length > 2
                        );


                words.forEach(word => {

                    if (text.includes(word)) {
                        score += 8;
                    }

                });


                if (running) {

                    if (
                        text.includes("running") ||
                        text.includes("run")
                    ) {
                        score += 35;
                    }

                }


                if (walking) {

                    if (
                        text.includes("walking") ||
                        text.includes("walk")
                    ) {
                        score += 35;
                    }

                }


                if (casual) {

                    if (
                        text.includes("casual") ||
                        text.includes("lifestyle") ||
                        text.includes("everyday")
                    ) {
                        score += 30;
                    }

                }


                if (comfort) {

                    if (
                        text.includes("comfort") ||
                        text.includes("cushion") ||
                        text.includes("soft")
                    ) {
                        score += 30;
                    }

                }


                if (lightweight) {

                    if (
                        text.includes("lightweight") ||
                        text.includes("light")
                    ) {
                        score += 30;
                    }

                }


                if (
                    nike &&
                    product._brand
                        .toLowerCase()
                        .includes("nike")
                ) {
                    score += 40;
                }


                if (
                    adidas &&
                    product._brand
                        .toLowerCase()
                        .includes("adidas")
                ) {
                    score += 40;
                }


                if (
                    puma &&
                    product._brand
                        .toLowerCase()
                        .includes("puma")
                ) {
                    score += 40;
                }


                if (budget !== null) {

                    if (
                        product._price <= budget
                    ) {
                        score += 45;
                    } else {
                        score -= 25;
                    }

                }


                score +=
                    product._rating * 2;


                return {
                    product,
                    score
                };

            });


        let results =
            scored
                .filter(item => {

                    if (budget !== null) {

                        return (
                            item.product._price <=
                            budget
                        );

                    }

                    return item.score > 0;

                })
                .sort(
                    (a, b) =>
                        b.score - a.score
                )
                .map(
                    item =>
                        item.product
                );


        if (!results.length) {

            results =
                scored
                    .sort(
                        (a, b) =>
                            b.score - a.score
                    )
                    .slice(0, 6)
                    .map(
                        item =>
                            item.product
                    );

        }


        if (cheap) {

            results.sort(
                (a, b) =>
                    a._price - b._price
            );

        }


        if (best) {

            results.sort(
                (a, b) =>
                    b._rating - a._rating
            );

        }


        if (compare) {

            return this.buildComparison(
                results
            );

        }


        return this.buildRecommendationResponse(
            results,
            {
                budget,
                running,
                walking,
                casual,
                comfort,
                lightweight
            }
        );

    },


    // ==========================================
    // RECOMMENDATION
    // ==========================================

    buildRecommendationResponse(
        results,
        intent
    ) {

        const top =
            results[0];


        if (!top) {

            return {

                title:
                    "No matching shoes found.",

                message:
                    "Try changing your activity, style or budget.",

                products: []

            };

        }


        let reason =
            "Based on your request";


        if (intent.running) {

            reason =
                "For running";

        }

        else if (intent.walking) {

            reason =
                "For walking";

        }

        else if (intent.casual) {

            reason =
                "For everyday and casual use";

        }

        else if (intent.comfort) {

            reason =
                "For comfort and cushioning";

        }

        else if (intent.lightweight) {

            reason =
                "For lightweight footwear";

        }


        if (intent.budget !== null) {

            reason +=
                ` under ₹${intent.budget.toLocaleString("en-IN")}`;

        }


        return {

            title:
                `I found ${results.length} good match${results.length === 1 ? "" : "es"} for you.`,

            message:
                `${reason}, I'd recommend ${top._name}. ` +
                `It is rated ${top._rating.toFixed(1)}/5 ` +
                `and costs ₹${top._price.toLocaleString("en-IN")}.`,

            products:
                results.slice(0, 6)

        };

    },


    // ==========================================
    // COMPARISON
    // ==========================================

    buildComparison(products) {

        if (products.length < 2) {

            return {

                title:
                    "I need two products to compare.",

                message:
                    "Try \"Compare Nike and Adidas shoes\".",

                products

            };

        }


        const first =
            products[0];

        const second =
            products[1];


        const betterRated =
            first._rating >= second._rating
                ? first
                : second;


        const cheaper =
            first._price <= second._price
                ? first
                : second;


        return {

            title:
                `${first._name} vs ${second._name}`,

            message:
                `${first._name} costs ₹${first._price.toLocaleString("en-IN")} ` +
                `with a ${first._rating.toFixed(1)}/5 rating. ` +
                `${second._name} costs ₹${second._price.toLocaleString("en-IN")} ` +
                `with a ${second._rating.toFixed(1)}/5 rating. ` +
                `${betterRated._name} has the higher rating, while ` +
                `${cheaper._name} is more affordable.`,

            products:
                products.slice(0, 4)

        };

    },


    // ==========================================
    // RESPONSE AREA
    // ==========================================

    createAIResponseArea() {

        const results =
            document.querySelector(
                ".search-results"
            );


        if (!results) {
            return;
        }


        if (
            document.getElementById(
                "soleai-response"
            )
        ) {
            return;
        }


        const box =
            document.createElement("div");


        box.id =
            "soleai-response";

        box.className =
            "soleai-response";


        box.innerHTML = `

            <div class="soleai-response-header">

                <div class="soleai-response-icon">
                    <i class="bi bi-stars"></i>
                </div>

                <div>
                    <strong>SoleAI</strong>
                    <span>AI Footwear Expert</span>
                </div>

            </div>


            <div
                class="soleai-response-content"
                id="soleai-response-content"
            >

                <h3>
                    What can I help you find?
                </h3>

                <p>
                    Tell me your activity,
                    style, comfort preference
                    or budget.
                </p>

            </div>

        `;


        const insight =
            document.getElementById(
                "ai-search-insight"
            );


        if (insight) {
            insight.style.display = "none";
        }


        results.prepend(box);

    },


    // ==========================================
    // SHOW RESPONSE
    // ==========================================

    showAIResponse(
        title,
        message,
        products = []
    ) {

        const content =
            document.getElementById(
                "soleai-response-content"
            );


        if (!content) {
            return;
        }


        content.innerHTML = `

            <h3>
                ${this.escapeHTML(title)}
            </h3>

            <p>
                ${this.escapeHTML(message)}
            </p>

        `;


        const resultTitle =
            document.getElementById(
                "results-title"
            );


        if (resultTitle) {

            resultTitle.textContent =
                products.length
                    ? "Recommended matches"
                    : "Search results";

        }


        const count =
            document.getElementById(
                "result-count"
            );


        if (count) {

            count.textContent =
                `${products.length} product${
                    products.length === 1
                        ? ""
                        : "s"
                }`;

        }

    },


    // ==========================================
    // THINKING
    // ==========================================

    showThinking() {

        const content =
            document.getElementById(
                "soleai-response-content"
            );


        if (!content) {
            return;
        }


        content.innerHTML = `

            <div class="soleai-thinking">

                <span></span>
                <span></span>
                <span></span>

                <strong>
                    SoleAI is thinking...
                </strong>

            </div>

        `;

    },


    // ==========================================
    // RENDER PRODUCTS
    // ==========================================

    renderProducts(products) {

        const container =
            document.getElementById(
                "search-products"
            );


        const empty =
            document.getElementById(
                "search-empty"
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        if (!products.length) {

            if (empty) {
                empty.style.display = "block";
            }

            return;
        }


        if (empty) {
            empty.style.display = "none";
        }


        products
            .slice(0, 6)
            .forEach(product => {

                container.appendChild(
                    this.createProductCard(product)
                );

            });

    },


    // ==========================================
    // PRODUCT CARD
    // ==========================================

    createProductCard(product) {

        const card =
            document.createElement("a");


        const id =
            product.id ||
            product.slug ||
            product._name;


        card.href =
            `product.html?id=${encodeURIComponent(id)}`;


        card.className =
            "ai-search-product-card";


        card.innerHTML = `

            <div class="ai-product-image">

                <img
                    src="${this.escapeAttribute(product._image)}"
                    alt="${this.escapeAttribute(product._name)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='./assets/images/products/placeholder.jpg';"
                >

                <span class="ai-product-ai-badge">

                    <i class="bi bi-stars"></i>

                    AI MATCH

                </span>

            </div>


            <div class="ai-product-details">

                <div class="ai-product-brand">
                    ${this.escapeHTML(product._brand)}
                </div>


                <h4 class="ai-product-name">
                    ${this.escapeHTML(product._name)}
                </h4>


                <div class="ai-product-bottom">

                    <strong class="ai-product-price">
                        ₹${product._price.toLocaleString("en-IN")}
                    </strong>


                    <span class="ai-product-rating">

                        <i class="bi bi-star-fill"></i>

                        ${product._rating.toFixed(1)}

                    </span>

                </div>

            </div>

        `;


        return card;

    },


    // ==========================================
    // EXAMPLE SEARCHES
    // ==========================================

    bindExampleSearches() {

        document
            .querySelectorAll("[data-search]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const input =
                            document.getElementById(
                                "smart-search-input"
                            );


                        if (!input) {
                            return;
                        }


                        input.value =
                            button.dataset.search;


                        this.askAI();

                    }
                );

            });

    },


    // ==========================================
    // FILTERS
    // ==========================================

    bindFilters() {

        document
            .querySelectorAll(".filter-option")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".filter-option"
                            )
                            .forEach(item =>
                                item.classList.remove(
                                    "active"
                                )
                            );


                        button.classList.add(
                            "active"
                        );


                        this.state.activity =
                            button.dataset.value ||
                            "all";


                        this.applyCurrentFilters();

                    }
                );

            });


        document
            .querySelectorAll(".price-option")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".price-option"
                            )
                            .forEach(item =>
                                item.classList.remove(
                                    "active"
                                )
                            );


                        button.classList.add(
                            "active"
                        );


                        this.state.price =
                            button.dataset.price ||
                            "all";


                        this.applyCurrentFilters();

                    }
                );

            });


        const comfort =
            document.getElementById(
                "comfortable-filter"
            );

        const lightweight =
            document.getElementById(
                "lightweight-filter"
            );

        const trending =
            document.getElementById(
                "trending-filter"
            );


        if (comfort) {

            comfort.addEventListener(
                "change",
                () => {

                    this.state.comfortable =
                        comfort.checked;

                    this.applyCurrentFilters();

                }
            );

        }


        if (lightweight) {

            lightweight.addEventListener(
                "change",
                () => {

                    this.state.lightweight =
                        lightweight.checked;

                    this.applyCurrentFilters();

                }
            );

        }


        if (trending) {

            trending.addEventListener(
                "change",
                () => {

                    this.state.trending =
                        trending.checked;

                    this.applyCurrentFilters();

                }
            );

        }

    },


    // ==========================================
    // FILTER PRODUCTS
    // ==========================================

    applyCurrentFilters() {

        let results =
            [...this.products];


        if (
            this.state.activity !== "all"
        ) {

            results =
                results.filter(product =>
                    product._text.includes(
                        this.state.activity
                    )
                );

        }


        if (
            this.state.price !== "all"
        ) {

            results =
                results.filter(product =>
                    product._price <=
                    Number(this.state.price)
                );

        }


        if (this.state.comfortable) {

            results =
                results.filter(product =>
                    /comfort|cushion|soft/
                        .test(product._text)
                );

        }


        if (this.state.lightweight) {

            results =
                results.filter(product =>
                    /lightweight|light/
                        .test(product._text)
                );

        }


        if (this.state.trending) {

            results =
                results.filter(product =>
                    product.trending === true ||
                    product._text.includes("trending")
                );

        }


        this.renderProducts(results);

    },


    // ==========================================
    // SORT
    // ==========================================

    bindSorting() {

        const select =
            document.getElementById(
                "sort-products"
            );


        if (!select) {
            return;
        }


        select.addEventListener(
            "change",
            () => {

                const results =
                    [...this.products];


                if (
                    select.value ===
                    "price-low"
                ) {

                    results.sort(
                        (a, b) =>
                            a._price - b._price
                    );

                }

                else if (
                    select.value ===
                    "price-high"
                ) {

                    results.sort(
                        (a, b) =>
                            b._price - a._price
                    );

                }

                else if (
                    select.value ===
                    "rating"
                ) {

                    results.sort(
                        (a, b) =>
                            b._rating - a._rating
                    );

                }


                this.renderProducts(results);

            }
        );

    },


    // ==========================================
    // RESET
    // ==========================================

    bindReset() {

        const clear =
            document.getElementById(
                "clear-filters"
            );

        const reset =
            document.getElementById(
                "reset-search"
            );


        if (clear) {

            clear.addEventListener(
                "click",
                () => this.reset()
            );

        }


        if (reset) {

            reset.addEventListener(
                "click",
                () => this.reset()
            );

        }

    },


    reset() {

        const input =
            document.getElementById(
                "smart-search-input"
            );


        if (input) {
            input.value = "";
        }


        this.state = {

            query: "",

            activity: "all",

            price: "all",

            comfortable: false,

            lightweight: false,

            trending: false

        };


        document
            .querySelectorAll(".filter-option")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.value === "all"
                );

            });


        document
            .querySelectorAll(".price-option")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.price === "all"
                );

            });


        document
            .querySelectorAll(
                ".checkbox-filter input"
            )
            .forEach(input => {

                input.checked = false;

            });


        this.showAIResponse(
            "Welcome back to SoleAI 👟",
            "Tell me what kind of shoes you're looking for and I'll help you find the right pair.",
            this.products
        );


        this.renderProducts(
            this.products
        );

    },


    // ==========================================
    // VOICE SEARCH
    // ==========================================

    bindVoiceSearch() {

        const button =
            document.getElementById(
                "voice-search-btn"
            );

        const input =
            document.getElementById(
                "smart-search-input"
            );


        if (!button || !input) {
            return;
        }


        const Recognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!Recognition) {

            button.title =
                "Voice search is not supported.";

            return;

        }


        const recognition =
            new Recognition();


        recognition.lang =
            "en-IN";

        recognition.continuous =
            false;

        recognition.interimResults =
            false;


        button.addEventListener(
            "click",
            () => {

                try {

                    recognition.start();

                    button.classList.add(
                        "active"
                    );

                } catch (error) {

                    // Recognition may already be running.

                }

            }
        );


        recognition.onresult =
            event => {

                input.value =
                    event.results[0][0].transcript;

                button.classList.remove(
                    "active"
                );

                this.askAI();

            };


        recognition.onend =
            () => {

                button.classList.remove(
                    "active"
                );

            };


        recognition.onerror =
            () => {

                button.classList.remove(
                    "active"
                );

            };

    },


    // ==========================================
    // BUDGET
    // ==========================================

    extractBudget(query) {

        const patterns = [

            /under\s*₹?\s*([\d,]+)/i,

            /below\s*₹?\s*([\d,]+)/i,

            /less\s*than\s*₹?\s*([\d,]+)/i,

            /within\s*₹?\s*([\d,]+)/i,

            /budget\s*(?:of)?\s*₹?\s*([\d,]+)/i,

            /₹\s*([\d,]+)/i

        ];


        for (
            const pattern of patterns
        ) {

            const match =
                query.match(pattern);


            if (match) {

                return Number(
                    match[1].replace(
                        /,/g,
                        ""
                    )
                );

            }

        }


        return null;

    },


    // ==========================================
    // SCROLL
    // ==========================================

    scrollToResults() {

        const section =
            document.querySelector(
                ".search-experience"
            );


        if (!section) {
            return;
        }


        setTimeout(() => {

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    },


    // ==========================================
    // UTILITY
    // ==========================================

    hasAny(text, words) {

        return words.some(
            word =>
                text.includes(word)
        );

    },


    escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;

    },


    escapeAttribute(value) {

        return this.escapeHTML(
            value
        )
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    },


    // ==========================================
    // FALLBACK PRODUCTS
    // ==========================================

    fallbackProducts() {

        return [

            {
                id: "nike-pegasus-41",
                name: "Nike Air Zoom Pegasus 41",
                brand: "Nike",
                price: 6999,
                rating: 4.8,
                image:
                    "./assets/images/products/download3.png",
                category: "Running",
                tags: [
                    "Running",
                    "Everyday",
                    "Trending"
                ]
            },


            {
                id: "adidas-adizero-sl",
                name: "Adidas Adizero SL",
                brand: "Adidas",
                price: 6499,
                rating: 4.7,
                image:
                    "./assets/images/products/download1.png",
                category: "Running",
                tags: [
                    "Running",
                    "Lightweight",
                    "Performance"
                ]
            },


            {
                id: "puma-future-rider",
                name: "Puma Future Rider",
                brand: "Puma",
                price: 4999,
                rating: 4.6,
                image:
                    "./assets/images/products/download5.png",
                category: "Lifestyle",
                tags: [
                    "Lifestyle",
                    "Casual",
                    "Trending"
                ]
            },


            {
                id: "new-balance-1080",
                name: "New Balance Fresh Foam 1080",
                brand: "New Balance",
                price: 7999,
                rating: 4.9,
                image:
                    "./assets/images/products/download2.png",
                category: "Running",
                tags: [
                    "Running",
                    "Comfort",
                    "Premium"
                ]
            },


            {
                id: "nike-revolution-7",
                name: "Nike Revolution 7",
                brand: "Nike",
                price: 4299,
                rating: 4.5,
                image:
                    "./assets/images/products/download4.png",
                category: "Running",
                tags: [
                    "Running",
                    "Everyday",
                    "Value"
                ]
            },


            {
                id: "adidas-runfalcon",
                name: "Adidas Runfalcon 5",
                brand: "Adidas",
                price: 3899,
                rating: 4.5,
                image:
                    "./assets/images/products/download2.png",
                category: "Running",
                tags: [
                    "Running",
                    "Everyday",
                    "Value"
                ]
            }

        ];

    }

};