"use strict";

const Product = require("../models/Product");


/* ==========================================
   GET ALL PRODUCTS
========================================== */

const getProducts = async (req, res) => {

    try {

        const products = await Product.find({
            isActive: true
        }).sort({
            createdAt: -1
        });

        res.status(200).json({

            success: true,

            count: products.length,

            products: products

        });

    } catch (error) {

        console.error(
            "Get products error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to fetch products."

        });

    }

};


/* ==========================================
   GET PRODUCT BY ID
========================================== */

const getProductById = async (req, res) => {

    try {

        const product =
            await Product.findOne({

                _id: req.params.id,

                isActive: true

            });


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found."

            });

        }


        res.status(200).json({

            success: true,

            product: product

        });

    } catch (error) {

        console.error(
            "Get product error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to fetch product."

        });

    }

};


/* ==========================================
   EXPORT
========================================== */

module.exports = {

    getProducts,

    getProductById

};
