"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const chatMessages =
        document.getElementById("chat-messages");

    const chatForm =
        document.getElementById("chat-form");

    const chatInput =
        document.getElementById("chat-input");

    const typingIndicator =
        document.getElementById("typing-indicator");

    const loginButton =
        document.getElementById("login-button");


    // ==========================================
    // INITIALIZE
    // ==========================================

    setupChat();
    setupQuickQuestions();
    setupSidebarTools();
    setupNewChat();
    setupClearChat();
    setupTextarea();
    setupVoiceInput();


    // ==========================================
    // CHAT
    // ==========================================

    function setupChat() {

        if (!chatForm || !chatInput) {
            console.error(
                "AI Assistant: chat form or input not found."
            );
            return;
        }


        chatForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const message =
                    chatInput.value.trim();

                if (!message) {
                    return;
                }

                sendUserMessage(message);

            }
        );

    }


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    function sendUserMessage(message) {

        addUserMessage(message);

        chatInput.value = "";

        autoResizeTextarea();

        showTyping();


        setTimeout(() => {

            hideTyping();

            const response =
                generateAssistantResponse(message);

            addAssistantMessage(response);

        }, 700);

    }


    // ==========================================
    // USER MESSAGE
    // ==========================================

    function addUserMessage(message) {

        if (!chatMessages) {
            return;
        }


        const row =
            document.createElement("div");

        row.className =
            "message-row user-message-row";


        row.innerHTML = `

            <div class="message-content">

                <div class="message-bubble">
                    ${escapeHTML(message)}
                </div>

                <span class="message-time">
                    Just now
                </span>

            </div>

            <div class="message-avatar">
                <i class="bi bi-person"></i>
            </div>

        `;


        chatMessages.appendChild(row);

        scrollToBottom();

    }


    // ==========================================
    // AI MESSAGE
    // ==========================================

    function addAssistantMessage(response) {

        if (!chatMessages) {
            return;
        }


        const row =
            document.createElement("div");

        row.className =
            "message-row";


        row.innerHTML = `

            <div class="message-avatar">

                <i class="bi bi-stars"></i>

            </div>

            <div class="message-content">

                <div class="message-bubble">

                    ${response}

                </div>

                <span class="message-time">
                    Just now
                </span>

            </div>

        `;


        chatMessages.appendChild(row);

        scrollToBottom();

    }


    // ==========================================
    // AI RESPONSE
    // ==========================================

    function generateAssistantResponse(message) {

        const text =
            message.toLowerCase();


        // RUNNING

        if (
            text.includes("running") ||
            text.includes("run")
        ) {

            return `

                <p>
                    Absolutely 👟
                    For running, I'd focus on
                    <strong>
                        cushioning, stability and weight
                    </strong>.
                </p>

                <div class="ai-product-recommendations">

                    <a
                        href="product.html?id=nike-pegasus-41"
                        class="ai-product-mini-card"
                    >

                        <div class="ai-product-mini-info">

                            <span>
                                Best Match
                            </span>

                            <strong>
                                Nike Air Zoom Pegasus 41
                            </strong>

                            <small>
                                ₹6,999 · Running · 4.8 ★
                            </small>

                        </div>

                        <i class="bi bi-arrow-up-right"></i>

                    </a>


                    <a
                        href="product.html?id=nike-revolution-7"
                        class="ai-product-mini-card"
                    >

                        <div class="ai-product-mini-info">

                            <span>
                                Budget Pick
                            </span>

                            <strong>
                                Nike Revolution 7
                            </strong>

                            <small>
                                ₹4,299 · Running · 4.6 ★
                            </small>

                        </div>

                        <i class="bi bi-arrow-up-right"></i>

                    </a>

                </div>

                <p>
                    Tell me your usual running distance
                    and budget and I can narrow it down.
                </p>

            `;

        }


        // BUDGET

        if (
            text.includes("5000") ||
            text.includes("budget") ||
            text.includes("cheap") ||
            text.includes("affordable")
        ) {

            return `

                <p>
                    Here are some
                    <strong>budget-friendly</strong>
                    SoleAI picks:
                </p>

                <div class="ai-product-recommendations">

                    <a
                        href="product.html?id=nike-revolution-7"
                        class="ai-product-mini-card"
                    >

                        <div class="ai-product-mini-info">

                            <span>
                                Best Value
                            </span>

                            <strong>
                                Nike Revolution 7
                            </strong>

                            <small>
                                ₹4,299 · Running
                            </small>

                        </div>

                        <i class="bi bi-arrow-up-right"></i>

                    </a>


                    <a
                        href="product.html?id=adidas-runfalcon"
                        class="ai-product-mini-card"
                    >

                        <div class="ai-product-mini-info">

                            <span>
                                Budget Pick
                            </span>

                            <strong>
                                Adidas Runfalcon 5
                            </strong>

                            <small>
                                ₹3,899 · Daily Use
                            </small>

                        </div>

                        <i class="bi bi-arrow-up-right"></i>

                    </a>

                </div>

            `;

        }


        // COMFORT

        if (
            text.includes("comfortable") ||
            text.includes("comfort")
        ) {

            return `

                <p>
                    For everyday comfort, I recommend
                    focusing on
                    <strong>
                        cushioning and support
                    </strong>.
                </p>

                <div class="ai-product-recommendations">

                    <a
                        href="product.html?id=new-balance-1080"
                        class="ai-product-mini-card"
                    >

                        <div class="ai-product-mini-info">

                            <span>
                                Comfort Pick
                            </span>

                            <strong>
                                New Balance Fresh Foam 1080
                            </strong>

                            <small>
                                ₹7,999 · Premium cushioning
                            </small>

                        </div>

                        <i class="bi bi-arrow-up-right"></i>

                    </a>

                </div>

            `;

        }


        // SIZE

        if (
            text.includes("size") ||
            text.includes("fit")
        ) {

            return `

                <p>
                    I can help you find the right size. 👟
                </p>

                <p>
                    Tell me your usual shoe size,
                    foot length and preferred fit.
                </p>

            `;

        }


        // COMPARE

        if (
            text.includes("compare") ||
            text.includes("comparison")
        ) {

            return `

                <p>
                    Absolutely. I can compare shoes based on:
                </p>

                <p>
                    <strong>
                        Price · Comfort · Performance · Style · Value
                    </strong>
                </p>

                <p>
                    Tell me the two shoes you'd like to compare.
                </p>

            `;

        }


        // WATERPROOF

        if (
            text.includes("waterproof") ||
            text.includes("rain")
        ) {

            return `

                <p>
                    Waterproofing depends on the specific
                    shoe model.
                </p>

                <p>
                    Tell me the shoe name and I'll help
                    you evaluate it for wet conditions.
                </p>

            `;

        }


        // DEFAULT

        return `

            <p>
                I'd be happy to help you find the
                right pair. 👟
            </p>

            <p>
                Tell me your
                <strong>
                    activity, budget, style
                    or comfort requirements
                </strong>.
            </p>

            <p>
                Example:
                <strong>
                    "I need running shoes under ₹5000."
                </strong>
            </p>

        `;

    }


    // ==========================================
    // QUICK QUESTIONS
    // ==========================================

    function setupQuickQuestions() {

        const buttons =
            document.querySelectorAll(
                "[data-question]"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const question =
                        button.dataset.question;

                    if (!question || !chatInput) {
                        return;
                    }

                    chatInput.value =
                        question;

                    autoResizeTextarea();

                    chatInput.focus();

                }
            );

        });

    }


    // ==========================================
    // SIDEBAR TOOLS
    // ==========================================

    function setupSidebarTools() {

        const buttons =
            document.querySelectorAll(
                ".ai-tool-btn[data-question]"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const question =
                        button.dataset.question;

                    if (!question || !chatInput) {
                        return;
                    }

                    chatInput.value =
                        question;

                    autoResizeTextarea();

                    chatInput.focus();

                }
            );

        });

    }


    // ==========================================
    // NEW CHAT
    // ==========================================

    function setupNewChat() {

        const button =
            document.getElementById(
                "new-chat-btn"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            () => {

                if (!chatMessages) {
                    return;
                }


                chatMessages.innerHTML = `

                    <div class="chat-date">
                        TODAY
                    </div>

                    <div class="message-row">

                        <div class="message-avatar">
                            <i class="bi bi-stars"></i>
                        </div>

                        <div class="message-content">

                            <div class="message-bubble">

                                <p>
                                    Welcome back! 👋
                                </p>

                                <p>
                                    What kind of footwear
                                    are you looking for today?
                                </p>

                            </div>

                            <span class="message-time">
                                Just now
                            </span>

                        </div>

                    </div>

                `;


                if (chatInput) {

                    chatInput.value = "";

                    autoResizeTextarea();

                    chatInput.focus();

                }

            }
        );

    }


    // ==========================================
    // CLEAR CHAT
    // ==========================================

    function setupClearChat() {

        const button =
            document.getElementById(
                "clear-chat-btn"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            () => {

                if (!chatMessages) {
                    return;
                }


                chatMessages.innerHTML = `

                    <div class="chat-date">
                        TODAY
                    </div>

                    <div class="message-row">

                        <div class="message-avatar">
                            <i class="bi bi-stars"></i>
                        </div>

                        <div class="message-content">

                            <div class="message-bubble">

                                <p>
                                    Conversation cleared.
                                </p>

                                <p>
                                    What can I help you find? 👟
                                </p>

                            </div>

                            <span class="message-time">
                                Just now
                            </span>

                        </div>

                    </div>

                `;

            }
        );

    }


    // ==========================================
    // TEXTAREA
    // ==========================================

    function setupTextarea() {

        if (!chatInput) {
            return;
        }


        chatInput.addEventListener(
            "input",
            autoResizeTextarea
        );


        chatInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    if (chatForm) {

                        chatForm.requestSubmit();

                    }

                }

            }
        );

    }


    // ==========================================
    // AUTO RESIZE
    // ==========================================

    function autoResizeTextarea() {

        if (!chatInput) {
            return;
        }


        chatInput.style.height =
            "auto";


        chatInput.style.height =
            Math.min(
                chatInput.scrollHeight,
                130
            ) + "px";

    }


    // ==========================================
    // TYPING
    // ==========================================

    function showTyping() {

        if (!typingIndicator) {
            return;
        }

        typingIndicator.classList.add(
            "active"
        );

        scrollToBottom();

    }


    function hideTyping() {

        if (!typingIndicator) {
            return;
        }

        typingIndicator.classList.remove(
            "active"
        );

    }


    // ==========================================
    // SCROLL
    // ==========================================

    function scrollToBottom() {

        if (!chatMessages) {
            return;
        }


        requestAnimationFrame(() => {

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

        });

    }


    // ==========================================
    // VOICE INPUT
    // ==========================================

    function setupVoiceInput() {

        const button =
            document.getElementById(
                "voice-input-btn"
            );


        if (!button) {
            return;
        }


        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            button.title =
                "Voice input is not supported.";

            return;

        }


        const recognition =
            new SpeechRecognition();


        recognition.lang =
            "en-IN";

        recognition.continuous =
            false;

        recognition.interimResults =
            false;


        button.addEventListener(
            "click",
            () => {

                button.classList.add(
                    "active"
                );

                recognition.start();

            }
        );


        recognition.onresult =
            event => {

                const transcript =
                    event.results[0][0].transcript;


                if (chatInput) {

                    chatInput.value =
                        transcript;

                    autoResizeTextarea();

                    chatInput.focus();

                }

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

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value;

        return div.innerHTML;

    }

});


/* ============================================================
   END
   ============================================================ */