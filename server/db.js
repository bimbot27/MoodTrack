const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

let pool;

async function getPool() {
  if (!pool) {
    pool = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
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
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(120) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;

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

    CREATE OR REPLACE VIEW v_latest_response_per_instrument AS
    SELECT r.*
    FROM responses r
    JOIN (
      SELECT user_id, instrument, MAX(ts) AS max_ts
      FROM responses
      GROUP BY user_id, instrument
    ) x ON x.user_id = r.user_id AND x.instrument = r.instrument AND x.max_ts = r.ts;
  `);

  // Seed questions if empty
  const existing = await query('SELECT COUNT(*) as c FROM survey_questions');
  const count = existing[0]?.c || 0;
  if (count === 0) {
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

    const madrs = [
      'Tristeza aparente',
      'Tristeza reportada',
      'Tensión interna',
      'Sueño reducido',
      'Apetito reducido',
      'Dificultad de concentración',
      'Incapacidad para sentir',
      'Pesimismo',
      'Pensamientos suicidas',
      'Labilidad emocional'
    ];

    const beck = [
      'Tristeza', 'Pesimismo', 'Fracaso', 'Pérdida de placer', 'Sentimientos de culpa',
      'Sentimientos de castigo', 'Autodesprecio', 'Autocrítica', 'Pensamientos o deseos suicidas', 'Llanto',
      'Agitación', 'Pérdida de interés', 'Indecisión', 'Desvalorización', 'Pérdida de energía',
      'Cambios en los hábitos de sueño', 'Irritabilidad', 'Cambios en el apetito', 'Dificultad de concentración', 'Cansancio o fatiga', 'Pérdida de interés en el sexo'
    ];

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
  }
}

module.exports = {
  getPool,
  query,
  initSchema,
};
