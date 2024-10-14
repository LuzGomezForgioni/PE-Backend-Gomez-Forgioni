import fs from 'fs/promises';
import path from 'path';

class CartManager {
    constructor() {
        this.filePath = path.resolve('src/data/carts.json');
    }

    async createCart() {
        const carts = await this.getCarts();
        const id = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
        const newCart = { id, products: [] };
        carts.push(newCart);
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, '\t'));
        return newCart;
    }

    async getCarts() {
        let data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === id);
    }

    async addProductToCart(cid, pid, quantity) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cid);
        if (cartIndex === -1) throw new Error('No se ha encontrado el carrito');

        const productIndex = carts[cartIndex].products.findIndex(p => p.product === pid);
        if (productIndex > -1) {
            carts[cartIndex].products[productIndex].quantity += quantity;
        } else {
            carts[cartIndex].products.push({ product: pid, quantity });
        }

        await fs.writeFile(this.filePath, JSON.stringify(carts, null, '\t'));
        return carts[cartIndex];
    }
}

export default CartManager;
