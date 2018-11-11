const express = require('express');
let { verifyToken, verifyRole } = require('../middlewares/authenticate');

let app = express();

let category = require('../models/category');

/**
 * ===================
 * Get all categories
 * ===================
 */
app.get('/categories', verifyToken, (req, res) => {
    category.find({})
        .sort('description')
        .populate('User', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categories
            });
        });
});

/**
 * =====================
 * Get categories by ID
 * =====================
 */
app.get('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El ID: ${id} no es correcto`
                }
            });
        }

        res.json({
            ok: true,
            Category: categoryDB
        });
    });
});

/** 
 * =================
 * Put at category
 * =================
 */
app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategory = {
        description: body.description
    };

    category.findByIdAndUpdate(id,
        descCategory, { new: true, runValidators: true },
        (err, categoryDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoryDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                Category: categoryDB
            });
        });
});

/**
 * ==================
 * Post at category
 * ==================
 */
app.post('/category', verifyToken, (req, res) => {
    let body = req.body;

    let Category = new category({
        description: body.description,
        User: req.usuario._id
    });

    Category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            Category: categoryDB
        });
    });
});

/**
 * ===================
 * Delete at category
 * ===================
 */
app.delete('/category/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;

    category.findByIdAndRemove(id,
        (err, categoryDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoryDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                message: 'Categoria eliminada correctamente'
            });
        });
});


module.exports = app;