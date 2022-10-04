const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Layout = mongoose.model('Layout');

// CREATE LAYOUT
router.post('/', (req, res) => {
    const newLayout = new Layout(req.body);
    newLayout.save((err, layout) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.json(layout);
        }
    })
})

// GET LAYOUTS
router.get('/', (req, res) => {
    req.query.dt_deleted = null;
    Layout.find(req.query).
        then((layouts) => {
            res.json(layouts);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
})

// UPDATE LAYOUT
router.put('/:id', (req, res) => {
    Layout.findById(req.params.id, (err, layout) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            if (req.body.name) layout.name = req.body.name;
            if (req.body.rectangles) layout.rectangles = req.body.rectangles;
            layout.save((err, layout) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.json(layout);
                }
            })
        }
    })
})

// DELETE LAYOUT
router.delete('/:id', (req, res) => {
    Layout.findById(req.params.id, (err, layout) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            layout.dt_deleted = new Date();
            layout.save((err) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            })
        }
    })
})


module.exports = router;