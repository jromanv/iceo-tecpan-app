const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/usuarios - Obtener todos los usuarios (solo directores)
router.get('/', authenticateToken, authorizeRole('director'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, nombre, rol, plan, activo, fecha_creacion 
       FROM usuarios 
       ORDER BY rol, nombre`
    );

    res.json({
      success: true,
      usuarios: result.rows
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /api/usuarios/:id - Obtener un usuario específico
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Solo el mismo usuario o un director pueden ver los detalles
    if (req.user.rol !== 'director' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const result = await pool.query(
      `SELECT id, email, nombre, rol, plan, activo, fecha_creacion 
       FROM usuarios 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;