"use strict";

const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");


/* ==========================================
   GET CART
========================================== */

const getCart = async (req, res) => {

    try {

        const userId = req.user.id;

        let cart = await Cart.findOne({
            userId
        });

        if (!cart) {

            cart = await Cart.create({
                userId,
                items: []
            });

        }

        res.status(200).json({

            success: true,

            cart

        });

    } catch (error) {

        console.error(
            "Get cart error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Unable to fetch cart."

        });

    }

};


/* ==========================================
   ADD TO CART
========================================== */

const addToCart = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            productId,
            size,
            color,
            quantity
        } = req.body;


        if (
            !productId ||
            !size ||
            !color
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Product, size and color are required."

            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                productId
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product ID."

            });

        }


        const product =
            await Product.findOne({

                _id: productId,

                isActive: true

            });


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        let cart =
            await Cart.findOne({
                userId
            });


        if (!cart) {

            cart =
                await Cart.create({

                    userId,

                    items: []

                });

        }


        const requestedQuantity =
            Math.max(
                1,
                Number(quantity) || 1
            );


        const existingItem =
            cart.items.find(
                item =>

                    String(
                        item.productId
                    ) ===
                    String(
                        productId
                    ) &&

                    String(
                        item.size
                    ) ===
                    String(
                        size
                    ) &&

                    item.color ===
                    color
            );


        if (existingItem) {

            existingItem.quantity =
                Math.min(
                    10,
                    existingItem.quantity +
                    requestedQuantity
                );

        } else {

            cart.items.push({

                productId:

                    product._id,

                name:

                    product.name,

                price:

                    product.price,

                originalPrice:

                    product.originalPrice,

                image:

                    product.image,

                size:

                    String(size),

                color:

                    color,

                quantity:

                    Math.min(
                        10,
                        requestedQuantity
                    )

            });

        }


        await cart.save();


        res.status(200).json({

            success: true,

            message:
                "Product added to cart.",

            cart

        });

    } catch (error) {

        console.error(
            "Add cart error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to add product to cart."

        });

    }

};


/* ==========================================
   UPDATE CART ITEM
========================================== */

const updateCartItem = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            productId,
            size,
            color,
            quantity
        } = req.body;


        const cart =
            await Cart.findOne({
                userId
            });


        if (!cart) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart not found."

            });

        }


        const item =
            cart.items.find(
                item =>

                    String(
                        item.productId
                    ) ===
                    String(
                        productId
                    ) &&

                    String(
                        item.size
                    ) ===
                    String(
                        size
                    ) &&

                    item.color ===
                    color
            );


        if (!item) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart item not found."

            });

        }


        const newQuantity =
            Number(quantity);


        if (
            !Number.isInteger(
                newQuantity
            ) ||
            newQuantity < 1
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Quantity must be at least 1."

            });

        }


        item.quantity =
            Math.min(
                10,
                newQuantity
            );


        await cart.save();


        res.status(200).json({

            success: true,

            message:
                "Cart updated.",

            cart

        });

    } catch (error) {

        console.error(
            "Update cart error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to update cart."

        });

    }

};


/* ==========================================
   REMOVE FROM CART
========================================== */

const removeFromCart = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            productId,
            size,
            color
        } = req.body;


        const cart =
            await Cart.findOne({
                userId
            });


        if (!cart) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart not found."

            });

        }


        cart.items =
            cart.items.filter(
                item => !(
                    String(
                        item.productId
                    ) ===
                    String(
                        productId
                    ) &&

                    String(
                        item.size
                    ) ===
                    String(
                        size
                    ) &&

                    item.color ===
                    color
                )
            );


        await cart.save();


        res.status(200).json({

            success: true,

            message:
                "Product removed from cart.",

            cart

        });

    } catch (error) {

        console.error(
            "Remove cart error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to remove product."

        });

    }

};


/* ==========================================
   CLEAR CART
========================================== */

const clearCart = async (req, res) => {

    try {

        const userId = req.user.id;


        const cart =
            await Cart.findOne({
                userId
            });


        if (!cart) {

            return res.status(200).json({

                success: true,

                message:
                    "Cart is already empty."

            });

        }


        cart.items = [];


        await cart.save();


        res.status(200).json({

            success: true,

            message:
                "Cart cleared.",

            cart

        });

    } catch (error) {

        console.error(
            "Clear cart error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to clear cart."

        });

    }

};


module.exports = {

    getCart,

    addToCart,

    updateCartItem,

    removeFromCart,

    clearCart

};