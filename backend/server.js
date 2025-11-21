const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const actividadesRoutes = require('./routes/actividades');
const usuariosRoutes = require('./routes/usuarios');

// Inicializar app
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // Frontend Next.js
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🎓 API Liceo Tecpán funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      actividades: '/api/actividades',
      usuarios: '/api/usuarios'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n Servidor backend iniciado en http://localhost:${PORT}`);
  console.log(` Entorno: ${process.env.NODE_ENV}`);
  console.log(` Base de datos: ${process.env.DB_NAME}`);
  console.log(`\nAPI lista para recibir peticiones\n`);
});