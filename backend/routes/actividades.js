const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/actividades - Obtener todas las actividades
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.nombre as creador_nombre 
       FROM actividades a 
       LEFT JOIN usuarios u ON a.creado_por = u.id 
       ORDER BY a.fecha, a.hora`
    );

    res.json({
      success: true,
      actividades: result.rows
    });

  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /api/actividades/:id - Obtener una actividad específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT a.*, u.nombre as creador_nombre 
       FROM actividades a 
       LEFT JOIN usuarios u ON a.creado_por = u.id 
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    res.json({
      success: true,
      actividad: result.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener actividad:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST /api/actividades - Crear nueva actividad (solo directores)
router.post('/', authenticateToken, authorizeRole('director'), async (req, res) => {
  try {
    const { titulo, fecha, hora, tipo, jornada, descripcion } = req.body;
    const creado_por = req.user.id;

    // Validar datos
    if (!titulo || !fecha || !hora || !tipo || !jornada) {
      return res.status(400).json({ 
        error: 'Título, fecha, hora, tipo y jornada son requeridos' 
      });
    }

    const result = await pool.query(
      `INSERT INTO actividades (titulo, fecha, hora, tipo, jornada, descripcion, creado_por) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [titulo, fecha, hora, tipo, jornada, descripcion || null, creado_por]
    );

    res.status(201).json({
      success: true,
      message: 'Actividad creada exitosamente',
      actividad: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear actividad:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// PUT /api/actividades/:id - Actualizar actividad (solo directores)
router.put('/:id', authenticateToken, authorizeRole('director'), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, fecha, hora, tipo, jornada, descripcion } = req.body;

    // Verificar que la actividad existe
    const existeActividad = await pool.query(
      'SELECT id FROM actividades WHERE id = $1',
      [id]
    );

    if (existeActividad.rows.length === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    const result = await pool.query(
      `UPDATE actividades 
       SET titulo = $1, fecha = $2, hora = $3, tipo = $4, jornada = $5, descripcion = $6
       WHERE id = $7 
       RETURNING *`,
      [titulo, fecha, hora, tipo, jornada, descripcion || null, id]
    );

    res.json({
      success: true,
      message: 'Actividad actualizada exitosamente',
      actividad: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar actividad:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// DELETE /api/actividades/:id - Eliminar actividad (solo directores)
router.delete('/:id', authenticateToken, authorizeRole('director'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM actividades WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    res.json({
      success: true,
      message: 'Actividad eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;