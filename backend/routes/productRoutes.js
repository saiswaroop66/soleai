"use strict";

const express = require("express");

const {
    getProducts,
    getProductById
} = require("../controllers/productController");

const router = express.Router();


/* ==========================================
   GET ALL PRODUCTS
========================================== */

router.get(
    "/",
    getProducts
);


/* ==========================================
   GET PRODUCT BY ID
========================================== */

router.get(
    "/:id",
    getProductById
);


module.exports = router;