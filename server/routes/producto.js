const express = require('express');

let { verificaToken } = require('../middlewares/authentication');

let app = express();

let Producto = require('../models/producto');

//======================================
// Mostrar todos los productos
// =====================================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .sort('categoria')
        .skip(desde)
        .limit(5)
        .populate('user', 'name email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count((err, totalReg) => {

                res.json({
                    ok: true,
                    Totalproductos: totalReg,
                    productos
                });

            });

        });


});

//======================================
// Obtener un producto por su ID
// =====================================
app.get('/producto/:id', verificaToken, (req, res) => {

    let productoID = req.params.id;

    Producto.findById(productoID, (err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "producto no encontrada"
                    }
                });
            } else {
                res.json({
                    ok: true,
                    productoDB
                });
            }

        })
        .populate('user', 'name email')
        .populate('categoria', 'descripcion');

});

//======================================
// Buscar productos
// =====================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});

//======================================
// Crear un nuevo producto
// =====================================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let userID = req.user._id;
    //let categoriaID = req.categoria._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        user: userID
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

//======================================
// Actualizar un producto
// =====================================
app.put('/producto/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        })
        .populate('user', 'name email')
        .populate('categoria', 'descripcion');

    // Producto.findById(id, (err, productoDB) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!productoDB) {
    //         return res.status(500).json({
    //             ok: false,
    //             err: {
    //                 message: "Producto no encontrado"
    //             }
    //         });
    //     }

    //     productoDB.nombre = body.nombre;
    //     productoDB.precioUni = body.precioUni;
    //     productoDB.categoria = body.categoria;
    //     productoDB.disponible = body.disponible;
    //     productoDB.descripcion = body.descripcion;

    //     productoDB.save((err, productoGuardado) => {

    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }

    //         res.json({
    //             ok: true,
    //             producto: productoGuardado
    //         });

    //     });

    // });

});

//======================================
// Borrar un producto/ disponible = false
// =====================================
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Producto no encontrado"
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto borrado'
            });

        });

    });


});

module.exports = app;