"use strict";

const mongoose = require("mongoose");


/* ==========================================
   ORDER ITEM
========================================== */

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        image: {
            type: String,
            default: ""
        },

        size: {
            type: String,
            required: true
        },

        color: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: false
    }
);


/* ==========================================
   SHIPPING ADDRESS
========================================== */

const addressSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        pincode: {
            type: String,
            required: true
        }
    },
    {
        _id: false
    }
);


/* ==========================================
   ORDER
========================================== */

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: {
            type: [orderItemSchema],
            required: true
        },

        shippingAddress: {
            type: addressSchema,
            required: true
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        delivery: {
            type: Number,
            default: 0,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            enum: [
                "COD",
                "ONLINE"
            ],
            default: "COD"
        },

        paymentStatus: {
            type: String,
            enum: [
                "PENDING",
                "PAID",
                "FAILED"
            ],
            default: "PENDING"
        },

        orderStatus: {
            type: String,
            enum: [
                "PLACED",
                "CONFIRMED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED"
            ],
            default: "PLACED"
        }
    },
    {
        timestamps: true
    }
);


module.exports =
    mongoose.model(
        "Order",
        orderSchema
    );