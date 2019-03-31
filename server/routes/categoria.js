const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/authentication');

let app = express();

let Categoria = require('../models/categoria');

//======================================
// Mostrar todas las categorias
// =====================================
app.get('/categoria', (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('user', 'name email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, totalReg) => {

                res.json({
                    ok: true,
                    TotalCategorias: totalReg,
                    categorias
                });

            });

        });

});

//======================================
// Mostrar una categoria por ID
// =====================================
app.get('/categoria/:id', (req, res) => {

    let categoriaID = req.params.id;

    Categoria.findById(categoriaID, (err, categoriaDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "Categoria no encontrada"
                    }
                });
            } else {
                res.json({
                    ok: true,
                    categoriaDB
                });
            }

        })
        .populate('user', 'name email');

});

//======================================
// Crea una nueva categoria
// =====================================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let userID = req.user._id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        user: userID
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});

//======================================
// Actualiza una categoria
// =====================================
app.put('/categoria/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Categoria no encontrada"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//======================================
// Elimina completamente una categoria
// =====================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaRemove) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaRemove) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaRemove
        });

    });

});

module.exports = app;