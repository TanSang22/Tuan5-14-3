var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventory');

// Get all inventories
router.get('/', async function (req, res, next) {
    try {
        let data = await inventoryController.GetAllInventories();
        res.send({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Get inventory by ID
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let data = await inventoryController.GetInventoryById(id);
        if (data) {
            res.send({
                success: true,
                data: data
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'Inventory not found'
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

// Add stock
router.post('/add-stock', async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        let result = await inventoryController.AddStock(product, quantity);
        res.send({
            success: true,
            message: result.message,
            data: result.inventory
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        });
    }
});

// Remove stock
router.post('/remove-stock', async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        let result = await inventoryController.RemoveStock(product, quantity);
        res.send({
            success: true,
            message: result.message,
            data: result.inventory
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        });
    }
});

// Reservation
router.post('/reservation', async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        let result = await inventoryController.ReserveStock(product, quantity);
        res.send({
            success: true,
            message: result.message,
            data: result.inventory
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        });
    }
});

// Sold
router.post('/sold', async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        let result = await inventoryController.SoldProduct(product, quantity);
        res.send({
            success: true,
            message: result.message,
            data: result.inventory
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
