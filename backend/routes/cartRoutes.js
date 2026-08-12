"use strict";

const express = require("express");

const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require("../controllers/cartController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


/* ==========================================
   GET CART
========================================== */

router.get(
    "/",
    authMiddleware,
    getCart
);


/* ==========================================
   ADD TO CART
========================================== */

router.post(
    "/add",
    authMiddleware,
    addToCart
);


/* ==========================================
   UPDATE CART ITEM
========================================== */

router.put(
    "/update",
    authMiddleware,
    updateCartItem
);


/* ==========================================
   REMOVE FROM CART
========================================== */

router.delete(
    "/remove",
    authMiddleware,
    removeFromCart
);


/* ==========================================
   CLEAR CART
========================================== */

router.delete(
    "/clear",
    authMiddleware,
    clearCart
);


module.exports = router;