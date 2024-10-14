import fs from 'fs/promises';
import path from 'path';

class ProductManager {
    constructor() {
        this.filePath = path.resolve('src/data/products.json');
    }

    async getProducts(limit) {
        let data = await fs.readFile(this.filePath, 'utf-8');
        let products = JSON.parse(data);
        if (limit) {
            products = products.slice(0, limit);
        }
        return products;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async addProduct(product) {
        const products = await this.getProducts();

        const existingProduct = products.find(p => p.id === product.id);
        if (existingProduct) {
            throw new Error('El producto ya existe');
        }

        const requiredFields = ['title', 'description', 'code', 'price', 'stock'];
        requiredFields.forEach(field => {
            if (!product[field]) {
                throw new Error(`El campo ${field} es obligatorio`);
            }
        });

        if (typeof product.price !== 'number' || product.price < 0) {
            throw new Error('El precio debe ser un número positivo');
        }
        if (typeof product.stock !== 'number' || product.stock < 0) {
            throw new Error('El stock debe ser un número no negativo');
        }
        if (typeof product.status !== 'boolean') {
            throw new Error('El estado debe ser un valor booleano');
        }

        const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = { id, status: true, ...product };
        products.push(newProduct);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, '\t'));
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(p => p.id === id);
        
        if (productIndex === -1) throw new Error('Producto no encontrado');

        if (updates.id) {
            throw new Error('No se puede actualizar el ID del producto');
        }

        const requiredFields = ['title', 'description', 'code', 'price', 'stock'];
        requiredFields.forEach(field => {
            if (updates[field] === undefined) {
                throw new Error(`El campo ${field} es obligatorio`);
            }
        });

        if (updates.price !== undefined && (typeof updates.price !== 'number' || updates.price < 0)) {
            throw new Error('El precio debe ser un número positivo');
        }
        if (updates.stock !== undefined && (typeof updates.stock !== 'number' || updates.stock < 0)) {
            throw new Error('El stock debe ser un número no negativo');
        }
        if (updates.status !== undefined && typeof updates.status !== 'boolean') {
            throw new Error('El estado debe ser un valor booleano');
        }

        // Actualizar el producto, manteniendo el ID original
        products[productIndex] = { ...products[productIndex], ...updates, id: products[productIndex].id };
        await fs.writeFile(this.filePath, JSON.stringify(products, null, '\t'));
        return products[productIndex];
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        const productIndex = products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }
        
        // Eliminar el producto si existe
        products.splice(productIndex, 1);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, '\t'));
    }
}

export default ProductManager;
