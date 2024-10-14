import { Router } from 'express';
import CartManager from '../dao/CartManager.js';
import { procesaErrores } from '../utils.js';

const router = Router();
const cartManager = new CartManager();

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (error) {
        procesaErrores(res, error);
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(Number(req.params.cid));
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(cart);
    } catch (error) {
        procesaErrores(res, error);
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        procesaErrores(res, error);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: "La cantidad debe ser un número positivo." });
        }

        const updatedCart = await cartManager.addProductToCart(Number(req.params.cid), Number(req.params.pid), quantity);
        res.json(updatedCart);
    } catch (error) {
        procesaErrores(res, error);
    }
});

export default router;
