"use strict";

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        brand: {
            type: String,
            required: true,
            default: "SoleAI"
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        originalPrice: {
            type: Number,
            required: true,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        reviews: {
            type: Number,
            default: 0,
            min: 0
        },

        image: {
            type: String,
            required: true
        },

        images: {
            type: [String],
            default: []
        },

        colors: {
            type: [String],
            default: []
        },

        sizes: {
            type: [Number],
            default: []
        },

        description: {
            type: String,
            default: ""
        },

        shortDescription: {
            type: String,
            default: ""
        },

        tags: {
            type: [String],
            default: []
        },

        stock: {
            type: Number,
            default: 0,
            min: 0
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Product",
    productSchema
);