"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

/* ==========================================
   APP
========================================== */

const app = express();

const PORT = process.env.PORT || 5000;


/* ==========================================
   DATABASE
========================================== */

connectDB();


/* ==========================================
   CORS
========================================== */

const allowedOrigins = [
    "https://6a7c93a3bd06b8424ee16709--neon-brigadeiros-aeb0e5.netlify.app",
    "https://6a7c858e45caa1cd565f9c07--celadon-eclair-b8041d.netlify.app",
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000"
];

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow requests without an Origin header
            // such as direct API calls/Postman.
            if (!origin) {
                return callback(null, true);
            }

            // Allow known frontend origins.
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Allow Netlify preview deployments.
            if (
                origin.endsWith(".netlify.app")
            ) {
                return callback(null, true);
            }

            console.log(
                "CORS blocked origin:",
                origin
            );

            return callback(
                new Error(
                    "Not allowed by CORS"
                )
            );
        },

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ],

        optionsSuccessStatus: 204
    })
);


/* ==========================================
   BODY PARSING
========================================== */

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);


/* ==========================================
   ROOT
========================================== */

app.get(
    "/",
    (req, res) => {

        res.json({

            success: true,

            message:
                "SoleAI Backend API is running 🚀"

        });

    }
);


/* ==========================================
   HEALTH CHECK
========================================== */

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            status: "OK",

            service:
                "SoleAI Backend",

            database:
                "MongoDB"

        });

    }
);


/* ==========================================
   AUTH ROUTES
========================================== */

app.use(
    "/api/auth",
    authRoutes
);


/* ==========================================
   PRODUCT ROUTES
========================================== */

app.use(
    "/api/products",
    productRoutes
);


/* ==========================================
   CART ROUTES
========================================== */

app.use(
    "/api/cart",
    cartRoutes
);


/* ==========================================
   ORDER ROUTES
========================================== */

app.use(
    "/api/orders",
    orderRoutes
);


/* ==========================================
   404 HANDLER
   MUST BE AFTER ALL ROUTES
========================================== */

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "API route not found",

            path:
                req.originalUrl

        });

    }
);


/* ==========================================
   GLOBAL ERROR HANDLER
========================================== */

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "Server error:",
            error
        );

        if (
            error.message ===
            "Not allowed by CORS"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "CORS origin not allowed"

            });

        }

        res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }
);


/* ==========================================
   START SERVER
========================================== */

app.listen(
    PORT,
    () => {

        console.log("");

        console.log(
            "================================="
        );

        console.log(
            "       SoleAI Backend 🚀"
        );

        console.log(
            "================================="
        );

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            `Health: /api/health`
        );

        console.log(
            `Register: /api/auth/register`
        );

        console.log(
            `Login: /api/auth/login`
        );

        console.log(
            `Products: /api/products`
        );

        console.log(
            `Cart: /api/cart`
        );

        console.log(
            `Orders: /api/orders`
        );

        console.log(
            "================================="
        );

        console.log("");

    }
);
