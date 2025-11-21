const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validar datos
    if (!email || !password || !userType) {
      return res.status(400).json({ 
        error: 'Email, contraseña y tipo de usuario son requeridos' 
      });
    }

    // Buscar usuario en la base de datos
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND rol = $2 AND activo = true',
      [email, userType]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = result.rows[0];

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        rol: usuario.rol,
        plan: usuario.plan 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Responder con datos del usuario y token
    res.json({
      success: true,
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
        plan: usuario.plan
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST /api/auth/register - Registrar nuevo usuario (solo para directores)
router.post('/register', async (req, res) => {
  try {
    const { email, password, nombre, rol, plan } = req.body;

    // Validar datos
    if (!email || !password || !nombre || !rol || !plan) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar email institucional
    if (!email.endsWith('@liceotecpan.edu.gt')) {
      return res.status(400).json({ 
        error: 'El email debe ser institucional (@liceotecpan.edu.gt)' 
      });
    }

    // Verificar si el usuario ya existe
    const existeUsuario = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (existeUsuario.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await pool.query(
      `INSERT INTO usuarios (email, password, nombre, rol, plan) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, nombre, rol, plan`,
      [email, hashedPassword, nombre, rol, plan]
    );

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;