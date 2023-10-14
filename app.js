const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./db.js'); // Importa la instancia de sequelize

const app = express();

app.use(cors());

app.use(bodyParser.json());

// Ruta para crear un dato
app.post('/datos', async (req, res) => {
  try {
    const { fecha, ppm, latitud, longitud } = req.body;

    // Consulta SQL para insertar un nuevo dato
    const query = `INSERT INTO datos (fecha, ppm, latitud, longitud) VALUES (?, ?, ?, ?)`;
    
    // Ejecutar la consulta
    await sequelize.query(query, {
      replacements: [ fecha, ppm, latitud, longitud ],
      type: sequelize.QueryTypes.INSERT,
    });

    res.status(201).json({ message: 'Dato insertado correctamente' });
  } catch (error) {
    console.error('Error al insertar datos:', error);
    res.status(500).json({ error: 'No se pudo insertar el dato en la base de datos.' });
  }
});

// Ruta para obtener todos los datos
app.get('/datos', async (req, res) => {
  try {
    // Consulta SQL para obtener todos los datos
    const query = `SELECT * FROM datos`;
    
    // Ejecutar la consulta
    const datos = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    
    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los datos de la base de datos.' });
  }
});

// Ruta para obtener el dato mas reciente
app.get('/datos/obtenerReciente', async (req, res) => {
  try {
    // Consulta SQL para obtener todos los datos
    const query = `SELECT * FROM datos ORDER BY fecha DESC LIMIT 1`;
    
    // Ejecutar la consulta
    const datos = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    
    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los datos de la base de datos.' });
  }
});

// Ruta para eliminar el último dato insertado
app.delete('/datos/borrarUltimo', async (req, res) => {
  try {
    // Consulta SQL para obtener el último ID insertado
    const getLastIdQuery = 'SELECT * FROM datos ORDER BY fecha DESC';
    const [maxIdResult] = await sequelize.query(getLastIdQuery, { type: sequelize.QueryTypes.SELECT });
    
    const lastInsertedId = maxIdResult[0].maxId;

    if (lastInsertedId) {
      // Si encontramos un ID válido
      const deleteQuery = 'DELETE FROM datos WHERE id = ?';
      const [result] = await sequelize.query(deleteQuery, {
        replacements: [lastInsertedId],
        type: sequelize.QueryTypes.DELETE,
      });

      if (result) {
        // Si se eliminó correctamente
        res.status(200).json({ message: 'Último dato eliminado correctamente' });
      } else {
        res.status(500).json({ error: 'No se pudo eliminar el último dato' });
      }
    } else {
      // Si no se encontró un ID válido
      res.status(404).json({ error: 'No se encontraron datos para eliminar' });
    }
  } catch (error) {
    console.error('Error al eliminar último dato:', error);
    res.status(500).json({ error: 'No se pudo eliminar el último dato de la base de datos.' });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

module.exports = app;
