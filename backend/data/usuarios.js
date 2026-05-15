const { readData, writeData } = require('./fileDb');

module.exports = {
  get: () => readData('usuarios.json'),
  set: (data) => writeData('usuarios.json', data)
};