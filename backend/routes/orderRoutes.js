"use strict";

const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
} = require("../controllers/orderController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


/* ==========================================
   CREATE ORDER
========================================== */

router.post(
    "/",
    authMiddleware,
    createOrder
);


/* ==========================================
   GET MY ORDERS
========================================== */

router.get(
    "/",
    authMiddleware,
    getMyOrders
);


/* ==========================================
   GET SINGLE ORDER
========================================== */

router.get(
    "/:id",
    authMiddleware,
    getOrderById
);


/* ==========================================
   CANCEL ORDER
========================================== */

router.patch(
    "/:id/cancel",
    authMiddleware,
    cancelOrder
);


module.exports = router;