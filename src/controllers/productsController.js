// import { io } from '../../app.js'; // Asegúrate de importar `io` desde `app.js`

// export const createProduct = async (req, res) => {
//     try {
//         // Lógica para crear el producto
//         const newProduct = req.body;
//         await saveProduct(newProduct);

//         // Emitir evento de actualización
//         const products = await getProducts(); // Obtener lista de productos actualizada
//         io.emit('updateProducts', products);

//         res.status(201).json(newProduct);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al crear el producto' });
//     }
// };

// export const deleteProduct = async (req, res) => {
//     try {
//         // Lógica para eliminar el producto
//         const productId = req.params.id;
//         await deleteProductById(productId);

//         // Emitir evento de actualización
//         const products = await getProducts(); // Obtener lista de productos actualizada
//         io.emit('updateProducts', products);

//         res.status(200).json({ message: 'Producto eliminado' });
//     } catch (error) {
//         res.status(500).json({ error: 'Error al eliminar el producto' });
//     }
// };
