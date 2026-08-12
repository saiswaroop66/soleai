"use strict";

const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
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

        originalPrice: {
            type: Number,
            default: 0
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
            default: 1,
            min: 1
        }
    },
    {
        _id: false
    }
);


const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        items: {
            type: [cartItemSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);


module.exports =
    mongoose.model(
        "Cart",
        cartSchema
    );
