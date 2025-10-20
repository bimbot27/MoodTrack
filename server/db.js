const mysql = require('mysql2/promise');
// Tu .env debe estar en la carpeta raíz (MOODTRACK-MAIN)
require('dotenv').config({ path: '../.env' });

let pool;

async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Jugadoraso123',
      database: process.env.DB_NAME || 'moodtrack',
      waitForConnections: true,
      connectionLimit: 10,
      multipleStatements: true,
    });
  }
  return pool;
}

async function query(sql, params = []) {
  const p = await getPool();
  const [rows] = await p.query(sql, params);
  return rows;
}

async function initSchema() {
  // 1. CREA LA TABLA USERS
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(120) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  // 2. CREA LA TABLA RESPONSES
  await query(`
    CREATE TABLE IF NOT EXISTS responses (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      user_id BIGINT UNSIGNED NOT NULL,
      instrument VARCHAR(50) NOT NULL,
      total INT NOT NULL,
      max INT NOT NULL,
      severity VARCHAR(30) NOT NULL,
      answers JSON NOT NULL,
      ts BIGINT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_responses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_responses_user_ts (user_id, ts),
      INDEX idx_responses_instrument (instrument)
    ) ENGINE=InnoDB;
  `);

  // 3. CREA LA VISTA
  await query(`
    CREATE OR REPLACE VIEW v_latest_response_per_instrument AS
    SELECT r.*
    FROM responses r
    JOIN (
      SELECT user_id, instrument, MAX(ts) AS max_ts
      FROM responses
      GROUP BY user_id, instrument
    ) x ON x.user_id = r.user_id AND x.instrument = r.instrument AND x.max_ts = r.ts;
  `);

  // 4. ¡¡AQUÍ ESTÁ EL ARREGLO!! CREA LA TABLA DE PREGUNTAS
  await query(`
    CREATE TABLE IF NOT EXISTS survey_questions (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      type VARCHAR(20) NOT NULL,
      item_index INT NOT NULL,
      question_text TEXT NOT NULL,
      max_score INT NOT NULL,
      INDEX idx_type (type)
    ) ENGINE=InnoDB;
  `);

  // 5. Ahora el resto de tu código SÍ funcionará
  const existing = await query('SELECT COUNT(*) as c FROM survey_questions');
  const count = existing[0]?.c || 0;
  if (count === 0) {
    console.log('Base de datos vacía, insertando preguntas (seeding)...');
    const phq9 = [
      'Poco interés o placer en hacer cosas',
      'Se ha sentido decaído/a, deprimido/a o sin esperanzas',
      'Dificultad para dormir o dormir demasiado',
      'Se ha sentido cansado/a o con poca energía',
      'Poco apetito o comer en exceso',
      'Se siente mal consigo mismo/a o que es un/a fracasado/a o que ha quedado mal consigo mismo/a o con su familia',
      'Dificultad para concentrarse en cosas, como leer el periódico o ver la televisión',
      'Se mueve o habla tan lento que otras personas podrían haberlo notado. O lo contrario: se siente inquieto/a o agitado/a más de lo normal',
      'Pensamientos de que estaría mejor muerto/a o de hacerse daño de alguna manera'
    ];
    // ... (tu código de madrs y beck) ...
    const madrs = ['Tristeza aparente', /*...todas las demás...*/ 'Labilidad emocional'];
    const beck = ['Tristeza', /*...todas las demás...*/ 'Pérdida de interés en el sexo'];

    const inserts = [];
    phq9.forEach((q, i) => inserts.push(['phq9', i + 1, q, 3]));
    madrs.forEach((q, i) => inserts.push(['madrs', i + 1, q, 6]));
    beck.forEach((q, i) => inserts.push(['beck', i + 1, q, 3]));

    const values = inserts.map(() => '(?, ?, ?, ?)').join(',');
    const flat = inserts.flat();
    await query(
      `INSERT INTO survey_questions (type, item_index, question_text, max_score) VALUES ${values}`,
      flat
    );
    console.log('Preguntas insertadas exitosamente.');
  }
}

module.exports = {
  getPool,
  query,
  initSchema,
};
