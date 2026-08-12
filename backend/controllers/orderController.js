"use strict";

const Order = require("../models/Order");
const Cart = require("../models/Cart");


/* ==========================================
   CREATE ORDER
========================================== */

const createOrder = async (req, res) => {

    try {

        const userId =
            req.user.id;


        const {
            shippingAddress,
            paymentMethod
        } = req.body;


        /* ==========================================
           VALIDATE ADDRESS
        ========================================== */

        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.phone ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.pincode
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Complete shipping address is required."

            });

        }


        /* ==========================================
           GET USER CART
        ========================================== */

        const cart =
            await Cart.findOne({
                userId
            });


        if (
            !cart ||
            !cart.items ||
            cart.items.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Your cart is empty."

            });

        }


        /* ==========================================
           CALCULATE TOTAL
        ========================================== */

        let subtotal = 0;


        const items =
            cart.items.map(
                item => {

                    const quantity =
                        Number(
                            item.quantity
                        );


                    const price =
                        Number(
                            item.price
                        );


                    subtotal +=
                        price *
                        quantity;


                    return {

                        productId:
                            item.productId,

                        name:
                            item.name,

                        price:
                            price,

                        image:
                            item.image,

                        size:
                            item.size,

                        color:
                            item.color,

                        quantity:
                            quantity

                    };

                }
            );


        const delivery = 0;

        const discount = 0;


        const total =
            subtotal +
            delivery -
            discount;


        /* ==========================================
           PAYMENT METHOD
        ========================================== */

        const selectedPaymentMethod =
            paymentMethod === "ONLINE"
                ? "ONLINE"
                : "COD";


        const paymentStatus =
            selectedPaymentMethod === "COD"
                ? "PENDING"
                : "PENDING";


        /* ==========================================
           CREATE ORDER
        ========================================== */

        const order =
            await Order.create({

                userId,

                items,

                shippingAddress: {

                    fullName:
                        shippingAddress.fullName.trim(),

                    phone:
                        shippingAddress.phone.trim(),

                    address:
                        shippingAddress.address.trim(),

                    city:
                        shippingAddress.city.trim(),

                    state:
                        shippingAddress.state.trim(),

                    pincode:
                        shippingAddress.pincode.trim()

                },

                subtotal,

                delivery,

                discount,

                total,

                paymentMethod:
                    selectedPaymentMethod,

                paymentStatus,

                orderStatus:
                    "PLACED"

            });


        /* ==========================================
           CLEAR CART
        ========================================== */

        cart.items = [];


        await cart.save();


        /* ==========================================
           RESPONSE
        ========================================== */

        return res.status(201).json({

            success: true,

            message:
                "Order placed successfully.",

            order: {

                id:
                    order._id,

                total:
                    order.total,

                paymentMethod:
                    order.paymentMethod,

                paymentStatus:
                    order.paymentStatus,

                orderStatus:
                    order.orderStatus,

                createdAt:
                    order.createdAt

            }

        });

    } catch (error) {

        console.error(
            "Create order error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to place order."

        });

    }

};


/* ==========================================
   GET MY ORDERS
========================================== */

const getMyOrders = async (req, res) => {

    try {

        const userId =
            req.user.id;


        const orders =
            await Order.find({
                userId
            })
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            count:
                orders.length,

            orders

        });

    } catch (error) {

        console.error(
            "Get orders error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch orders."

        });

    }

};


/* ==========================================
   GET SINGLE ORDER
========================================== */

const getOrderById = async (req, res) => {

    try {

        const userId =
            req.user.id;

        const orderId =
            req.params.id;


        const order =
            await Order.findOne({

                _id:
                    orderId,

                userId

            });


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found."

            });

        }


        return res.status(200).json({

            success: true,

            order

        });

    } catch (error) {

        console.error(
            "Get order error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch order."

        });

    }

};


/* ==========================================
   CANCEL ORDER
========================================== */

const cancelOrder = async (req, res) => {

    try {

        const userId =
            req.user.id;

        const orderId =
            req.params.id;


        const order =
            await Order.findOne({

                _id:
                    orderId,

                userId

            });


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found."

            });

        }


        if (
            order.orderStatus ===
            "SHIPPED" ||
            order.orderStatus ===
            "DELIVERED"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This order can no longer be cancelled."

            });

        }


        if (
            order.orderStatus ===
            "CANCELLED"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Order is already cancelled."

            });

        }


        order.orderStatus =
            "CANCELLED";


        await order.save();


        return res.status(200).json({

            success: true,

            message:
                "Order cancelled successfully.",

            order

        });

    } catch (error) {

        console.error(
            "Cancel order error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to cancel order."

        });

    }

};


/* ==========================================
   EXPORT
========================================== */

module.exports = {

    createOrder,

    getMyOrders,

    getOrderById,

    cancelOrder

};