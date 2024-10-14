import { Router } from 'express';
import ProductManager from '../dao/ProductManager.js';
import { procesaErrores } from '../utils.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        procesaErrores(res, error);
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(Number(req.params.pid));
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        procesaErrores(res, error);
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        procesaErrores(res, error);
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(Number(req.params.pid), req.body);
        res.json(updatedProduct);
    } catch (error) {
        procesaErrores(res, error);
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(Number(req.params.pid));
        res.status(204).end();
    } catch (error) {
        procesaErrores(res, error);
    }
});

export default router;
