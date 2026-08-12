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

const PORT =
    process.env.PORT || 5000;


/* ==========================================
   DATABASE
========================================== */

connectDB();


/* ==========================================
   MIDDLEWARE
========================================== */

app.use(
    cors()
);

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
   IMPORTANT:
   Keep this AFTER all API routes.
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
            `Server: http://localhost:${PORT}`
        );

        console.log(
            `Health: http://localhost:${PORT}/api/health`
        );

        console.log(
            `Register: http://localhost:${PORT}/api/auth/register`
        );

        console.log(
            `Login: http://localhost:${PORT}/api/auth/login`
        );

        console.log(
            `Products: http://localhost:${PORT}/api/products`
        );

        console.log(
            `Cart: http://localhost:${PORT}/api/cart`
        );

        console.log(
            `Orders: http://localhost:${PORT}/api/orders`
        );

        console.log(
            "================================="
        );

        console.log("");

    }
);
