let inventoryModel = require('../schemas/inventory');
let productModel = require('../schemas/products');

module.exports = {
    // Create inventory when product is created
    CreateInventory: async function (productId) {
        try {
            let newInventory = new inventoryModel({
                product: productId,
                stock: 0,
                reserved: 0,
                soldCount: 0
            });
            await newInventory.save();
            return newInventory;
        } catch (error) {
            throw new Error('Failed to create inventory: ' + error.message);
        }
    },

    // Get all inventories
    GetAllInventories: async function () {
        try {
            return await inventoryModel.find({}).populate({
                path: 'product',
                select: 'title price description'
            });
        } catch (error) {
            throw new Error('Failed to get inventories: ' + error.message);
        }
    },

    // Get inventory by ID with join product
    GetInventoryById: async function (inventoryId) {
        try {
            return await inventoryModel.findById(inventoryId).populate({
                path: 'product',
                select: 'title price description category'
            });
        } catch (error) {
            throw new Error('Failed to get inventory: ' + error.message);
        }
    },

    // Add stock
    AddStock: async function (productId, quantity) {
        try {
            if (!productId || quantity <= 0) {
                throw new Error('Invalid product ID or quantity');
            }

            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                throw new Error('Inventory not found for this product');
            }

            inventory.stock += quantity;
            inventory.updatedAt = new Date();
            await inventory.save();

            return ({
                message: 'Stock added successfully',
                inventory: inventory
            });
        } catch (error) {
            throw new Error('Failed to add stock: ' + error.message);
        }
    },

    // Remove stock
    RemoveStock: async function (productId, quantity) {
        try {
            if (!productId || quantity <= 0) {
                throw new Error('Invalid product ID or quantity');
            }

            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                throw new Error('Inventory not found for this product');
            }

            if (inventory.stock < quantity) {
                throw new Error('Insufficient stock');
            }

            inventory.stock -= quantity;
            inventory.updatedAt = new Date();
            await inventory.save();

            return ({
                message: 'Stock removed successfully',
                inventory: inventory
            });
        } catch (error) {
            throw new Error('Failed to remove stock: ' + error.message);
        }
    },

    // Reservation: decrease stock and increase reserved
    ReserveStock: async function (productId, quantity) {
        try {
            if (!productId || quantity <= 0) {
                throw new Error('Invalid product ID or quantity');
            }

            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                throw new Error('Inventory not found for this product');
            }

            if (inventory.stock < quantity) {
                throw new Error('Insufficient stock for reservation');
            }

            inventory.stock -= quantity;
            inventory.reserved += quantity;
            inventory.updatedAt = new Date();
            await inventory.save();

            return ({
                message: 'Stock reserved successfully',
                inventory: inventory
            });
        } catch (error) {
            throw new Error('Failed to reserve stock: ' + error.message);
        }
    },

    // Sold: decrease reserved and increase soldCount
    SoldProduct: async function (productId, quantity) {
        try {
            if (!productId || quantity <= 0) {
                throw new Error('Invalid product ID or quantity');
            }

            let inventory = await inventoryModel.findOne({ product: productId });
            if (!inventory) {
                throw new Error('Inventory not found for this product');
            }

            if (inventory.reserved < quantity) {
                throw new Error('Insufficient reserved stock');
            }

            inventory.reserved -= quantity;
            inventory.soldCount += quantity;
            inventory.updatedAt = new Date();
            await inventory.save();

            return ({
                message: 'Product sold successfully',
                inventory: inventory
            });
        } catch (error) {
            throw new Error('Failed to record sold: ' + error.message);
        }
    }
};
