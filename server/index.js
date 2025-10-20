const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

const { initSchema } = require('./db'); 

const app = express();
app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/surveys', require('./routes/surveys'));
app.use('/api/me', require('./routes/me'));

const PORT = process.env.PORT || 4000;

initSchema()
  .then(() => {
    app.listen(PORT, () => console.log(`MoodTrack API escuchando en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error('Fallo al inicializar la base de datos', err);
    process.exit(1);
  });

 