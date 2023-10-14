const app = require('../app.js');
const request = require('supertest');
const { expect } = require('chai');
const { format } = require('date-fns'); //libreria para fechas

describe('API REST', () => {
  // Test post 
  it('debería crear un dato', async () => {
    const fechaActual = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const res = await request(app)
      .post('/datos')
      .send({ 
        fecha: fechaActual,
        ppm: 125,
        latitud: 10,
        longitud: 10
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message', 'Dato insertado correctamente'); // Ajusta a la propiedad correcta 'message'
  });

  // Test get todos
  it('debería obtener todos los datos', async () => {
    const res = await request(app).get('/datos');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  // Test get ultimo
  it('debería obtener todos los datos', async () => {
    const res = await request(app).get('/datos/obtenerReciente');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  // Test borrar ultimo
});