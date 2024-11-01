import { Router } from 'express';
import { io } from '../app.js'; 
import ProductManager from '../dao/ProductManager.js'; 

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error al obtener productos');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error al obtener productos');
    }
});

// No necesitas volver a configurar 'io.on' aquí.

export default router;
