const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const createTables = async () => {
  try {
    // Crear tabla usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        rol VARCHAR(50) NOT NULL,
        plan VARCHAR(50) NOT NULL,
        activo BOOLEAN DEFAULT true,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla usuarios creada/verificada');

    // Crear tabla actividades
    await pool.query(`
      CREATE TABLE IF NOT EXISTS actividades (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        fecha DATE NOT NULL,
        hora VARCHAR(50) NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        jornada VARCHAR(50) NOT NULL,
        descripcion TEXT,
        creado_por INTEGER REFERENCES usuarios(id),
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla actividades creada/verificada');

    // Insertar usuarios de prueba
    const passwordHash = await bcrypt.hash('director123', 10);
    const docentePass = await bcrypt.hash('docente123', 10);
    const alumnoPass = await bcrypt.hash('alumno123', 10);

    // Director
    await pool.query(`
      INSERT INTO usuarios (email, password, nombre, rol, plan)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['director@liceotecpan.edu.gt', passwordHash, 'Director General', 'director', 'ambos']);

    // Docente
    await pool.query(`
      INSERT INTO usuarios (email, password, nombre, rol, plan)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['docente@liceotecpan.edu.gt', docentePass, 'Juan Pérez', 'docente', 'diario']);

    // Alumno
    await pool.query(`
      INSERT INTO usuarios (email, password, nombre, rol, plan)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['alumno@liceotecpan.edu.gt', alumnoPass, 'María García', 'alumno', 'diario']);

    console.log('Datos de prueba insertados');

  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
  } finally {
    pool.end();
  }
};

createTables();
