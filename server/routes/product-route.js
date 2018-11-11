const express = require('express');
let { verifyToken, verifyRole } = require('../middlewares/authenticate');

let app = express();

let Product = require('../models/product');

/**
 * =================
 * Get all Products
 * =================
 */
app.get('/products', verifyToken, (req, res) => {
    // populate: users and categories
    // paginate

    let ofSet = Number(req.query.ofSet) || 0,
        limit = Number(req.query.limit) || 5;

    Product.find({ enable: true })
        .skip(ofSet)
        .limit(limit)
        .populate('User', 'name email')
        .populate('Category', 'description')
        .exec((err, Products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Product.count({ enable: true }, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    Products,
                    total_registros: conteo
                });
            });
        });
});

/**
 * =======================
 * Get Product by ID
 * =======================
 */
app.get('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('User', 'name email')
        .populate('Category', 'description')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `El ${id} no existe`
                    }
                });
            }

            res.json({
                ok: true,
                Product: productDB
            });
        });
});

/**
 * ========================
 * Search Products by Term
 * ========================
 */
app.get('/products/search/:term', verifyToken, (req, res) => {

    let term = req.params.term,
        regex = new RegExp(term, 'i');

    Product.find({ nameProd: regex, enable: true })
        .populate('Category', 'description')
        .exec((err, Products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                Products
            });
        });
});

/**
 * =======================
 * Post a new product
 * =======================
 */
app.post('/product', verifyToken, (req, res) => {

    let body = req.body;

    let product = new Product({
        User: req.usuario._id,
        nameProd: body.nameProd,
        priceUni: body.priceUni,
        descProd: body.descProd,
        enable: body.enable,
        Category: body.Category
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            Product: productDB
        });
    });
});

/**
 * =======================
 * Put at product
 * =======================
 */
app.put('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El producto con el ID: ${id} no existe`
                }
            });
        }

        productDB.nameProd = body.nameProd;
        productDB.priceUni = body.priceUni;
        productDB.descProd = body.descProd;
        productDB.enable = body.enable;
        productDB.Category = body.Category;

        productDB.save((err, productSave) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                Product: productSave
            });
        });
    });
});

/**
 * =======================
 * Delete at product
 * =======================
 */
app.delete('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El ID: ${id} no existe`
                }
            });
        }

        productDB.enable = false;
        productDB.save((err, productDelete) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                Product: productDelete,
                message: `Producto eliminado correctamente`
            });
        });
    });
});


module.exports = app;