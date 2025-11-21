const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}\n`);
}

// Hashear las contraseñas de prueba
(async () => {
  await hashPassword('director123');
  await hashPassword('docente123');
  await hashPassword('alumno123');
})();