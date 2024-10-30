import express from 'express';
import { engine } from 'express-handlebars';
import { Server as HttpServer } from 'http'; 
import { Server as SocketIOServer } from 'socket.io'; 
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import ProductManager from './dao/ProductManager.js'; // Importar ProductManager

const app = express();
const PORT = 3000;

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views'); 

app.use(express.json());

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter); 

// Crear el servidor HTTP
const httpServer = new HttpServer(app);

// Configurar Socket.IO
const io = new SocketIOServer(httpServer); 

// Crear una instancia de ProductManager y pasar el objeto `io`
const productManager = new ProductManager(io); // Instanciar ProductManager con io

// Configuración de eventos de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Emitir la lista de productos al cliente
    productManager.getProducts().then(products => {
        socket.emit('productList', products); 
    });

    // Manejar el evento para agregar un nuevo producto
    socket.on('addProduct', async (newProduct) => {
        try {
            await productManager.addProduct(newProduct); // Agregar el nuevo producto
            const updatedProducts = await productManager.getProducts(); // Obtener la lista actualizada
            io.emit('productList', updatedProducts); // Emitir la lista actualizada a todos los clientes
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Exportar `io` para su uso en otros módulos
export { io };
